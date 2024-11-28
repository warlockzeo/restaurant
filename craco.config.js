const path = require('path');
module.exports = {
  webpack: {
    style: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    },

    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@store': path.resolve(__dirname, 'src/store'),
    },
  },
};
