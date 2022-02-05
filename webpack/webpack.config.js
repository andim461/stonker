const {merge} = require('webpack-merge')
const commonConfigs = require('./webpack.common.js')

module.exports = (envVars) => {
  const {env, part} = envVars
  const envConfig = require(`./webpack.${env}.js`)
  if (part === 'server') {
    return merge(commonConfigs[0], envConfig)
  }
  if (env === 'dev') {
    return merge(commonConfigs[1], envConfig)
  }
  const configs = commonConfigs.map((config) => merge(config, envConfig))
  return configs;
}