const config = {
  output: {
    filename: 'bundle.js',
    path: 'dist',
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
      '@': './src',
      '~': './src',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
  ],
  devServer: {
    static: './dist',
    hot: true,
    port: 3000,
  },
};

// Add the following function to handle the issue with React SVG Accessible Name
function makeSvgAccessible(svgContent) {
  // Assuming svgContent is a string containing the SVG markup
  // This function wraps the SVG content with an aria-label attribute for accessibility
  return `<svg ${svgContent} aria-label="Accessible description of the SVG"></svg>`;
}

const icons = {
  icons1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>`,
  icons2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60"/></svg>`,
};

Object.keys(icons).forEach((iconName) => {
  icons[iconName] = makeSvgAccessible(icons[iconName]);
});

module.exports = config;