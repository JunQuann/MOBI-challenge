const P2Pcharging = artifacts.require("P2Pcharging");

module.exports = function(deployer) {
    deployer.deploy(P2Pcharging);
}