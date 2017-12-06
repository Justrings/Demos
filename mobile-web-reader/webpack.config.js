var path = require("path");
var htmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin("style/style-normalize.css");
const extractSCSS = new ExtractTextPlugin("style/style-base.css");
module.exports = {
	entry:{ main:["babel-polyfill","./script/main.js"]
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "js/[name].bundle.js"
	},
	module:{
		rules:[
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader" 
      },
			{
    		test: /\.(png|jpg|gif)$/,
    		use: [
     				
     				{
        				loader: "url-loader",
        				options: {
          					limit: 8000,
          					name: "image/[hash:8].[name].[ext]"
        				}
      				}
    			]
      },
			{
    		test: /\.css$/,
    		use: extractCSS.extract({
      			fallback: "style-loader",
      			use: ["css-loader","postcss-loader"]
    		})
    	},
			{
    		test: /\.scss$/,
    		use: extractSCSS.extract({
      			fallback: "style-loader",
      			use: ["css-loader","postcss-loader","sass-loader"]
    		})
    	}
		]
	},
	plugins: [
		new htmlWebpackPlugin({
			filename: "pages/index.html",
			inject: true,
			title: "web-reader-app",
			template: "index.html"
		}),
		extractCSS,
		extractSCSS
	]

};