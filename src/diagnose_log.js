const fs = require('fs');

const logPath = 'C:\\Users\\Himanshu\\.gemini\\antigravity-ide\\brain\\034a5d6f-034f-4e02-952d-9b7764d4a602\\.system_generated\\logs\\transcript_full.jsonl';

try {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i]) continue;
    const step = JSON.parse(lines[i]);
    if (step.source === 'USER_EXPLICIT' && step.type === 'USER_INPUT' && step.content.includes('DOCTYPE')) {
      console.log('Found step index:', step.step_index);
      console.log('Content preview:', step.content.substring(0, 200));
      console.log('Does content contain <!DOCTYPE html>?', step.content.includes('<!DOCTYPE html>'));
      console.log('Does content contain </html>?', step.content.includes('</html>'));
      break;
    }
  }
} catch (err) {
  console.error(err);
}
