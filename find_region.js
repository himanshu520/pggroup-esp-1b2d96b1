import pg from 'pg';

const regions = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
  "ca-central-1",
  "sa-east-1"
];

async function testRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const connectionString = `postgresql://postgres.hjnctinqgpxsoiocljax:Himanshu%40121106@${host}:6543/postgres`;
  
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });
  
  try {
    await client.connect();
    console.log(`\n=========================================`);
    console.log(`SUCCESS! Connected to region: ${region}`);
    console.log(`Host: ${host}`);
    console.log(`=========================================`);
    
    // Run the table creation
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
    await client.query(query);
    console.log("Successfully created employee_otps table!");
    await client.end();
    return true;
  } catch (err) {
    if (err.message && err.message.includes("tenant/user")) {
      // Host is correct network-wise, but tenant not found on this region's pooler
      console.log(`Region ${region}: Host reachable, but tenant not found.`);
    } else {
      console.log(`Region ${region}: Failed with error: ${err.message || err}`);
    }
    try { await client.end(); } catch {}
    return false;
  }
}

async function run() {
  console.log("Testing regions in parallel...");
  for (const region of regions) {
    const ok = await testRegion(region);
    if (ok) {
      process.exit(0);
    }
  }
  console.log("All regions failed!");
  process.exit(1);
}

run();
