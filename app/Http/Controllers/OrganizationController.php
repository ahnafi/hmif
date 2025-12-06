<?php

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\WorkProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class OrganizationController extends Controller
{
    public function workPrograms(Request $request)
    {
        $data = Cache::remember('work_programs', 21600, function() {
            $workPrograms = WorkProgram::with(['division', 'workProgramAdministrators.administrator'])
                ->orderBy('created_at', 'desc')
                ->get();
                
            $divisions = Division::orderBy('name')->get();
            
            return [
                'workPrograms' => $workPrograms,
                'divisions' => $divisions
            ];
        });

        return inertia('work-program/index', [
            'workPrograms' => $data['workPrograms'],
            'divisions' => $data['divisions']
        ]);
    }

    public function detailWorkProgram(WorkProgram $workProgram)
    {
        $cacheKey = 'work_program_' . $workProgram->id;
        
        $workProgram = Cache::remember($cacheKey, 21600, function() use ($workProgram) {
            $workProgram->load(['division', 'workProgramAdministrators.administrator']);
            return $workProgram;
        });

        return inertia('work-program/show', [
            'workProgram' => $workProgram
        ]);
    }
}
