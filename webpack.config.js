const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");


module.exports = {
    entry: "./src/client/js/main.js",
    mode: "development",
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/style.css"       // js와 분리해서 저장
        })
    ],      
    output: {
        filename: "js/main.js",
        path: path.resolve(__dirname, "assets"),        // 기본적으로 assets에 저장
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                    },
                },
            },
            {
                test: /\.scss$/, 
                // use: ["style-loader", "css-loader", "sass-loader"],  
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],  
            }
        ],
    },
};



