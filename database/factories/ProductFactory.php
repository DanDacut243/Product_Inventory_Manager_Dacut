<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Product;
use Faker\Generator as Faker;

$factory->define(Product::class, function (Faker $faker) {
    return [
        'name' => $faker->words(3, true),
        'sku' => strtoupper($faker->bothify('SKU-#####')),
        'price' => $faker->randomFloat(2, 1, 9999),
        'quantity' => $faker->numberBetween(0, 500),
        'description' => $faker->boolean(70) ? $faker->sentence() : null,
    ];
});
