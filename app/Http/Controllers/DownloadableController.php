<?php

namespace App\Http\Controllers;

use App\Models\Download;
use Illuminate\Support\Facades\Cache;

class DownloadableController extends Controller
{
    public function index()
    {
        $downloads = Cache::remember('downloads', 21600, function() {
            return Download::all();
        });

        return inertia('download', compact('downloads'));
    }
}
