-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Allow public access to the bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- Allow authenticated users to upload
create policy "Authenticated users can upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'images' );