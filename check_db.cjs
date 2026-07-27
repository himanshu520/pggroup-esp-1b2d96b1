const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.vercel', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/"/g, '');
    env[k] = v;
  }
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function addColumns() {
  console.log('Testing adding columns to best_suggestions...');
  // Try inserting dummy with columns to check if Supabase accepts them
  const dummy = {
    suggestion_id: "6043fde9-9c1c-4015-be7c-4992c7738db2",
    month: 7,
    year: 2026,
    category: "foolproofing",
    image_url: "https://example.com/test.png",
    before_image_url: "https://example.com/before.png",
    after_image_url: "https://example.com/after.png"
  };
  
  const { data, error } = await supabase.from('best_suggestions').upsert(dummy).select('*');
  console.log('UPSERT RESULT:', data, 'ERROR:', error);
}

addColumns();
