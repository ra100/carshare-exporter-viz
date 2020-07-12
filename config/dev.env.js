var prodEnv = require('./prod.env')

module.exports = {
  ...prodEnv,
  NODE_ENV: '"development"',
}
