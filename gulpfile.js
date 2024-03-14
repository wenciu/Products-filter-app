const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const kit = require("gulp-kit");
const imagemin = require("gulp-imagemin");
const clean = require("gulp-clean");
const browsersync = require("browser-sync").create();

// Sass Task
function scssTask() {
  return src("src/scss/main.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }));
}

// JavaScript Task
function jsTask() {
  return src("src/js/script.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: "." }));
}

// Convert Images
function convertImages(done) {
  src("./src/img/**/*").pipe(imagemin()).pipe(dest("./dist/img"));
  done();
}

// KIT Task
function handleKits(done) {
  src("./html/**/*.kit").pipe(kit()).pipe(dest("./"));
  done();
}

// Clean Stuff Task (!!! REMOVE DIST FOLDER !!!)
function cleanStuff(done) {
  src("./dist", { read: false }).pipe(clean());
  done();
}

// Browsersync Task
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "./",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

//Watch Task
function watchTask() {
  watch("src/**/*.html", series(browsersyncReload));
  watch(
    ["./html/**/*.kit", "src/scss/**/*.scss", "src/js/**/*.js"],
    series(handleKits, scssTask, jsTask, browsersyncReload)
  );
}

//Clean Stuff task
exports.cleanStuff = cleanStuff;

//Default Gulp task
exports.default = series(
  handleKits,
  convertImages,
  scssTask,
  jsTask,
  browsersyncServe,
  watchTask
);
