const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('frontend/src/pages/milestone-view.js', 'public/js')
    .js('frontend/src/pages/milestone-listing.js', 'public/js')
    .js('frontend/src/pages/dashboard.js', 'public/js')
    .postCss('frontend/web/css/comment.css', 'public/css')
    .postCss('frontend/web/css/components.css', 'public/css')
    .postCss('frontend/web/css/datepicker.css', 'public/css')
    .postCss('frontend/web/css/goal.css', 'public/css')
    .postCss('frontend/web/css/lambent.css', 'public/css')
    .postCss('frontend/web/css/link.css', 'public/css')
    .postCss('frontend/web/css/milestone.css', 'public/css')
    .postCss('frontend/web/css/responsive-forms.css', 'public/css');
