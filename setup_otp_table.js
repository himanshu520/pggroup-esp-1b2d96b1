import pg from 'pg';

// Supavisor IPv4 Pooler connection details for ap-south-1 (Mumbai)
const connectionString = "postgresql://postgres.hjnctinqgpxsoiocljax:Himanshu%40121106@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

const client = new pg.Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  console.log("Connecting to ap-south-1 pooler database...");
  await client.connect();
  console.log("Connected! Creating employee_otps table...");
  
  const query = `
    CREATE TABLE IF NOT EXISTS public.employee_otps (
      employee_code TEXT PRIMARY KEY,
      custom_otp TEXT NOT NULL,
      supabase_otp TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL
    );
    
    -- Enable RLS just in case, but we bypass it
    ALTER TABLE public.employee_otps ENABLE ROW LEVEL SECURITY;
    
    -- Grant permissions
    GRANT ALL ON public.employee_otps TO postgres;
    GRANT ALL ON public.employee_otps TO service_role;
    GRANT ALL ON public.employee_otps TO anon;
    GRANT ALL ON public.employee_otps TO authenticated;
  `;
  
  try {
    await client.query(query);
    console.log("Successfully created employee_otps table and set up permissions via ap-south-1 Pooler!");
  } catch (err) {
    console.error("Error running SQL query:", err);
  } finally {
    await client.end();
  }
}

run();
