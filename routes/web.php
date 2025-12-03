<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('inventory');
});

Route::get('/inventory', function () {
    return view('inventory');
});

// Serve CSS from resources/css at /assets/css/{file}
Route::get('/assets/css/{file}', function ($file) {
    $base = resource_path('css');
    $path = realpath($base . DIRECTORY_SEPARATOR . $file);
    if (!$path || strpos($path, $base) !== 0 || !file_exists($path)) {
        abort(404);
    }
    return response()->make(file_get_contents($path), 200, [
        'Content-Type' => 'text/css; charset=utf-8',
    ]);
});

// Serve JS/JSX from resources/js at /assets/js/{path}
Route::get('/assets/js/{path}', function ($path) {
    $base = resource_path('js');
    $real = realpath($base . DIRECTORY_SEPARATOR . $path);
    if (!$real || strpos($real, $base) !== 0 || !file_exists($real)) {
        abort(404);
    }
    return response()->make(file_get_contents($real), 200, [
        'Content-Type' => 'application/javascript; charset=utf-8',
    ]);
})->where('path', '.*');
