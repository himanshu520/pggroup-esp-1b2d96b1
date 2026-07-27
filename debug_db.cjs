const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.vercel', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim().replace(/"/g, '');
  }
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data, error } = await supabase.rpc('exec_sql', { query: "SELECT conname FROM pg_constraint WHERE conrelid = 'public.best_suggestions'::regclass;" });
  if (error) {
     console.log("RPC exec_sql failed or doesn't exist, falling back to manual checking.");
  } else {
     console.log(data);
  }
}

main().catch(console.error);
