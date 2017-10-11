var LAToken = artifacts.require("./LATToken.sol");
var LATokenMinter = artifacts.require("./LATokenMinter.sol");
var ExchangeContract = artifacts.require("./ExchangeContract.sol");

module.exports = function(deployer) {
  deployer.deploy(LAToken);
  deployer.deploy(LATokenMinter);
  deployer.deploy(ExchangeContract);
};
