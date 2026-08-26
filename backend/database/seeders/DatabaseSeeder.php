<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@rocecaf.com',
            'password' => bcrypt('password'),
        ]);

        $can = \App\Models\Category::create(['name' => 'can']);
        $grind = \App\Models\Category::create(['name' => 'grind']);

        \App\Models\Product::create([
            'category_id' => $can->id,
            'name' => 'Citrus Cold Brew',
            'description' => 'A crisp, characterful refreshment with natural ingredients and enough lift to carry your day forward.',
            'price' => 45000,
            'stock' => 50,
            'image' => '/src/assets/can.png'
        ]);

        \App\Models\Product::create([
            'category_id' => $can->id,
            'name' => 'Lemon Matcha',
            'description' => 'Bright and earthy match with a squeeze of fresh lemon.',
            'price' => 50000,
            'stock' => 20,
            'image' => '/src/assets/can 2.png'
        ]);

        \App\Models\Product::create([
            'category_id' => $grind->id,
            'name' => 'House Blend Roast',
            'description' => 'Our signature blend of locally sourced coffee beans.',
            'price' => 85000,
            'stock' => 10,
            'image' => '/src/assets/Image-1.png'
        ]);
    }
}
