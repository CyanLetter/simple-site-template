# Base Website Template

## Table of Contents

1. [Overview](#overview)
1. [Getting Started](#gettingstarted)

<a name="overview"></a>
## Overview

This is a simple website template for getting projects up and running quickly. Designed primarily to provide a base build process that maintains separation between src and dist assets. 

This project includes sass and js compilation, and manifest revisions for compiled files. React or Vue based projects should instead be set up via their respective project templates and CLI interfaces.

<a name="gettingstarted"></a>
## Getting Started

This project uses Gulp to run build tasks. Building requires using `npm` and `gulp-cli` from the command line. 

**Install Dependencies**

```
cd path/to/project/folder
npm install
```

**Run Watch**

```
gulp
```

The default task will make a development build, run a local web server out of the `dist` folder, and watch for file changes. It will compile, but not minify, css and js assets.

**Run Development Build**

```
gulp build-dev
```

A development build will make a build that compiles, but does not minify, css and js assets.

**Make Production Build**

```
gulp build
```

A production build will clean the `dist` folder, compile sass files, combine and minify js files, move and compress images, and move font and data files. **Make sure you have not made changes directly in dist if you are running build**. Everything in the dist folder gets deleted during the build step, so any changes that are not in `src` will be lost.