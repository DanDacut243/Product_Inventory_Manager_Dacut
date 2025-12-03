<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource, with optional name filter.
     */
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('name') && $request->query('name') !== null && $request->query('name') !== '') {
            $name = $request->query('name');
            $query->where('name', 'like', '%' . $name . '%');
        }

        $products = $query->orderBy('id', 'desc')->get();

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'sku' => 'required|string|max:64|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $product = Product::create($validated);

        return response()->json($product, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'sku' => 'required|string|max:64|unique:products,sku,' . $product->id,
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
