<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class NavbarTest extends DuskTestCase
{
    /**
     * A Dusk test example.
     */
    public function test_navbar(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->assertSee('Beranda')
                    ->assertSee('Berita')
                    ->assertSee('Dosen')
                    ->assertSee('Tentang HMIF')
                    ->assertSee('IF Bangga')
                    ->assertSee('I-Magz')
                    ->assertSee('Unduhan')
                    ->pause(500);
        });
    }

    public function test_navigate_all(){
        $this->browse(function (Browser $browser) {
            $browser->visit('/berita')
                    ->clickLink('Beranda')
                    ->pause(2000)
                    ->assertPathIs('/')
                    ->clickLink('Berita')
                    ->pause(1000)
                    ->assertPathIs('/berita')
                    ->clickLink('Dosen')
                    ->pause(1000)
                    ->assertPathIs('/dosen')
                    ->clickLink('IF Bangga')
                    ->pause(2000)
                    ->assertPathIs('/if-bangga')
                    ->clickLink('I-Magz')
                    ->pause(2000)
                    ->assertPathIs('/i-magz')
                    ->clickLink('Unduhan')
                    ->pause(1000)
                    ->assertPathIs('/unduhan')
                    // Test dropdown menu "Tentang HMIF"
                    ->press('Tentang HMIF') // Click dropdown button by text
                    ->pause(500)
                    ->clickLink('Struktur Organisasi')
                    ->pause(1000)
                    ->assertPathIs('/struktur-organisasi')
                    ->press('Tentang HMIF') // Click dropdown button again
                    ->pause(500)
                    ->clickLink('Visi Misi')
                    ->pause(1000)
                    ->assertPathIs('/visi-misi')
                    ->press('Tentang HMIF') // Click dropdown button again
                    ->pause(500)
                    ->clickLink('Program Kerja')
                    ->pause(1000)
                    ->assertPathIs('/proker-divisi');
        });
    }
}
