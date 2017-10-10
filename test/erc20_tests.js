//let MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");
let LATToken = artifacts.require("LATToken");
const BigNumber = require("bignumber.js");
const assertFail = require("./helpers/assertFail");

let latToken;

contract("LATToken Defualt", function(accounts) {
  beforeEach(async () => {
        latToken = await LATToken.new();
  });

  // CREATION
  it("creation: should have imported an initial balance of 0", async () => {
    assert.equal(
      (await latToken.balanceOf.call(accounts[0])).toNumber(),
      0
    );
  });
});

contract("LATToken", function(accounts) {
  beforeEach(async () => {
        latToken = await LATToken.new();

        await latToken.changeMinter(accounts[0]);
        await latToken.issueTokens(accounts[0], 10000);
  });

  // CREATION
  it("creation: should have imported an initial balance of 10000", async () => {
    assert.equal(
      (await latToken.balanceOf.call(accounts[0])).toNumber(),
      10000
    );
  });

  // TRANSERS
  it("transfers: should transfer 10000 to accounts[1] with accounts[0] having 10000", async () => {
    watcher = latToken.Transfer();
    await latToken.transfer(accounts[1], 10000, {
      from: accounts[0]
    });
    let logs = watcher.get();
    assert.equal(logs[0].event, "Transfer");
    assert.equal(logs[0].args._from, accounts[0]);
    assert.equal(logs[0].args._to, accounts[1]);
    assert.equal(logs[0].args._value.toNumber(), 10000);
    assert.equal(await latToken.balanceOf.call(accounts[0]), 0);
    assert.equal(
      (await latToken.balanceOf.call(accounts[1])).toNumber(),
      10000
    );
  });

  //Fails due to transfer throwing rather than returning 
  it("transfers: should fail when trying to transfer 10001 to accounts[1] with accounts[0] having 10000", async () => {
    await latToken.transfer(
      accounts[1], 100001,
      {
        from: accounts[0]
      }
    );
    assert.equal(
      (await latToken.balanceOf.call(accounts[0])).toNumber(),
      10000
    );
  });

  // APPROVALS 
  it("approvals: msg.sender should approve 100 to accounts[1]", async () => {
    watcher = latToken.Approval();
    await latToken.approve(accounts[1], 100, { from: accounts[0] });
    let logs = watcher.get();
    assert.equal(logs[0].event, "Approval");
    assert.equal(logs[0].args._owner, accounts[0]);
    assert.equal(logs[0].args._spender, accounts[1]);
    assert.equal(logs[0].args._value.toNumber(), 100);

    assert.equal(
      (await latToken.allowance.call(accounts[0], accounts[1])).toNumber(),
      100
    );
  });

  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once.", async () => {
    watcher = latToken.Transfer();
    await latToken.approve(accounts[1], 100, { from: accounts[0] });

    assert.equal((await latToken.balanceOf.call(accounts[2])).toNumber(), 0);
    await latToken.transferFrom(accounts[0], accounts[2], 20, {
      from: accounts[1]
    });

    var logs = watcher.get();
    assert.equal(logs[0].event, "Transfer");
    assert.equal(logs[0].args._from, accounts[0]);
    assert.equal(logs[0].args._to, accounts[2]);
    assert.equal(logs[0].args._value.toNumber(), 20);

    assert.equal(
      (await latToken.allowance.call(accounts[0], accounts[1])).toNumber(),
      80
    );

    assert.equal((await latToken.balanceOf.call(accounts[2])).toNumber(), 20);

    assert.equal(
      (await latToken.balanceOf.call(accounts[0])).toNumber(),
      9980
    );
  });

  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice.", async () => {
    await latToken.approve(accounts[1], 100, { from: accounts[0] });
    await latToken.transferFrom(accounts[0], accounts[2], 20, {
      from: accounts[1]
    });
    await latToken.transferFrom(accounts[0], accounts[2], 20, {
      from: accounts[1]
    });
    await latToken.allowance.call(accounts[0], accounts[1]);

    assert.equal(
      (await latToken.allowance.call(accounts[0], accounts[1])).toNumber(),
      60
    );

    assert.equal((await latToken.balanceOf.call(accounts[2])).toNumber(), 40);

    assert.equal(
      (await latToken.balanceOf.call(accounts[0])).toNumber(),
      9960
    );
  });

  //should approve 100 of msg.sender & withdraw 50 & 60 (should fail).
  it("approvals: msg.sender approves accounts[1] of 100 & withdraws 50 & 60 (2nd tx should fail)", async () => {
    await latToken.approve(accounts[1], 100, { from: accounts[0] });
    await latToken.transferFrom(accounts[0], accounts[2], 50, {
      from: accounts[1]
    });
    assert.equal(
      (await latToken.allowance.call(accounts[0], accounts[1])).toNumber(),
      50
    );

    assert.equal((await latToken.balanceOf.call(accounts[2])).toNumber(), 50);

    assert.equal(
      (await latToken.balanceOf.call(accounts[0])).toNumber(),
      9950
    );

    assert.equal(await latToken.transferFrom.call(accounts[0], accounts[2], 60, {
        from: accounts[1]
      }), false);

    assert.equal((await latToken.balanceOf.call(accounts[2])).toNumber(), 50);
    assert.equal(
      (await latToken.balanceOf.call(accounts[0])).toNumber(),
      9950
    );
  });

  it("approvals: attempt withdrawal from account with no allowance (should fail)", async () => {
    assert.equal(await latToken.transferFrom.call(accounts[0], accounts[2], 60, {
        from: accounts[1]
      }), false);

    assert.equal(
      (await latToken.balanceOf.call(accounts[0])).toNumber(),
      10000
    );
  });

  it("approvals: allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer.", async () => {
    await latToken.approve(accounts[1], 100, { from: accounts[0] });
    await latToken.transferFrom(accounts[0], accounts[2], 60, {
      from: accounts[1]
    });
    await latToken.approve(accounts[1], 0, { from: accounts[0] });
    assert.equal(await latToken.transferFrom.call(accounts[0], accounts[2], 10, {
        from: accounts[1]
      }), false);
    assert.equal(
      (await latToken.balanceOf.call(accounts[0])).toNumber(),
      9940
    );
  });
});
