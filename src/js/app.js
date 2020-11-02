App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('SimpleERC20Token.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var SimpleERC20TokenArtifact = data;
      App.contracts.SimpleERC20Token = TruffleContract(SimpleERC20TokenArtifact);
    
      // Set the provider for our contract
      App.contracts.SimpleERC20Token.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
    },

  bindEvents: function() {
    $(document).on('click', '#burn', App.handleAdopt);
  },

  markAdopted: function() {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();
    //var petId = parseInt($(event.target).data('id'));
    var SimpleERC20TokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
      console.log(error);
    }

      var account = accounts[0];

      App.contracts.SimpleERC20Token.deployed().then(function(instance) {
        SimpleERC20TokenInstance = instance;
        // SimpleERC20TokenInstance.burn.call().then(function() {
        //   alert(123);
        // });
      // Execute adopt as a transaction by sending account
      return SimpleERC20TokenInstance.burn({from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
