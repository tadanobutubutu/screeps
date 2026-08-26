// TODO: This is the existing code that needs to be preserved
// ... existing code ...

console.log('Screeps is running');

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-inline-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
  devServer: {
    static: './dist',
    hot: true,
    port: 3000,
  },
};

// Add the following function to handle the issue with React SVG Accessible Name
function addAccessibleNameToSVG(svgContent) {
  // Assuming svgContent is a string containing the SVG markup
  // This function wraps the SVG content with an aria-label attribute for accessibility
  return `<svg ${svgContent} aria-label="Accessible description of the SVG"></svg>`;
}

const icons = {
  icons1: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>',
  icons2: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>',
};

Object.keys(icons).forEach(iconName => {
  icons[iconName] = addAccessibleNameToSVG(icons[iconName]);
});

module.exports = config;