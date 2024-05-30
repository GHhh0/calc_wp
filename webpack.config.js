const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env) => {
    return {
        mode: env.mode ?? 'development',
        entry: {
            calc: path.resolve(__dirname, 'src/calc.js')
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].[contenthash].js',
            clean: true,
        },
        plugins: [
            new HtmlWebpackPlugin({ template: 'src/index.html', favicon: 'src/icon.svg' }),
            new MiniCssExtractPlugin()
        ],
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                }
            ]
        },
        devServer: {
            port: 9000,
            compress: true,
            hot: true,
            static: {
                directory: path.join(__dirname, 'dist')
            }
        }
    }
}