Here is the resolved `main.js` file, integrating both changes:

```javascript
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
  icon: addAccessibleNameToSVG('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>')
};

module.exports = config;
```

In the above code, the `addAccessibleNameToSVG` function, responsible for providing accessible names to SVG elements, has been integrated, and it is used to create the `icons` constant, ensuring the correct SVG usage in the application. The conflict-marked sections have been removed since their content is now included in the resolved file.