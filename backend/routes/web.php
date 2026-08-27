<?php

use App\Http\Controllers\ProductImageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/products/{file}', [ProductImageController::class, 'show'])->where('file', '[^/]+');
Route::get('/storage/products/{file}', [ProductImageController::class, 'show'])->where('file', '[^/]+');
