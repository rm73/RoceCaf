<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with('category')->orderBy('id')->get();
    }

    public function show(Product $product)
    {
        return $product->load('category');
    }

    public function store(Request $request)
    {
        $product = Product::create($this->validated($request, true));
        $this->storeImages($request, $product);

        return response()->json($product->load('category'), 201);
    }

    public function update(Request $request, Product $product)
    {
        $product->update($this->validated($request, false));
        $this->storeImages($request, $product);

        return response()->json($product->fresh()->load('category'));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function validated(Request $request, bool $creating): array
    {
        $data = $request->validate([
            'category_id' => ($creating ? 'required|' : '').'exists:categories,id',
            'slug' => ['nullable', 'string', 'max:120', Rule::unique('products', 'slug')->ignore($request->route('product')?->id)],
            'name' => ($creating ? 'required|' : '').'string|max:120',
            'title' => 'nullable|string|max:120',
            'description' => 'nullable|string',
            'details' => 'nullable|string',
            'packaging' => 'nullable|string',
            'price' => ($creating ? 'required|' : '').'integer|min:0',
            'stock' => ($creating ? 'required|' : '').'integer|min:0',
            'image' => $request->hasFile('image') ? 'nullable' : 'nullable|string',
            'hero_image' => $request->hasFile('hero_image') ? 'nullable' : 'nullable|string',
        ]);

        if (array_key_exists('stock', $data) || $creating) {
            $data['stock'] = max(0, (int) ($data['stock'] ?? 0));
        }
        if (array_key_exists('price', $data)) {
            $data['price'] = max(0, (int) $data['price']);
        }
        if ($creating && empty($data['slug']) && ! empty($data['name'])) {
            $data['slug'] = str($data['name'])->slug()->toString();
        }
        if ($request->hasFile('image') || ! is_string($data['image'] ?? null)) {
            unset($data['image']);
        }
        if ($request->hasFile('hero_image') || ! is_string($data['hero_image'] ?? null)) {
            unset($data['hero_image']);
        }

        return $data;
    }

    private function storeImages(Request $request, Product $product): void
    {
        $updates = [];
        if ($request->hasFile('image')) {
            $request->validate(['image' => 'image|max:10240']);
            $updates['image'] = $this->storePublicProductImage($request->file('image'));
        }
        if ($request->hasFile('hero_image')) {
            $request->validate(['hero_image' => 'image|max:10240']);
            $updates['hero_image'] = $this->storePublicProductImage($request->file('hero_image'));
        }
        if ($updates) {
            $product->update($updates);
        }
    }

    private function storePublicProductImage($file): string
    {
        $directory = public_path('products');
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
        $name = $file->hashName();
        $file->move($directory, $name);

        return '/products/'.$name;
    }
}
