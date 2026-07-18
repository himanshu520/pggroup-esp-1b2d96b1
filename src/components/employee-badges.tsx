import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Trophy, Award, Flame, Lightbulb } from "lucide-react";

export function EmployeeBadges({ employeeId, className = "" }: { employeeId?: string | null; className?: string }) {
  const { data: badge } = useQuery({
    queryKey: ["employee-badge", employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      const { data } = await supabase
        .from("employee_badges" as any)
        .select("*")
        .eq("employee_id", employeeId!)
        .maybeSingle();
      return data as any;
    },
    staleTime: 60000, // cache for 1 minute to avoid repeated fetching
  });

  if (!badge) return null;

  const showThinker = badge.badge_thinker && !badge.badge_innovator && !badge.badge_champion;

  return (
    <span className={`inline-flex items-center gap-1.5 flex-wrap ${className}`}>
      {badge.badge_champion && (
        <span 
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" 
          title="Innovation Champion (10+ implemented suggestions)"
        >
          <Trophy className="w-3 h-3" /> Champion
        </span>
      )}
      {badge.badge_innovator && (
        <span 
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" 
          title="Rising Innovator (5+ implemented suggestions)"
        >
          <Award className="w-3 h-3" /> Innovator
        </span>
      )}
      {showThinker && (
        <span 
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
          title="Creative Thinker (First implemented suggestion)"
        >
          <Lightbulb className="w-3 h-3" /> Thinker
        </span>
      )}
      {badge.badge_improver && (
        <span 
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20" 
          title="Continuous Improver (Implemented in 3 consecutive months)"
        >
          <Flame className="w-3 h-3 animate-pulse" /> Continuous
        </span>
      )}
      {badge.badge_winner && (
        <span 
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20" 
          title="Best Suggestion Winner"
        >
          <Sparkles className="w-3 h-3" /> Best Idea
        </span>
      )}
    </span>
  );
}
