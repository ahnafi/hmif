<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\AchievementCategory;
use App\Models\AchievementLevel;
use App\Models\AchievementType;
use Illuminate\Http\Request;

class StudentAchievementController extends Controller
{
    public function index(Request $request)
    {
        $query = Achievement::with([
            'achievementType',
            'achievementCategory',
            'achievementLevel',
            'students',
        ])->where('approval', true);

        // Filter by search term
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%")
                    ->orWhereHas('students', function ($studentQuery) use ($search) {
                        $studentQuery->where('name', 'LIKE', "%{$search}%");
                    });
            });
        }

        // Filter by type
        if ($request->filled('type') && $request->get('type') !== 'all') {
            $query->where('achievement_type_id', $request->get('type'));
        }

        // Filter by category
        if ($request->filled('category') && $request->get('category') !== 'all') {
            $query->where('achievement_category_id', $request->get('category'));
        }

        // Filter by level
        if ($request->filled('level') && $request->get('level') !== 'all') {
            $query->where('achievement_level_id', $request->get('level'));
        }

        // Filter by year
        if ($request->filled('year') && $request->get('year') !== 'all') {
            $query->whereYear('awarded_at', $request->get('year'));
        }

        $achievements = $query->orderBy('awarded_at', 'desc')
            ->paginate(9)
            ->withQueryString();

        $types = AchievementType::orderBy('name')->get();
        $categories = AchievementCategory::orderBy('name')->get();
        $levels = AchievementLevel::orderBy('name')->get();

        // Get available years
        $years = Achievement::selectRaw('YEAR(awarded_at) as year')
            ->where('approval', true)
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year');

        // Get top 3 students by achievement count
        $topStudents = \DB::table('achievement_student')
            ->join('achievements', 'achievement_student.achievement_id', '=', 'achievements.id')
            ->join('students', 'achievement_student.student_id', '=', 'students.id')
            ->where('achievements.approval', true)
            ->select(
                'students.id',
                'students.nim',
                'students.name',
                \DB::raw('COUNT(achievement_student.achievement_id) as achievement_count')
            )
            ->groupBy('students.id', 'students.nim', 'students.name')
            ->orderByDesc('achievement_count')
            ->orderBy('students.nim', 'asc')
            ->limit(3)
            ->get();

        return inertia('if-bangga', [
            'achievements' => $achievements,
            'types' => $types,
            'categories' => $categories,
            'levels' => $levels,
            'years' => $years,
            'topStudents' => $topStudents,
            'filters' => [
                'search' => $request->get('search'),
                'type' => $request->get('type', 'all'),
                'category' => $request->get('category', 'all'),
                'level' => $request->get('level', 'all'),
                'year' => $request->get('year', 'all'),
            ],
        ]);
    }

    public function form()
    {
        $types = AchievementType::orderBy('name')->get();
        $categories = AchievementCategory::orderBy('name')->get();
        $levels = AchievementLevel::orderBy('name')->get();
        $students = \App\Models\Student::select('id', 'nim', 'name')
            ->orderBy('nim')
            ->get();

        return view('forms.achievement', compact(['types', 'categories', 'levels', 'students']));
    }

    public function create(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'proof' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'awarded_at' => 'nullable|date',
            'achievement_type_id' => 'required|exists:achievement_types,id',
            'achievement_category_id' => 'required|exists:achievement_categories,id',
            'achievement_level_id' => 'required|exists:achievement_levels,id',
            'student_nims' => 'required|string',
        ], [
            'name.required' => 'Nama prestasi wajib diisi',
            'description.required' => 'Deskripsi wajib diisi',
            'image.required' => 'Foto dokumentasi wajib diupload',
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus JPG, JPEG, atau PNG',
            'image.max' => 'Ukuran gambar maksimal 1MB',
            'proof.image' => 'File sertifikat harus berupa gambar',
            'proof.mimes' => 'Format sertifikat harus JPG, JPEG, atau PNG',
            'proof.max' => 'Ukuran sertifikat maksimal 1MB',
            'achievement_type_id.required' => 'Jenis prestasi wajib dipilih',
            'achievement_category_id.required' => 'Kategori prestasi wajib dipilih',
            'achievement_level_id.required' => 'Tingkat prestasi wajib dipilih',
            'student_nims.required' => 'NIM mahasiswa wajib diisi',
        ]);

        // Parse student NIMs
        $nims = array_map('trim', explode(',', $validated['student_nims']));

        // Validate that all NIMs exist in students table
        $students = \App\Models\Student::whereIn('nim', $nims)->get();

        if ($students->count() !== count($nims)) {
            return response()->json([
                'message' => 'Beberapa NIM tidak ditemukan dalam database. Pastikan NIM yang dimasukkan sudah terdaftar.',
                'errors' => [
                    'student_nims' => ['NIM tidak valid atau tidak terdaftar'],
                ],
            ], 422);
        }

        try {
            // Handle image upload
            $imagePath = $request->file('image')->store('ifbangga-image', 'public');

            // Handle proof upload if exists
            $proofPath = null;
            if ($request->hasFile('proof')) {
                $proofPath = $request->file('proof')->store('ifbangga-proof', 'public');
            }

            // Create achievement with approval set to null for admin verification
            $achievement = Achievement::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'image' => $imagePath,
                'proof' => $proofPath,
                'awarded_at' => $validated['awarded_at'] ?? null,
                'achievement_type_id' => $validated['achievement_type_id'],
                'achievement_category_id' => $validated['achievement_category_id'],
                'achievement_level_id' => $validated['achievement_level_id'],
                'approval' => null, // Set to null for admin verification
            ]);

            // Attach students to achievement
            $achievement->students()->attach($students->pluck('id'));

            return response()->json([
                'message' => 'Prestasi berhasil dikirim dan menunggu verifikasi admin',
                'achievement' => $achievement,
            ], 201);

        } catch (\Exception $e) {
            // Clean up uploaded files if database operation fails
            if (isset($imagePath) && \Storage::disk('public')->exists($imagePath)) {
                \Storage::disk('public')->delete($imagePath);
            }
            if (isset($proofPath) && \Storage::disk('public')->exists($proofPath)) {
                \Storage::disk('public')->delete($proofPath);
            }

            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
