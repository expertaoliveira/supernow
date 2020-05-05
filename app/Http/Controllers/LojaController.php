<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;


class LojaController extends Controller
{
    public function index() {
        return Product::where('id_status','=', 3)->paginate(8);
    }
}
