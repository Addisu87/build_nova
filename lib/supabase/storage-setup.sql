-- Enable storage if not already enabled
create extension if not exists "storage" schema "extensions";

-- Enable RLS on buckets table
alter table storage.buckets enable row level security;

-- Create policies for bucket management
create policy "Allow bucket creation for authenticated users with admin role" on storage.buckets
for all using (
    auth.jwt() ->> 'role' = 'admin'
);

-- Create policies for objects management
create policy "Allow public read access to images bucket"
on storage.objects for select
using (bucket_id = 'images');

create policy "Allow authenticated users to upload to images bucket"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = 'properties'
);

create policy "Allow authenticated users to update their own uploads"
on storage.objects for update
to authenticated
using (
    bucket_id = 'images'
    and auth.uid() = owner
);

create policy "Allow authenticated users to delete their own uploads"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'images'
    and auth.uid() = owner
);

-- Create the images bucket if it doesn't exist (must be executed with admin rights)
do $$
begin
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
      'images',
      'images',
      true,
      5242880, -- 5MB in bytes
      array['image/jpeg', 'image/png', 'image/webp']
  )
  on conflict (id) do update
  set 
      public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];
end $$;
