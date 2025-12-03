<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        return [
            'name' => $this->faker->words(3, true),
            'sku' => strtoupper($this->faker->bothify('SKU-#####')),
            'price' => $this->faker->randomFloat(2, 1, 9999),
            'quantity' => $this->faker->numberBetween(0, 500),
            'description' => $this->faker->boolean(70) ? $this->faker->sentence() : null,
        ];
    }
}
