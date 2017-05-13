const {resolve} = require('path');

module.exports = {

	entry: {
		client: resolve(__dirname, './src/bundle/client')
	},

	output: {
		path: resolve(__dirname, './dist'),
		filename: '[name].formapi.js',
		library: 'FormAPI',
	},

	module: {
		rules: [
			{
				test: /[.]json/,
				loader: 'json-loader',
			},
			{
				test: /\.js/,
				exclude: [
					/node_modules/,
				],
				loader: 'babel-loader',
				options: {
					presets: [
						'latest',
						'stage-0',
					],
					plugins: [
						'babel-plugin-transform-regenerator',
						'babel-plugin-transform-runtime',
					],
				},
			},
		],
	},

	devtool: 'source-map',
	context: __dirname,
	target: 'web',
};
