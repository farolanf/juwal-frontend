import path from 'path'
import browserEnvVars from 'browser-env-vars'

browserEnvVars.generate({
  readFile: `.env.${process.env.NODE_ENV || 'development'}`,
  outFile: './src/env.js',
  esm: true,
  whiltelist: ['API_URL']
})

export default pluginOptions => ({
  webpack: (currentWebpackConfig, state) => {
    return Object.assign({}, currentWebpackConfig, {
      resolve: {
        ...currentWebpackConfig.resolve,
        alias: {
          ...currentWebpackConfig.resolve.alias,
          '~root': path.resolve(__dirname),
          '~src': path.resolve(__dirname, 'src'),
          '~config': path.resolve(__dirname, 'src/config'),
          '~constants': path.resolve(__dirname, 'src/constants'),
          '~api': path.resolve(__dirname, 'src/api'),
          '~store': path.resolve(__dirname, 'src/store'),
          '~libs': path.resolve(__dirname, 'src/libs'),
          '~components': path.resolve(__dirname, 'src/components')
        }
      }
    })
  }
})