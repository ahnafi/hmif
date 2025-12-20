<?php

use App\Http\Controllers\YouTubeController;
use Illuminate\Support\Facades\Route;

// YouTube Videos API
Route::get('/api/youtube-videos', [YouTubeController::class, 'getLatestVideos']);
