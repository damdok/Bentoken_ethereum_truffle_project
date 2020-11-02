var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "5f4fd97251644d1fa37ee7acb872320f";
var mnemonic = "chalk sister sunny inch budget diesel pilot decade beyond benefit eager uniform";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 3000,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 3
    }
  }
};
