// function defaultTask(cb) {
//         console.log("gulp works")
//         cb();
//       }
      
//       export default ( defaultTask);
    
import gulp from 'gulp';
const { series, parallel } = gulp;
import pug from 'gulp-pug';
//import sass from 'gulp-sass';
import gulpSass from "gulp-sass";
import nodeSass from "node-sass";
const sass = gulpSass(nodeSass);

import autoprefixer from 'gulp-autoprefixer';
import cssnano from 'gulp-cssnano';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';

import {create as bsCreate} from 'browser-sync';
const browserSync = bsCreate();

import { deleteAsync as del } from 'del';


const html = () =>{
    return gulp.src('src/pug/*.pug')
      .pipe(pug({pretty:true}))
      .pipe(gulp.dest('build'))
  }

  const styles= () => {
    return gulp.src('src/styles/*.scss')
    .pipe(sass({
        errLogToConsole: true,
    }))
    .pipe (autoprefixer())
    .pipe (cssnano())
    .pipe(rename ({suffix: ".min"}))
    .pipe(gulp.dest('build/css'))
  }

  const images=()=>{
    return gulp.src('src/images/images/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images')) 
  }
  const photos=()=>{
    return gulp.src('src/images/photo/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/photo')) 
  }

  const server =()=>{
    browserSync.init({
      server:{
        baseDir:'./build'
      },
      notify: false
    })
    browserSync.watch('build', browserSync.reload)
  }

  const deleteBuild = (cb)=>{
    return del('build/**/*.*').then(()=>{cb()})
  }
  
  const watch=()=>{
    gulp.watch('src/pug/**/*.pug', html);
    gulp.watch('src/styls/**/*.scss', styles);    
    gulp.watch('src/images/*.*', images);
  }

  export default series(
    deleteBuild,
    parallel (html, styles, images, photos),
    parallel(watch, server)
  )