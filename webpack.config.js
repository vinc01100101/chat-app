module.exports = {
	entry: {
    profile: './src/profile.js'
  },
	output: {
		path: __dirname + '/dist',
		filename: '[name].entry.js'
	},
	mode: 'development',
	module: {
		rules: [
		  {
			test: /\.(js|jsx)$/,
			exclude: /(node_modules|bower_components)/,
			loader: "babel-loader",
			options: { presets: ["@babel/env"] }
		  },
		  {
			test: /\.css$/,
			use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
		  },
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx']
	}
}