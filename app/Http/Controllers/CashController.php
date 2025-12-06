<?php

namespace App\Http\Controllers;

use App\Models\Cash;
use App\Models\CashFund;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Support\Facades\Cache;

class CashController extends Controller
{
    public function index(): View
    {
        $cashs = Cache::remember('cashs_index', 43200, function() {
            return Cash::with('cashFunds', 'administrator.division')->get();
        });
        return view("cash.index", compact("cashs"));
    }

    public function history(): View
    {
        $page = request()->get('page', 1);
        $cacheKey = 'cash_history_page_' . $page;
        
        $histories = Cache::remember($cacheKey, 43200, function() {
            return CashFund::with('cash.administrator.division', 'fund')
                ->orderBy('created_at')
                ->paginate(10);
        });
        return view('cash.history', compact('histories'));
    }
}
