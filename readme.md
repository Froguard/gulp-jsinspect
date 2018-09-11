# gulp-[jsinspect](https://github.com/danielstjules/jsinspect)y

> Gulp plugin for running jsinspect & generate a report file

> Inspire from gulp-jsinspect

## Install

```sh
$ npm install D gulp-jsinspecty
```

## Usage

```javascript
var gulp = require('gulp');
var jsinspecty = require('gulp-jsinspecty');

gulp.task('default', function () {
  return gulp.src([
      'src/**/*.js',
      '!*.test.js'  
  ])
    .pipe(jsinspecty({
        lineNumber: true,
        reporter: 'markdown', // or a shortner 'md' 
        reportFilename: 'result'
    })) // you can also set options in .jsinspectrc file
    .pipe(gulp.dest('./')); // generate a file 'result.md'
});
```

### Options


#### reporter

Type: `String`

Default value: `default`

Allow values: `json`, `md`(or `markdown`), `pmd`, `defalut` 

#### lineNumber

Type: `Boolean`

Default value: `false`

Show line numbers in reporter

#### reportFilename

Type: `String`

Default value: `default`

Allow values: `json`, `md`(or `markdown`), `pmd`, `defalut` 

#### failOnMatch

Type: `Boolean`

Default value: `false`

#### threshold

Type: `Number`

Default value: `15`

Number of nodes.

#### suppress

Type: `Number`

Default value: `100`

length to suppress diffs (off: 0).

#### identifiers

Type: `Boolean`

Default value: `false`

Match identifiers.

