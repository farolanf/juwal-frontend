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
      },
      module: {
        ...currentWebpackConfig.module,
        rules: [
          {
            oneOf: [
              ...currentWebpackConfig.module.rules[0].oneOf
                .filter(rule => String(rule.test).includes('\\.s(a|c)ss$'))
                .map(rule => ({
                  ...rule,
                  test: /\.module\.s(a|c)ss$/,
                  use: rule.use.map(loader => {
                    if (loader.loader === 'css-loader') {
                      return {
                        ...loader,
                        options: {
                          ...loader.options,
                          modules: true,
                          localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                          context: path.resolve(__dirname)
                        }
                      }
                    }
                    return loader
                  })
              })),
              ...currentWebpackConfig.module.rules[0].oneOf,
            ]
          }
        ]
      }
    })
  }
})