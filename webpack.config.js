module.exports = {
    cache: true,
    entry: "./caps.js",
    output: {
        path: __dirname,
        filename: '../build/caps.js',
        libraryTarget: 'var',
        library: 'caps'
    },
    externals: {
        jquery: "jQuery"
    },
    module: {}
};