<?php

use Illuminate\Database\Seeder;
use App\Product;

class ProductTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('products')->truncate();

        

        Product::create([
            'name' => 'Tênis Nike N45',
            'price' => 449.90,
            'image' => 'tenis-image1.png',
            'id_status' => 2
        ]);

        Product::create([
            'name' => 'Tênis Adidas',
            'price' => 349.90,
            'image' => 'tenis-image2.png',
            'id_status' => 1
        ]);

        Product::create([
            'name' => 'Tênis Olympicus',
            'price' => 249.90,
            'image' => 'tenis-image3.png',
            'id_status' => 2
        ]);

        Product::create([
            'name' => 'Tênis Rebook',
            'price' => 269.90,
            'image' => 'tenis-image4.png',
            'id_status' => 3
        ]);

        Product::create([
            'name' => 'Tênis AllStar',
            'price' => 279.90,
            'image' => 'tenis-image2.png',
            'id_status' => 3
        ]);

        Product::create([
            'name' => 'Tênis Topper',
            'price' => 189.90,
            'image' => 'tenis-image4.png',
            'id_status' => 4
        ]);

        Product::create([
            'name' => 'Tênis Cartago Kids',
            'price' => 99.90,
            'image' => 'tenis-image1.png',
            'id_status' => 3
        ]);
    }
}
