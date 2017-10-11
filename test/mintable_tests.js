let LATToken = artifacts.require("LATToken");

const assertFail = require("./helpers/assertFail");

let latToken;
let contribution;

contract("LATToken", function(accounts) {
  beforeEach(async () => {
    latToken = await LATToken.new();
    await latToken.changeMinter(accounts[0]);
  });

  it("Minter can mint", async () => {
    await latToken.issueTokens(accounts[0], 10000);
    assert.equal((await latToken.balanceOf.call(accounts[0])).toNumber(), 10000);

  });

  it("Only minter can mint", async () => {
    await assertFail(async () => {
        await latToken.issueTokens(accounts[1], 100, {
            from: accounts[1]
        });
    });
    assert.equal((await latToken.balanceOf.call(accounts[1])).toNumber(), 0);
  });
});
