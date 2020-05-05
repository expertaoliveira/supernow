<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Statusproducts;

class StatusproductsController extends Controller
{
    //
    public function index() {
        return Statusproducts::all();
    }
}
