<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Sound extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'filename',
        'original_filename',
        'volume',
        'loop',
    ];

    protected $casts = [
        'volume' => 'float',
        'loop' => 'boolean',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return asset('storage/sounds/' . $this->filename);
    }

    public function delete()
    {
        // Delete the file when deleting the sound record
        if (Storage::disk('public')->exists('sounds/' . $this->filename)) {
            Storage::disk('public')->delete('sounds/' . $this->filename);
        }

        return parent::delete();
    }
}