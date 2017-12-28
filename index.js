const { resolve } = require('path')
const merge = require('deepmerge')

const typescript = neutrino => {
  neutrino.options.extensions = [...neutrino.options.extensions, 'tsx']
  neutrino.config.resolve.extensions
    .add('.ts')
    .add('.tsx')
    .end()
  neutrino.config.module
    .rule('compile-typescript')
    .test(neutrino.regexFromExtensions())
    .exclude.add(/\/node_modules\//)
    .end()
    .use('typescript')
    .loader(require.resolve('awesome-typescript-loader'))
}

const jest = (neutrino, opts = {}) => {
  const transformNames = `\\.(${neutrino.options.extensions.join('|')})$`
  neutrino.use(
    '@neutrinojs/jest',
    merge.all([
      {
        transform: {
          [transformNames]: require.resolve('ts-jest/preprocessor.js')
        },
        globals: {
          'ts-jest': {
            tsConfigFile: resolve('tsconfig.json')
          }
        }
      },
      opts
    ])
  )
}

module.exports = (neutrino, opts) => {
  neutrino.use('@neutrinojs/web', opts)
  neutrino.use(typescript)
  neutrino.use(jest)
}
