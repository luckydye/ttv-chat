const webpack = require('webpack');
const path = require('path');
const package = require('./package.json');

const banner = package.name + ' - ' + package.version;

module.exports = {
	target: 'web',
	mode: process.env.NODE_ENV || 'development',
	entry: {
		main: './src/main.ts',
		service: './src/service.ts'
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true // TODO: remove this and fix errors
						}
					}
				],
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'client')
	},
	plugins: [new webpack.BannerPlugin(banner)]
};
