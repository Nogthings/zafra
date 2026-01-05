-- Storage policies for avatars bucket
-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow everyone to view avatars (public read access)
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
