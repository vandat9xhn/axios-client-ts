// const
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 
const devServer = {
    port: 8000,
    open: false,
    stats: 'minimal',
    disableHostCheck: true,
    historyApiFallback: true,
    overlay: true,
    inline: true,
    compress: true,
    contentBase: '/',
    // https: true,
};

// Config
const config = {
    entry: {
        app: './src/index.tsx',
    },
    //output
    output: {
        filename: 'static/js/[name].js',
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
    },
    // module
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
    },

    // plugins
    plugins: [
        // new CleanWebpackPlugin()
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            // favicon: 'image/favicon.svg',
        }),
    ],

    // performance
    performance: {
        hints: false,
    },
    // optimization
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },

    mode: 'production',
    devServer,
};

module.exports = config;
