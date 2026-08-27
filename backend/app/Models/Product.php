<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'stock' => 'integer',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    protected function image(): Attribute
    {
        return Attribute::make(get: fn (?string $value) => $this->publicMediaPath($value));
    }

    protected function heroImage(): Attribute
    {
        return Attribute::make(get: fn (?string $value) => $this->publicMediaPath($value));
    }

    private function publicMediaPath(?string $value): ?string
    {
        if (! $value) {
            return $value;
        }
        if (str_starts_with($value, '/storage/products/')) {
            return '/products/'.basename($value);
        }

        return $value;
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where('slug', $value)->orWhere('id', $value)->firstOrFail();
    }
}
