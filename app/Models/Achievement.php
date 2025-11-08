<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Achievement extends Model
{
    use SoftDeletes;
    protected $table = 'achievements';

    protected $fillable = [
        'name',
        'organizer',
        'description',
        'images',
        'proof',
        'awarded_at',
        'approval',
        'achievement_type_id',
        'achievement_category_id',
        'achievement_level_id',
    ];

    protected $casts = [
      'images' => 'array',
    ];

    public function achievementType(): BelongsTo
    {
        return $this->belongsTo(AchievementType::class);
    }

    public function achievementCategory(): BelongsTo
    {
        return $this->belongsTo(AchievementCategory::class);
    }

    public function achievementLevel(): BelongsTo
    {
        return $this->belongsTo(AchievementLevel::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'achievement_student', 'achievement_id', 'student_id')
            ->withTimestamps();
    }

}
