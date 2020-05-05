<?php

use Illuminate\Database\Seeder;
use App\Statusproducts;

class StatusproductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $descriptions = array(
            ["description" => "pendente"],
            ["description" => "em análise"],
            ["description" => "aprovado"],
            ["description" => "reprovado"]
        );

        foreach($descriptions as $description) {
            Statusproducts::create($description);
        }
        

    }
}
