<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CashController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\DepositController;
use App\Http\Controllers\DownloadableController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\IMagzController;
use App\Http\Controllers\LecturerController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\StudentAchievementController;
use Illuminate\Support\Facades\Route;

// Company Profile
Route::controller(CompanyProfileController::class)->group(function () {
    Route::get('/', "index")->name('home');
    Route::get('/visi-misi', fn () => inertia('about-hmif/vision-mission'))->name('vision.mission');
});

// Blog, News, and Articles
Route::controller(ArticleController::class)->group(function () {
    Route::get('/berita', 'index')->name('articles.index');
    Route::get('/berita/{article:slug}', 'show')->name('articles.show');
});

// Lecturer
Route::controller(LecturerController::class)->group(function () {
    Route::get('/dosen', 'index')->name('lecturer');
});

// Downloadable
Route::controller(DownloadableController::class)->group(function () {
    Route::get('/unduhan', 'index')->name('download');
});

// I-Magz
Route::controller(IMagzController::class)->group(function () {
    Route::get('/i-magz', 'index')->name('imagz.index');
    Route::get('/i-magz/{magazine}', 'show')->name('imagz.show');
    Route::get('/i-magz/{magazine}/download', 'download')->name('imagz.download');
});

// Organisasi
Route::controller(OrganizationController::class)->group(function () {
    Route::get('/struktur-organisasi', function () {
        return inertia('about-hmif/organization-structure');
    })->name('organization.structure');
    Route::get('/proker-divisi', 'workPrograms')->name('work-program.index');
    Route::get('/proker-divisi/{workProgram}', 'detailWorkProgram')->name('work-program.show');
});

// IF Bangga
Route::controller(StudentAchievementController::class)->group(function () {
    Route::get('/if-bangga', 'index')->name('student.achievements.index');
    Route::get('/if-bangga/formulir', 'form')->name('student.achievements.form');
    Route::post('/if-bangga', 'create')->name('student.achievements.create')->middleware('throttle:3,2');
});

// keuangan
Route::prefix('keuangan')->group(function () {
    Route::get('/', [CashController::class, 'index'])->name('cash.index');
    Route::get('/riwayat', [CashController::class, 'history'])->name('cash.history');
    Route::get('/deposit', [DepositController::class, 'index'])->name('deposit.index');
    Route::get('/deposit/riwayat', [DepositController::class, 'history'])->name('deposit.history');
});

// Form Builder Routes
Route::prefix('forms')->group(function () {
    Route::get('/{slug}', [FormController::class, 'show'])->name('forms.show');
    Route::post('/{slug}/submit', [FormController::class, 'submit'])->name('forms.submit')->middleware('throttle:3,2');
});


// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
