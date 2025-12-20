<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class WorkProgram extends Model
{
    protected $table = 'work_programs';

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($workProgram) {
            if ($workProgram->images && is_array($workProgram->images)) {
                foreach ($workProgram->images as $image) {
                    if ($image && Storage::exists($image)) {
                        Storage::delete($image);
                    }
                }
            }
        });
    }

    protected $fillable = [
        'name',
        'description',
        'type',
        'images',
        'division_id',
    ];

    protected $casts = [
        'images' => 'array',
    ];

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    public function WorkProgramAdministrators(): HasMany
    {
        return $this->hasMany(WorkProgramAdministrator::class);
    }
}
