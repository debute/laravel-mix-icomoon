const mix = require('laravel-mix');
const chokidar = require('chokidar');
const fs = require('fs');
const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const decompress = require('gulp-decompress');
const filter = require('gulp-filter');

class Icomoon {

    name() {
        return 'icomoon';
    }

    dependencies() {
        return ['chokidar'];
    }

    register(options) {
        this.options = Object.assign({
            inputPath: 'resources/icomoon',
            publicPath: 'public',
            output: 'fonts/icomoon',
            cssFile: 'resources/sass/_icomoon.scss',
            reload: true,
            debug: false
        }, options || {});
    }

    boot() {
        let self = this;
        let sourcePath = this.options.inputPath + '/*.zip';

        fs.mkdir(path.dirname(sourcePath), {
            recursive: true
        }, (err) => {
            if(err) throw err;
        });

        chokidar.watch(sourcePath, {
            ignoreInitial: false
        }).on('add', (_path) => {
            self.generate_icomoon(_path);
        });
    }

    webpackConfig(webpackConfig) {
        this.webpackOriginalAfterCallback = webpackConfig.devServer.after;

        let self = this;

        this.log('webpack config updated');
        webpackConfig.devServer.after = (app, server) => {
            self.after(app, server);
        };
    }

    after(app, server) {
        if(typeof this.webpackOriginalAfterCallback === 'function') {
            this.webpackOriginalAfterCallback(app, server);
        }

        this.serverHandler = server;
        this.log('webpack server handler attached');
    }

    reload() {
        if(this.options.reload === true && typeof this.serverHandler !== 'undefined') {
            this.serverHandler.sockWrite(this.serverHandler.sockets, "content-changed");
        }

        return void(8);
    }

    generate_icomoon(_path) {
        let self = this;
        let filterSelection = filter(['selection.json'], {restore: true});
        let filterFonts = filter(['fonts/*.*'], {restore: true});
        let filterCss = filter(['style.css'], {restore: true});
        let icomoonPath = this.options.publicPath + '/' + this.options.output;
        let icomoonCssFileExt = path.extname(this.options.cssFile);
        let icomoonCssFileBase = path.basename(this.options.cssFile, icomoonCssFileExt);
        let icomoonCssFileDir = path.dirname(this.options.cssFile);

        this.log('Icomoon zip file detected, compiling data...');

        gulp.src(_path)
            .pipe(decompress())
            .pipe(filterSelection)
            .pipe(gulp.dest(icomoonPath))

            .pipe(filterSelection.restore)
            .pipe(filterFonts)
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest(icomoonPath))

            .pipe(filterFonts.restore)
            .pipe(filterCss)
            .pipe(rename({basename: icomoonCssFileBase, extname: icomoonCssFileExt}))
            .pipe(replace(/url\('fonts\/([^']+)'\)/gm, 'url(\'/' + this.options.output + '/$1\')'))
            .pipe(gulp.dest(icomoonCssFileDir))
            .on('end', () => {
                fs.unlinkSync(_path);
                self.log('Icomoon font was imported! [CSS updated: ' + self.options.cssFile + ']');
                mix.version();
                self.reload();
            });
    }

    log(message) {
        if(this.options.debug === true) {
            console.log('laravel-mix-' + this.name() + ': ' + message);
        }
    }

    error(message) {
        console.error('laravel-mix-' + this.name() + ': ' + message);
    }

}

mix.extend('icomoon', new Icomoon());