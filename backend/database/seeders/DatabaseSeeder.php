<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@rocecaf.com'],
            ['name' => 'Admin User', 'password' => 'password']
        );

        $cans = Category::query()->updateOrCreate(['name' => 'Cans']);
        $grind = Category::query()->updateOrCreate(['name' => 'Grind']);

        $products = [
            [
                'slug' => 'mocktail-can',
                'category_id' => $cans->id,
                'title' => 'Mocktail',
                'name' => 'Mocktail coffee',
                'description' => 'Arabica Americano with the lingering taste of citrus, jasmine, and mint.',
                'details' => 'A bright office mocktail with natural citrus, jasmine, and mint. Under 5 Cal, no harsh additives.',
                'packaging' => 'Recyclable aluminum can. Best served chilled.',
                'price' => 20000,
                'stock' => 120,
                'image' => '/products/cat-mocktail-can.png',
                'hero_image' => '/products/detail-mocktail.png',
            ],
            [
                'slug' => 'americano-can',
                'category_id' => $cans->id,
                'title' => 'Americano',
                'name' => 'Americano coffee',
                'description' => 'A clean americano with chocolate depth and a smooth office-ready finish.',
                'details' => 'Roasted for daily work: bold, low-sugar, and easy to sip between meetings.',
                'packaging' => 'Recyclable aluminum can. Best served chilled.',
                'price' => 20000,
                'stock' => 86,
                'image' => '/products/cat-americano-can.png',
                'hero_image' => '/products/cat-americano-can.png',
            ],
            [
                'slug' => 'matcha-can',
                'category_id' => $cans->id,
                'title' => 'Matcha',
                'name' => 'Matcha',
                'description' => 'Creamy matcha with a calm lift — made for long hours without the crash.',
                'details' => 'Stone-ground matcha, lightly sweetened, packed for the workday.',
                'packaging' => 'Recyclable aluminum can. Shake gently before opening.',
                'price' => 20000,
                'stock' => 64,
                'image' => '/products/cat-matcha-can.png',
                'hero_image' => '/products/cat-matcha-can.png',
            ],
            [
                'slug' => 'mocktail-grind',
                'category_id' => $grind->id,
                'title' => 'Mocktail',
                'name' => 'Mocktail coffee',
                'description' => 'Citrus-jasmine grind for brewing a brighter cup at the desk.',
                'details' => 'Locally sourced beans with citrus and jasmine notes. Grind for pour-over or drip.',
                'packaging' => 'Stand-up pouch. Reseal after opening. 200g.',
                'price' => 20000,
                'stock' => 40,
                'image' => '/products/cat-mocktail-grind.png',
                'hero_image' => '/products/cat-mocktail-grind.png',
            ],
            [
                'slug' => 'americano-grind',
                'category_id' => $grind->id,
                'title' => 'Americano',
                'name' => 'Americano coffee',
                'description' => 'Classic americano grind with a chocolate finish for everyday brewing.',
                'details' => 'Medium-dark roast for a reliable office brew.',
                'packaging' => 'Stand-up pouch. Reseal after opening. 200g.',
                'price' => 20000,
                'stock' => 52,
                'image' => '/products/cat-americano-grind.png',
                'hero_image' => '/products/cat-americano-grind.png',
            ],
            [
                'slug' => 'matcha-grind',
                'category_id' => $grind->id,
                'title' => 'Matcha',
                'name' => 'Matcha coffee',
                'description' => 'Matcha-forward grind for a green, focused cup.',
                'details' => 'Blend of matcha and coffee grind for a calm, earthy brew.',
                'packaging' => 'Stand-up pouch. Reseal after opening. 200g.',
                'price' => 20000,
                'stock' => 33,
                'image' => '/products/cat-matcha-grind.png',
                'hero_image' => '/products/cat-matcha-grind.png',
            ],
        ];

        foreach ($products as $product) {
            Product::query()->updateOrCreate(['slug' => $product['slug']], $product);
        }
    }
}
