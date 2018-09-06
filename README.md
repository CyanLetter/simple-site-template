# Website Starter Template

## Table of Contents

1. [Overview](#overview)
1. [Getting Started](#gettingstarted)

<a name="overview"></a>
## Overview

This is a simple website template for getting projects up and running quickly. It was designed to compile quilckly, to maintain separation between src and dist assets, and to be able to run from both src and dist. 

This template includes sass compilation, js concatination and minification, and simple image compression. It does not include things like ES6 transpiling. 

<a name="gettingstarted"></a>
## Getting Started

This project uses Gulp to run build tasks. Building requires using `npm` and `gulp-cli` from the command line. 

**Install Dependencies**

```
cd path/to/project/folder
npm install
```

**Run Development Build**

```
gulp
```

A development build will compile sass files, run a local web server out of the `src` folder, and watch for file changes.

**Make Production Build**

```
gulp build
```

A production build will clean the `dist` folder, compile sass files, combine and minify js files, move and compress images, and move font and data files. **Make sure you have not made changes directly in dist if you are running build**. Everything in the dist folder gets deleted during the build step, so any changes that are not in `src` will be lost.