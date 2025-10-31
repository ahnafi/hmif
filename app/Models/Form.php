<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Form extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'thumbnail',
        'description',
        'fields',
        'is_active',
        'allow_multiple_submissions',
        'is_anonymous',
        'submission_limit',
        'start_date',
        'end_date',
        'redirect'
    ];

    protected $casts = [
        'fields' => 'array',
        'is_active' => 'boolean',
        'allow_multiple_submissions' => 'boolean',
        'is_anonymous' => 'boolean',
        'submission_limit' => 'integer',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($form) {
            if (empty($form->slug)) {
                $form->slug = Str::slug($form->title);
            }
        });
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(FormSubmission::class);
    }

    public function getSubmissionCountAttribute(): int
    {
        return $this->submissions()->count();
    }

    public function isAcceptingSubmissions(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();
        
        if ($this->start_date && $now->isBefore($this->start_date)) {
            return false;
        }

        if ($this->end_date && $now->isAfter($this->end_date)) {
            return false;
        }

        if ($this->submission_limit && $this->submission_count >= $this->submission_limit) {
            return false;
        }

        return true;
    }
}
