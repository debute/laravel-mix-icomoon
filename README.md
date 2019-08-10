# Laravel Mix Icomoon

**Laravel Mix extension to generate icomoon fonts.**

## Note

Now you can put your generated [Icomoon](https://icomoon.io/app/) font icons in ZIP file to custom directory, extension will automatically regenerate CSS to your desire.

_This extension uses **Gulp 4**. This can create unexpected behavior if you are using older version of Gulp inside your project._

## Installation

Install the extension:

```sh
npm install laravel-mix-icomoon
```

Or if you prefer yarn:

```sh
yarn add laravel-mix-icomoon
```

Next require the extension inside your Laravel Mix config and call `icomoon()` in your pipeline:

```js
// webpack.mix.js
const mix = require('laravel-mix');
require('laravel-mix-icomoon');

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .icomoon();
```

## Options

#### Default options

If nothing is passed to the extension inside your Laravel Mix config, the following options will be used:

```js
{
    inputPath: 'resources/icomoon',
    publicPath: 'public',
    output: 'fonts/icomoon',
    cssFile: 'resources/sass/_icomoon.scss',
    reload: true,
    debug: false
}
```

#### Option details

* `inputPath` (string). Your icomoon data path. Place your [Icomoon](https://icomoon.io/app/) generated ZIP file here.
* `publicPath` (string). Your application's public path.
* `output` (string). Where decompressed fonts will be saved. Relative to the `publicPath`.
* `cssFile` (string). Path to CSS file, where icomoon fonts will be declared.
* `reload` (boolean). Whenever to reload browser after success. I recommend having this option enabled since Laravel Mix's SASS HMR (when running `npm run hot`) is not "perfect".
* `debug` (boolean). Whenever to log extension events messages to the console.