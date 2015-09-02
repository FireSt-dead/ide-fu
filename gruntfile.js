var grunt = require('grunt');

grunt.initConfig({
    'http-server': {
        'dev': {
            root: "./",
            port: 8282,
            host: "127.0.0.1",
            cache: false,
            showDir : true,
            autoIndex: true,
            ext: "html",
            runInBackground: false,
 
            // specify a logger function. By default the requests are 
            // sent to stdout. 
            // logFn: function(req, res, error) { }
 
        }
 
    }
});
 
grunt.loadNpmTasks('grunt-http-server');

grunt.registerTask('default', ['http-server:dev']);