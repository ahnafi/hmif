<?php

namespace App\Http\Controllers;

use App\Models\Deposit;
use App\Models\DepositFund;
use App\Models\DepositPenalty;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Support\Facades\Cache;

class DepositController extends Controller
{
    public function index(): View
    {
        $deposits = Cache::remember('deposits_index', 43200, function() {
            return Deposit::with(["administrator.division", "depositPenalties", "depositFunds"])->get();
        });
        // dd($deposits);

        return view("deposit.index", compact('deposits'));
    }

    public function history(): View
    {
        $page = request()->get('page', 1);
        $cacheKey = 'deposit_history_page_' . $page;
        
        $data = Cache::remember($cacheKey, 43200, function() {
            $histories = DepositFund::with("deposit.administrator.division", 'fund')
                ->orderBy('created_at')
                ->paginate(10);

            $penaltyHistories = DepositPenalty::with('deposit.administrator.division')
                ->orderBy('created_at')
                ->paginate(10);
                
            return [
                'histories' => $histories,
                'penaltyHistories' => $penaltyHistories
            ];
        });

        return view('deposit.history', [
            'histories' => $data['histories'],
            'penaltyHistories' => $data['penaltyHistories']
        ]);
    }
}
