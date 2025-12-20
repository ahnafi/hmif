<?php

use App\Http\Controllers\YouTubeController;
use Illuminate\Support\Facades\Route;

// YouTube Videos API
Route::get('/youtube-videos', [YouTubeController::class, 'getLatestVideos']);
