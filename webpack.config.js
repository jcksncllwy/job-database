let path = require('path')

module.exports = {
    context: __dirname,
    entry: [
    'babel-polyfill',
    './src/index.js',
    ],
    output: {
        path: path.join(__dirname, 'public', 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },    
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: [/(node_modules|bower_components)/],
            use: [{
              loader: 'babel-loader',
              options: { presets: ['es2015', 'stage-2', 'react'] }
            }],
          },
          {
            test: /\.scss$/,
            exclude: [/(node_modules|bower_components)/],
            use: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[folder]_[name]__[local]--[hash:base64:6]'
                }
              },
              { loader: 'postcss-loader' },
              { loader: 'sass-loader' }
            ]            
          },
          { 
            test: /\.css$/,
            use: [
              { loader: "style-loader" },
              { loader: "css-loader" }
            ]
          }
        ]
    },
    plugins: [      
    ],
    resolve: {
      modules: ['node_modules', 'src'],
      extensions: [".webpack.js", ".web.js", ".js", '.scss']
    }
};
