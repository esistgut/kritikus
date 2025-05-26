import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export default function UploadSound() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('sound', file);
    formData.append('name', name);

    router.post('/sounds', formData, {
      onSuccess: () => {
        setFile(null);
        setName('');
        setIsUploading(false);
        // Reset file input
        const fileInput = document.getElementById('sound-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      onError: () => {
        setIsUploading(false);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload New Sound
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="sound-file" className="block text-sm font-medium mb-2">
              Sound File (MP3, WAV, OGG, M4A)
            </label>
            <Input
              id="sound-file"
              type="file"
              accept=".mp3,.wav,.ogg,.m4a"
              onChange={handleFileChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="sound-name" className="block text-sm font-medium mb-2">
              Sound Name
            </label>
            <Input
              id="sound-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter sound name..."
            />
          </div>

          <Button
            type="submit"
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Sound'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}