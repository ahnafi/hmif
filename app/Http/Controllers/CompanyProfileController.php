<?php

namespace App\Http\Controllers;

use App\Models\Form;

class CompanyProfileController extends Controller
{
    public function index()
    {
        $forms = Form::where('is_active', true)
            ->where(function ($q) {
                $q->where('end_date', '>', now())
                    ->orWhereNull('end_date');
            })
            ->orderByDesc('created_at')
            ->limit(3)
            ->get();

        return inertia('welcome', [
            'forms' => $forms,
        ]);
    }
}
