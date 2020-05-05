<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth')->group(function () {
    Route::get('admin', 'AdminController@index');
});

Route::get('produtosaprovados', 'ProductController@loja');
Route::get('produtos', 'ProductController@index');
Route::get('status', 'StatusproductsController@index');
Route::post('produto', 'ProductController@store');
Route::post('produto/upload', 'ProductController@upload');
Route::put('produto/{id}', 'ProductController@update');
Route::delete('produto/{id}', 'ProductController@delete');





