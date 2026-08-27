<?php

namespace App\Http\Controllers;

class ProductImageController extends Controller
{
    public function show(string $file)
    {
        abort_unless(preg_match('/^[A-Za-z0-9._-]+\.(png|jpe?g|gif|webp|bmp|tif|tiff)$/i', $file), 404);

        foreach ([public_path('products/'.$file), storage_path('app/public/products/'.$file)] as $path) {
            if (is_file($path)) {
                return response()->file($path);
            }
        }

        abort(404);
    }
}
