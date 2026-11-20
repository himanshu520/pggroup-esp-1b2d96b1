-- Add Standard Departments for Plant 2060 (DMIC NOIDA - Greater Noida)

DO $$
DECLARE
  v_plant_id uuid;
BEGIN
  SELECT id INTO v_plant_id FROM public.plants WHERE code = '2060' LIMIT 1;
  
  IF v_plant_id IS NOT NULL THEN
    INSERT INTO public.departments (plant_id, code, name, is_pe, active)
    VALUES
      (v_plant_id, 'ACC-2060', 'ACCOUNTS & FINANCE', false, true),
      (v_plant_id, 'ASSLY-2060', 'ASSEMBLY', false, true),
      (v_plant_id, 'DISP-2060', 'DISPATCH', false, true),
      (v_plant_id, 'EHS-2060', 'EHS', false, true),
      (v_plant_id, 'HDR-2060', 'HEADER SHOP', false, true),
      (v_plant_id, 'HE-2060', 'HEAT EXCHANGER (HE)', false, true),
      (v_plant_id, 'HR-2060', 'HR & ADMIN', false, true),
      (v_plant_id, 'IDU-2060', 'IDU', false, true),
      (v_plant_id, 'IE-2060', 'IMPORT & EXPORT', false, true),
      (v_plant_id, 'INN-2060', 'INNOVATION AND PE', true, true),
      (v_plant_id, 'IT-2060', 'IT', false, true),
      (v_plant_id, 'LOG-2060', 'LOGISTICS', false, true),
      (v_plant_id, 'MARK-2060', 'MARKETING', false, true),
      (v_plant_id, 'MFG-2060', 'MANUFACTURING', false, true),
      (v_plant_id, 'MLD-2060', 'MOULDING', false, true),
      (v_plant_id, 'MNT-2060', 'MAINTENANCE', false, true),
      (v_plant_id, 'NBM-2060', 'NEW BUSINESS DEVELOPMENT', false, true),
      (v_plant_id, 'ODU-2060', 'ODU', false, true),
      (v_plant_id, 'OPR-2060', 'OPERATIONS', false, true),
      (v_plant_id, 'PCB-2060', 'PCB', false, true),
      (v_plant_id, 'PNT-2060', 'PAINT SHOP', false, true),
      (v_plant_id, 'PPC-2060', 'PPC', false, true),
      (v_plant_id, 'PROD-2060', 'PRODUCTION', false, true),
      (v_plant_id, 'PRS-2060', 'PRESS SHOP', false, true),
      (v_plant_id, 'PUR-2060', 'PURCHASE', false, true),
      (v_plant_id, 'QA-2060', 'QUALITY', false, true),
      (v_plant_id, 'RD-2060', 'R&D', false, true),
      (v_plant_id, 'SMT-2060', 'SMT', false, true),
      (v_plant_id, 'STR-2060', 'STORE', false, true),
      (v_plant_id, 'TR-2060', 'TOOL ROOM', false, true)
    ON CONFLICT (plant_id, code) DO NOTHING;
  END IF;
END $$;
