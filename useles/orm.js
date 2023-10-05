const Waterline = require("waterline");
const wtl_pst = require('sails-postgresql');

const orm = new Waterline();
var adapters = {
  "postgresql":wtl_pst,
  default: "postgresql"
};
var connections = {
  // ...
  postgresdb: {
    /**
     * This 'connection' object could also be a connection string
     * e.g. 'postgresql://user:password@localhost:5432/databaseName?ssl=false'
     */
    "adapter":"postgresql",
    "host":"127.0.0.1",
    database: 'postgres',
    user: 'wwd',
    password: 'WWDldg!!!',
    port: 7654,
    ssl: false,
    /**
     * Pool configuration
     */
    pool: {
      min: 2,
      max: 20
    }
  }
}
var config = {
    "adapters":adapters,
    "datastores":connections
};
module.exports = {
  orm,
  config,connections
};

