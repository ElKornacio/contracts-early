let LATToken = artifacts.require("LATToken");

const assertFail = require("./helpers/assertFail");

let latToken;
let contribution;

contract("LATToken", function(accounts) {
  beforeEach(async () => {
    latToken = await LATToken.new();
    await latToken.changeMinter(accounts[0]);
    await latToken.issueTokens(accounts[0], 10000);
  });

  it("Minter can burn", async () => {
    await latToken.burnTokens(accounts[0], 10000);
    assert.equal((await latToken.balanceOf.call(accounts[0])).toNumber(), 0);
  });

  it("Only minter can burn", async () => {
    await assertFail(async () => {
        await latToken.burnTokens(accounts[0], 100, {
            from: accounts[1]
        });
    });
    assert.equal((await latToken.balanceOf.call(accounts[0])).toNumber(), 10000);
  });


  it("Minter cannot burn more than supply", async () => {
    await assertFail(async () => {
        await latToken.burnTokens(accounts[0], 10001, {
            from: accounts[0]
        });
    });
    assert.equal((await latToken.balanceOf.call(accounts[0])).toNumber(), 10000);
  });

});
