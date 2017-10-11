let LATminter = artifacts.require("LATokenMinterMock");
let LATtoken = artifacts.require("LATToken");
const assertFail = require("./helpers/assertFail");

let minter, token;
const minute = 60
const hour = 60 * minute;
const day = 24 * hour;

const minterStartTime = 1661166000; // This comes from the LATToken constructor
const tokenPerDay = 328767123287;

contract("LATokenMinter", function(accounts) {
  beforeEach(async () => {
    token = await LATtoken.new();
    minter = await LATminter.new(token.address, accounts[0]);
    await token.changeMinter(minter.address);
    await minter.changeTeamPoolForFrozenTokens(accounts[1]);
  });

  it("Harvest function works correctly", async () => {
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 0);
    await minter.setBlockTimestamp(minterStartTime);
    await minter.harvest();
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), tokenPerDay);
    await minter.setBlockTimestamp(minterStartTime + (1 * day));
    await minter.harvest();
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), tokenPerDay * 2);

    await minter.setBlockTimestamp(minterStartTime + (8 * day));
    await minter.harvest();
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), tokenPerDay * 9);

    await minter.setBlockTimestamp(minterStartTime + (365 * day));
    await minter.harvest();
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), tokenPerDay * 366);

    await minter.setBlockTimestamp(minterStartTime + (5 * (365 * day)));
    await minter.harvest();
    assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), tokenPerDay * (5 * 365));

    await assertFail(async () => { await minter.harvest() });
  });

});
