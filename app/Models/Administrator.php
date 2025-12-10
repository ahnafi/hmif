<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Administrator extends Model
{
    use SoftDeletes;

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($administrator) {
            if ($administrator->image && Storage::exists($administrator->image)) {
                Storage::delete($administrator->image);
            }
        });
    }

    protected $fillable = [
        'name',
        'image',
        'division_id'
    ];

    protected $dates = ['deleted_at'];

    /**
     * Get the division that owns the administrator
     */
    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    /**
     * Get deposits for this administrator
     */
    public function deposit(): HasOne
    {
        return $this->hasOne(Deposit::class);
    }

    /**
     * Get cashes for this administrator
     */
    public function cash(): HasOne
    {
        return $this->hasOne(Cash::class);
    }

    /**
     * Ilteks cash
     */
    public function iltekCash(): HasMany
    {
        return $this->hasMany(IltekCash::class);
    }

    /**
     * Ilteks cash
     */
    public function kreusCash(): HasMany
    {
        return $this->hasMany(KreusCash::class);
    }

    /**
     * Ilteks cash
     */
    public function mikatCash(): HasMany
    {
        return $this->hasMany(MikatCash::class);
    }

    public function WorkProgramAdministrator(): HasMany
    {
        return $this->hasMany(Administrator::class);
    }

}
