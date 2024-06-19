const Addition = artifacts.require("Addition");

module.exports = function (_deployer) {
  _deployer.deploy(Addition);
};
