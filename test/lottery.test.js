const assert = require('assert');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const web3 = require('web3');

require('@nomiclabs/hardhat-waffle');

let contract;
let lottery;
let accounts;

console.log(ethers.utils.formatEther);

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await hre.ethers.getSigners();
  //   for (const account of accounts) {
  //     console.log(account.address);
  //   }

  // deploy the contract
  const Lottery = await ethers.getContractFactory('Lottery');
  lottery = await Lottery.deploy();
});

describe('Lottery', function () {
  it('deploys a contract', async () => {
    contract = await lottery.deployed();
    assert.ok(contract);
  });
  it('list players', async () => {
    const players = await contract.listPayers();
    expect(players).to.be.an('array');
  });
  it('allows an account to enter lottery', async () => {
    await contract.enter().send({
      from: accounts[0].address,
      value: web3.utils.toWei('1', 'ether'),
    });

    const players = await contract.listPayers();
    assert.equal(accounts[0].address, players[0]);
  });
});
