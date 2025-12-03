<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $cacheKey = 'articles_' . md5(serialize($request->all()) . $request->get('page', 1));
        
        $data = Cache::remember($cacheKey, 7200, function() use ($request) {
            $query = Article::with(['author', 'category']);

            // Filter by search term
            if ($request->filled('search')) {
                $search = $request->get('search');
                $query->where(function($q) use ($search) {
                    $q->where('title', 'LIKE', "%{$search}%")
                      ->orWhere('content', 'LIKE', "%{$search}%");
                });
            }

            // Filter by category
            if ($request->filled('category') && $request->get('category') !== 'all') {
                $query->where('category_id', $request->get('category'));
            }

            $articles = $query->orderBy('created_at', 'desc')
                             ->paginate(9)
                             ->withQueryString();

            $categories = Category::orderBy('name')->get();
            
            return [
                'articles' => $articles,
                'categories' => $categories
            ];
        });

        $articles = $data['articles'];
        $categories = $data['categories'];

        return inertia('articles/index', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => [
                'search' => $request->get('search'),
                'category' => $request->get('category', 'all'),
            ]
        ]);
    }

    public function show(Article $article)
    {
        $cacheKey = 'article_' . $article->id;
        
        $data = Cache::remember($cacheKey, 7200, function() use ($article) {
            $article->load(['author', 'category']);
            
            // Get related articles (same category, excluding current article)
            $relatedArticles = Article::with(['author', 'category'])
                ->where('category_id', $article->category_id)
                ->where('id', '!=', $article->id)
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get();

            // Get recent articles
            $recentArticles = Article::with(['author', 'category'])
                ->where('id', '!=', $article->id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
                
            return [
                'article' => $article,
                'relatedArticles' => $relatedArticles,
                'recentArticles' => $recentArticles
            ];
        });

        return inertia('articles/show', [
            'article' => $data['article'],
            'relatedArticles' => $data['relatedArticles'],
            'recentArticles' => $data['recentArticles']
        ]);
    }
}