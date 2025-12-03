<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Support\Facades\Cache;

class CompanyProfileController extends Controller
{
    public function index()
    {
        $forms = Cache::remember('active_forms', 21600, function() {
            return Form::where('is_active', true)
                ->where(function ($q) {
                    $q->where('end_date', '>', now())
                        ->orWhereNull('end_date');
                })
                ->orderByDesc('created_at')
                ->limit(3)
                ->get();
        });

        return inertia('welcome', [
            'forms' => $forms,
        ]);
    }
}
