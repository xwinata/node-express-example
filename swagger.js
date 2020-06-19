const swaggerJsdoc = require('swagger-jsdoc');
const options = {
    // List of files to be processed.
    apis: ['./routes/*.js'],
    // You can also set globs for your apis
    // e.g. './routes/*.js'
    basePath: 'localhost:3000',
    swaggerDefinition: {
      info: {
        description: 'Test API with autogenerated swagger doc',
        swagger: '2.0',
        title: 'Node Express API example',
        version: '1.0.0',
      },
    },
  };
  var specs = swaggerJsdoc(options);
module.exports = specs;