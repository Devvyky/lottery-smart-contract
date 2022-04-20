const assert = require('assert');
const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');
const web3 = require('web3');

require('@nomiclabs/hardhat-waffle');

let contract;
let lottery;
let accounts;
let provider;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await hre.ethers.getSigners();

  provider = waffle.provider;

  // deploy the contract
  const Lottery = await ethers.getContractFactory('Lottery');
  lottery = await Lottery.deploy();
  contract = await lottery.deployed();
});

describe('Lottery', function () {
  it('deploys a contract', async () => {
    assert.ok(contract);
  });

  it('list players', async () => {
    const players = await contract.listPayers();
    expect(players).to.be.an('array');
  });

  it('allows an account to enter lottery', async () => {
    await contract.enter({
      from: accounts[0].address,
      value: ethers.utils.parseEther('1'),
    });

    const players = await contract.listPayers();
    assert.equal(accounts[0].address, players[0]);
    assert.equal(1, players.length);
  });

  it('requires minimum amount of ether to enter', async () => {
    try {
      await contract.enter({
        from: accounts[0].address,
        value: 0,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('only manager can pickWinner', async () => {
    try {
      await contract.pickWinner({
        from: accounts[1].address,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('sends money to winner and resets players', async () => {
    await contract.enter({
      from: accounts[0].address,
      value: ethers.utils.parseEther('2'),
    });

    const initialBalnce = await provider.getBalance(accounts[0].address);
    await contract.pickWinner({
      from: accounts[0].address,
    });
    const finalBalance = await provider.getBalance(accounts[0].address);
    const difference = finalBalance - initialBalnce;
    assert(difference > ethers.utils.parseEther('1.8'));
  });
});
