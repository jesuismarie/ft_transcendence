const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

const shared = {
	mode : process.env.NODE_ENV || "development",
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				loader: "ts-loader",
				exclude: ["/node_modules/"],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				type: "asset",
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js"],
	},
};

module.exports = [{
	...shared,
	entry: path.join(__dirname, "src", "client", "browser.ts"),
	output: {
		path: path.resolve(__dirname, "dist", "client"),
	},
	target: "web",
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "client", "index.html"), // your source HTML template
            filename: "index.html", // output file name
        }),
    ],
    devServer: {
        static: {
          directory: path.resolve(__dirname, "dist", "client"),
        },
        port: 4000,
        open: true,
        hot: true,
    }
}, {
	...shared,
	entry: path.join(__dirname, "src", "server", "index.ts"),
	output: {
		path: path.resolve(__dirname, "dist", "server"),
		filename: "server.js"
	},
	target: "node",
	externals: [nodeExternals()],
}];