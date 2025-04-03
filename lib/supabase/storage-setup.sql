-- Enable storage if not already enabled
create extension if not exists "storage" schema "extensions";

-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Allow public access to the bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- Allow authenticated users to upload
create policy "Authenticated users can upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'images' );

-- Allow authenticated users to delete their own uploads
create policy "Authenticated users can delete own uploads"
on storage.objects for delete
to authenticated
using ( bucket_id = 'images' AND auth.uid() = owner );
