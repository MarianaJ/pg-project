var gulp = require("gulp"),
    
    autoprefixer = require("gulp-autoprefixer"),
    plumber = require("gulp-plumber"),
    browserSync = require("browser-sync"),
    del = require("del"),
    useref = require("gulp-useref"),
    uglify = require("gulp-uglify"),
    gulpif = require("gulp-if"),
    imagemin = require("gulp-imagemin"),
    runSequence= require("run-sequence");

/*####################################
KOMPILACJA SASS DO CSS
1. Pobierz pluginn gulp-sass
npm install gulp-sass --save-dev
PLUMBER umożliwia obsługę błędu tzn. w razie np braku poprawności pliku nie zakańcza działania procesu co umożliwia poprawienie pliku i prawidłowe wykonanie się procesu

*/


/*#####################################
AUTOPREFIXER
gulp-autoprefixer
npm install -save-dev gulp-autoprefixer
*/


/*####################################
Browser SYNC
npm install browser-sync --save-dev
*/
gulp.task("server", function() {
    browserSync.init({
        server: "www/"
    });
});
   

/*####################################
NASŁUCHIWANIE NA ZMIANY
*/
gulp.task("watch", function() {

    gulp.watch("www/sass/**/*.scss",["css"]);
    gulp.watch(["www/*.html","www/**/*.js","www/css/*.css"],browserSync.reload);
    

});


/*####################################
narzędzie do czyszczenia katalogów
npm install --save-dev gulp-useref
należy dodawać tagi w pliku w którym są źródła do połączenia 
aby poprawnie wykonać łączenia nalezy najpier wyczyścić katalog3
######################################
mimifikacja 
npm install --save-dev gulp-uglify
*/

gulp.task("clean", function() {
   return del("dist/");//usuwa folder z zawartością
});


gulp.task("html",function() {
    gulp.www("www/*.html")
        .pipe(useref())
        .pipe(gulpif("*.js",uglify())  )
        .pipe(gulp.dest("dist/"));

});
/*####################################
IMAGEMIN
npm install --save-dev gulp-imagemin


*/
gulp.task("images", function() {
   return gulp.www ("dist/images/*",{
    base: "dist"
    
    })
    .pipe(gulp.dest("dist/"))
        .pipe(imagemin())
        .pipe(gulp.dest("dist/"));

});

gulp.task("copy",function() {
  return  gulp.www(["www/css/**/*.css", "www/images/*", "www/uploads/*"],{
    base: "www"
    })
    .pipe(gulp.dest("dist/"));
});

/*####################################
Uruchanianie sekwencyjne
npm install--save-dev run-sequence
ZACHOWUJE ASYNCHRONICZNOŚĆ B WAŻNE
build server pozwala uruchomić gotowa app
*/


gulp.task("build", function() {
runSequence("clean", "html","copy","images");
});

 gulp.task("default",["server","watch"]);