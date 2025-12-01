<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class LandingPageTest extends DuskTestCase
{
    /**
     * Homepage hmif
     */
    public function test_home_page(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                ->assertSee('HMIF Unsoed')
                ->scrollTo('footer')
                ->assertPresent('img[alt="Logo Kabinet Arditasena"]')
                ->pause(500);
        });
    }

    public function test_berita_page(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visitRoute('articles.index')
                ->assertSee('Berita & Artikel')
                ->scrollTo('footer')
                ->waitFor('footer', 500)
                ->assertSee('aftar Artikel & Berita')
                ->pause(500);
        });
    }

    public function test_vision_mission_page(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visitRoute('vision.mission')
                ->assertSee('Visi & Misi HMIF Unsoed')
                ->assertSee('Visi HMIF Unsoed')
                ->assertSee('Misi HMIF Unsoed')
                ->assertSee('Menuju Informatika Unggul dan Berprestasi')
                ->scrollTo('footer')
                ->waitFor('footer', 5)
                ->assertPresent('footer')
                ->pause(500);
        });
    }

    // public function test_article_show_page(): void
    // {
    //     $this->browse(function (Browser $browser) {
    //         // ganti 'sample-slug' dengan slug artikel yang valid
    //         $browser->visitRoute('articles.show', ['article' => 'sample-slug'])
    //             ->waitFor('footer', 5)
    //             ->assertPresent('footer')
    //             ->pause(500);
    //     });
    // }

    public function test_lecturer_page(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visitRoute('lecturer')
                ->assertSee('Tenaga Kerja')
                ->assertSee('Dosen & Tenaga Pengajar')
                ->assertSee('Teknik Informatika')
                ->assertSee('Teknik Komputer')
                ->scrollTo('footer')
                ->waitFor('footer', 5)
                ->assertPresent('footer')
                ->pause(500);
        });
    }

    public function test_downloadable_page(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visitRoute('download')
                ->assertSee('Download & Unduhan')
                ->assertSee('Pusat Download HMIF Unsoed')
                ->assertSee('Total Download')
                ->scrollTo('footer')
                ->waitFor('footer', 5)
                ->assertPresent('footer')
                ->pause(500);
        });
    }

    public function test_imagz_index_page(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visitRoute('imagz.index')
                ->assertSee('I-Magz Digital')
                ->assertSee('I-Magz HMIF Unsoed')
                ->assertSee('Koleksi I-Magz')
                ->scrollTo('footer')
                ->waitFor('footer', 5)
                ->assertPresent('footer')
                ->pause(500);
        });
    }

    public function test_work_program_index_page(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visitRoute('work-program.index')
                ->assertSee('Program Kerja HMIF Unsoed')
                ->assertSee('Daftar Program Kerja')
                ->assertSee('Divisi HMIF Unsoed')
                ->scrollTo('footer')
                ->waitFor('footer', 5)
                ->assertPresent('footer')
                ->pause(500);
        });
    }

    public function test_student_achievements_index_page(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visitRoute('student.achievements.index')
                ->assertSee('IF Bangga')
                ->assertSee('Prestasi & Pencapaian')
                ->scrollTo('footer')
                ->waitFor('footer', 5)
                ->assertPresent('footer')
                ->pause(500);
        });
    }

    public function test_student_achievements_form_page(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visitRoute('student.achievements.form')
                ->assertSee('Formulir IF Bangga')
                ->scrollTo('footer')
                ->waitFor('footer', 5)
                ->assertPresent('footer')
                ->pause(500);
        });
    }
}
