const fractal = module.exports = require('@frctl/fractal').create();
const ENV     = process.env.NODE_ENV;

// Set the title of the project
fractal.set('project.title', 'Kensho Usage Guide');

// Tell Fractal where the components will live
fractal.components.set('path', __dirname + '/guide/components');

// Tell Fractal where the documentation pages will live
fractal.docs.set('path', __dirname + '/guide/docs');

fractal.web.set('builder.dest', 'dest/guide');
