const mix = require('laravel-mix');

mix.react('resources/js/app.jsx', 'public/js')
   .sourceMaps();
