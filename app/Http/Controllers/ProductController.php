<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;


class ProductController extends Controller
{
    public function index() {
        return Product::paginate(8);
    }

    public function loja() {
        return Product::where('id_status', '=', 3)->paginate(8);
    }

    public function store(Request $request) {
        return Product::create($request->all());
    }

    public function update(Request $request, $id) {
        $product = Product::findOrFail($id);
        $product->update($request->all());
    }

    public function delete($id) {
        $product = Product::findOrFail($id);
        $product->delete();

        return 204;
    }

    public function upload(Request $request) {
        if ($request->hasFile('image_file') && $request->file('image_file')->isValid()) {
            $upload = $request->file('image_file')->storeAs('products', $request->file('image_file')->getClientOriginalName());
            if ($upload) {
                return true;
            }
            return false;
        }
        return false;
    }
}
