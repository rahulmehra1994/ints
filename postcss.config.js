module.exports = {
  plugins: [
    require('autoprefixer')({
      add: true,
      remove: true,
      browsers: ['last 2 versions'],
    }),
    require('cssnano')({
      preset: 'default',
    }),
  ],
}
