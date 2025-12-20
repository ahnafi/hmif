<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Download extends Model
{
    use SoftDeletes;

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($download) {
            if ($download->file && Storage::exists($download->file)) {
                Storage::delete($download->file);
            }
        });
    }

    protected $fillable = [
        'name',
        'description',
        'file',
        'link',
    ];

}
