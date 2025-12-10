<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Article extends Model
{
    use SoftDeletes;

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($article) {
            if ($article->thumbnail && Storage::exists($article->thumbnail)) {
                Storage::delete($article->thumbnail);
            }
        });
    }

    protected $fillable = [
        "title",
        "slug",
        "thumbnail",
        "content",
        "author_id",
        "category_id"
    ];

    public function setTitleAttribute($value): void
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function banner(): HasOne
    {
        return $this->hasOne(Banner::class);
    }
}
