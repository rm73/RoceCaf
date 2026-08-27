<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $total = 0;
            $order = Order::create(['status' => 'paid', 'total' => 0]);

            foreach ($validated['items'] as $row) {
                $product = Product::query()->lockForUpdate()->findOrFail($row['product_id']);
                $qty = (int) $row['qty'];

                if ($product->stock < $qty) {
                    throw ValidationException::withMessages([
                        'items' => "Only {$product->stock} of {$product->name} left in stock.",
                    ]);
                }

                $product->stock = max(0, $product->stock - $qty);
                $product->save();

                $line = $product->price * $qty;
                $total += $line;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'qty' => $qty,
                    'price' => $product->price,
                ]);
            }

            $order->update(['total' => $total]);

            return $order->load('items.product');
        });

        return response()->json($order, 201);
    }
}
