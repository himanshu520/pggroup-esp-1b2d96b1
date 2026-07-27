import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Trophy, Volume2, VolumeX, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"START" | "PLAYING" | "GAMEOVER">("START");
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("esp_dino_highscore") || 0);
    }
    return 0;
  });
  const [muted, setMuted] = useState<boolean>(true);

  // Game variables ref for animation frame stability
  const stateRef = useRef({
    gameState: "START" as "START" | "PLAYING" | "GAMEOVER",
    score: 0,
    highScore: 0,
    dinoY: 0,
    dinoVY: 0,
    isJumping: false,
    groundY: 150,
    obstacles: [] as { x: number; w: number; h: number; type: number }[],
    clouds: [] as { x: number; y: number; speed: number }[],
    speed: 5,
    frameCount: 0,
    animId: 0,
  });

  stateRef.current.gameState = gameState;
  stateRef.current.highScore = highScore;

  // Simple Web Audio API sound synthesizer
  const playSound = (type: "jump" | "score" | "hit") => {
    if (muted || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "jump") {
        osc.type = "square";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "hit") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "score") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {
      // Ignore audio context autoplay policy restrictions
    }
  };

  const triggerJump = () => {
    const s = stateRef.current;
    if (s.gameState === "START" || s.gameState === "GAMEOVER") {
      resetAndStart();
      return;
    }
    if (!s.isJumping) {
      s.dinoVY = -12;
      s.isJumping = true;
      playSound("jump");
    }
  };

  const resetAndStart = () => {
    const s = stateRef.current;
    s.gameState = "PLAYING";
    s.score = 0;
    s.dinoY = 0;
    s.dinoVY = 0;
    s.isJumping = false;
    s.obstacles = [];
    s.clouds = [
      { x: 100, y: 30, speed: 0.8 },
      { x: 300, y: 50, speed: 0.5 },
      { x: 500, y: 25, speed: 0.7 },
    ];
    s.speed = 5;
    s.frameCount = 0;

    setScore(0);
    setGameState("PLAYING");
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;

    const render = () => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Colors based on theme
      const isDark = document.documentElement.classList.contains("dark");
      const textColor = isDark ? "#e2e8f0" : "#1e293b";
      const groundColor = isDark ? "#475569" : "#94a3b8";
      const dinoColor = isDark ? "#38bdf8" : "#0284c7";
      const obstacleColor = isDark ? "#ef4444" : "#dc2626";

      // 1. Draw Clouds
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
      s.clouds.forEach((cloud) => {
        if (s.gameState === "PLAYING") {
          cloud.x -= cloud.speed;
          if (cloud.x < -60) cloud.x = canvas.width + 20;
        }
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 14, 0, Math.PI * 2);
        ctx.arc(cloud.x + 12, cloud.y - 6, 16, 0, Math.PI * 2);
        ctx.arc(cloud.x + 28, cloud.y, 14, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Ground
      ctx.strokeStyle = groundColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, s.groundY);
      ctx.lineTo(canvas.width, s.groundY);
      ctx.stroke();

      // Ground details (scrolling dots)
      ctx.fillStyle = groundColor;
      for (let i = 0; i < canvas.width; i += 20) {
        const dotX = (i - (s.frameCount * s.speed) % 20 + canvas.width) % canvas.width;
        ctx.fillRect(dotX, s.groundY + 6, 4, 2);
      }

      // 3. Update & Draw Player (Dino / ESP Runner)
      if (s.gameState === "PLAYING") {
        s.dinoVY += 0.65; // Gravity
        s.dinoY += s.dinoVY;

        if (s.dinoY >= 0) {
          s.dinoY = 0;
          s.dinoVY = 0;
          s.isJumping = false;
        }

        s.frameCount++;
        if (s.frameCount % 5 === 0) {
          s.score += 1;
          setScore(s.score);
          if (s.score % 100 === 0 && s.score > 0) {
            playSound("score");
            s.speed += 0.5; // Accelerate speed as score increases
          }
        }
      }

      const dinoX = 40;
      const dinoBaseY = s.groundY - 30 + s.dinoY;

      // Draw Pixel Dinosaur / ESP Runner
      ctx.fillStyle = dinoColor;
      // Head
      ctx.fillRect(dinoX + 14, dinoBaseY, 14, 10);
      // Eye
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(dinoX + 22, dinoBaseY + 2, 3, 3);
      // Body
      ctx.fillStyle = dinoColor;
      ctx.fillRect(dinoX + 6, dinoBaseY + 10, 18, 14);
      // Tail
      ctx.fillRect(dinoX, dinoBaseY + 12, 6, 6);

      // Running Legs Animation
      const legFrame = Math.floor(s.frameCount / 4) % 2;
      if (s.isJumping) {
        ctx.fillRect(dinoX + 8, dinoBaseY + 24, 4, 6);
        ctx.fillRect(dinoX + 16, dinoBaseY + 24, 4, 6);
      } else {
        if (legFrame === 0) {
          ctx.fillRect(dinoX + 8, dinoBaseY + 24, 4, 6);
          ctx.fillRect(dinoX + 16, dinoBaseY + 22, 4, 4);
        } else {
          ctx.fillRect(dinoX + 8, dinoBaseY + 22, 4, 4);
          ctx.fillRect(dinoX + 16, dinoBaseY + 24, 4, 6);
        }
      }

      // 4. Update & Draw Obstacles (Cacti / Signal Towers)
      if (s.gameState === "PLAYING") {
        // Spawn obstacles
        if (s.frameCount % Math.max(40, Math.floor(90 - s.speed * 4)) === 0) {
          const type = Math.random() > 0.5 ? 1 : 2;
          s.obstacles.push({
            x: canvas.width,
            w: type === 1 ? 16 : 24,
            h: type === 1 ? 32 : 40,
            type,
          });
        }
      }

      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        if (s.gameState === "PLAYING") {
          obs.x -= s.speed;
        }

        const obsY = s.groundY - obs.h;

        // Draw Cactus / Obstacle
        ctx.fillStyle = obstacleColor;
        ctx.fillRect(obs.x + obs.w * 0.35, obsY, obs.w * 0.3, obs.h);
        ctx.fillRect(obs.x, obsY + obs.h * 0.3, obs.w, obs.h * 0.15);
        ctx.fillRect(obs.x, obsY + obs.h * 0.1, obs.w * 0.2, obs.h * 0.3);
        ctx.fillRect(obs.x + obs.w * 0.8, obsY + obs.h * 0.2, obs.w * 0.2, obs.h * 0.3);

        // AABB Collision Detection
        if (
          dinoX < obs.x + obs.w &&
          dinoX + 28 > obs.x &&
          dinoBaseY < obsY + obs.h &&
          dinoBaseY + 30 > obsY
        ) {
          // HIT OBSTACLE - GAME OVER!
          s.gameState = "GAMEOVER";
          setGameState("GAMEOVER");
          playSound("hit");

          if (s.score > s.highScore) {
            s.highScore = s.score;
            setHighScore(s.score);
            if (typeof window !== "undefined") {
              localStorage.setItem("esp_dino_highscore", String(s.score));
            }
          }
        }

        // Remove offscreen obstacles
        if (obs.x < -40) {
          s.obstacles.splice(i, 1);
        }
      }

      // 5. Draw Game Overlay Text
      if (s.gameState === "START") {
        ctx.fillStyle = textColor;
        ctx.font = "bold 14px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Press Space or Click to Jump & Start Playing!", canvas.width / 2, 70);
      } else if (s.gameState === "GAMEOVER") {
        ctx.fillStyle = obstacleColor;
        ctx.font = "bold 18px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, 60);

        ctx.fillStyle = textColor;
        ctx.font = "12px Inter, sans-serif";
        ctx.fillText("Press Space or Tap to Try Again", canvas.width / 2, 85);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 shadow-lg space-y-3 max-w-lg mx-auto">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between text-xs border-b border-border pb-2">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <Gamepad2 className="w-4 h-4 text-primary animate-pulse" />
          <span>Offline Runner Mini-Game</span>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>HI {highScore.toString().padStart(5, "0")}</span>
          </div>
          <div className="font-bold text-foreground">
            SCORE {score.toString().padStart(5, "0")}
          </div>

          <button
            onClick={() => setMuted(!muted)}
            className="text-muted-foreground hover:text-foreground p-1 transition-colors"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Canvas Game Stage */}
      <div 
        className="relative cursor-pointer select-none rounded-lg overflow-hidden border border-border/60 bg-muted/20"
        onClick={triggerJump}
      >
        <canvas
          ref={canvasRef}
          width={560}
          height={170}
          className="w-full h-[150px] sm:h-[170px] block"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border font-mono text-[10px]">Space</kbd> or tap stage to jump</span>

        {gameState === "GAMEOVER" ? (
          <Button
            size="sm"
            variant="default"
            onClick={resetAndStart}
            className="h-7 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold"
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Play Again
          </Button>
        ) : gameState === "START" ? (
          <Button
            size="sm"
            variant="default"
            onClick={resetAndStart}
            className="h-7 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Play className="w-3 h-3 mr-1" /> Start Game
          </Button>
        ) : null}
      </div>
    </div>
  );
}
