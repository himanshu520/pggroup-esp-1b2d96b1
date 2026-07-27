-- Add image_url, before_image_url, and after_image_url columns to best_suggestions table for Poka-Yoke proof photos
ALTER TABLE best_suggestions ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE best_suggestions ADD COLUMN IF NOT EXISTS before_image_url text;
ALTER TABLE best_suggestions ADD COLUMN IF NOT EXISTS after_image_url text;
