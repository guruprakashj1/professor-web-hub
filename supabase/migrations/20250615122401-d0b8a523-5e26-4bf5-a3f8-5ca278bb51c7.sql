
-- Add unique constraint on data_type column to enable upsert operations
ALTER TABLE public.portal_data 
ADD CONSTRAINT portal_data_data_type_unique UNIQUE (data_type);
