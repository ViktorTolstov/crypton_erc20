import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";

const DECIMALS = 18;
const NAME = "MyToken";
const SYMBOL = "MTKV";
const INITIAL_AMOUNT = ethers.utils.parseUnits("1", "18"); // 10^18
// const bigNumberExample = BigNumber.from(1000);

describe("MyToken contract", function () {
  let MyToken;
  let myToken: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, users: SignerWithAddress[];

  beforeEach(async () => {
    MyToken = await ethers.getContractFactory('MyToken');
    [owner, user1, user2, ...users] = await ethers.getSigners();
    myToken = await MyToken.deploy(NAME, SYMBOL);
  });

  describe("Initial params of contract", async () => {
    it("Should have correct name and symbol", async () => {
      const name = await myToken.name();
      const symbol = await myToken.symbol();

      expect(name).to.equal(NAME);
      expect(symbol).to.equal(SYMBOL);
    });
  });

  describe("Contract logic", function () {
    // async function deployFixture() {
    //   const [owner, user1, user2] = await ethers.getSigners();
    //   let customToken = await ethers.getContractFactory(NAME);
    //   let token = await customToken.deploy(NAME, SYMBOL);
    //   return {token, owner, user1, user2}
    // }

    it("Mint", async () => {
      const userAddress = user1.address;
      const amount = ethers.utils.parseEther("1");

      await myToken.connect(owner).mint(userAddress, amount);

      const balance = await myToken.balanceOf(userAddress);
      expect(balance).to.equal(amount);
    });

    it("Approve", async () => {
      const senderAddress = owner.address;
      const recipientAddress = user1.address;
      const transferAmount = ethers.utils.parseEther("0.5");

      await myToken.connect(owner).approve(recipientAddress, transferAmount);
      await myToken.connect(user1).transferFrom(senderAddress, recipientAddress, transferAmount);

      const senderBalance = await myToken.balanceOf(senderAddress);
      const recipientBalance = await myToken.balanceOf(recipientAddress);
      expect(senderBalance).to.equal(ethers.utils.parseEther("9.5"));
      expect(recipientBalance).to.equal(transferAmount);
    });

    it("Transfer", async () => {
      const sender = owner;
      const recipient = user1;
      const amount = ethers.utils.parseEther("0.5");
  
      await myToken.connect(sender).mint(sender.address, amount);
  
      const senderBalanceBefore = await myToken.balanceOf(sender.address);
      const recipientBalanceBefore = await myToken.balanceOf(recipient.address);
  
      await myToken.connect(sender).transfer(recipient.address, amount);
  
      const senderBalanceAfter = await myToken.balanceOf(sender.address);
      const recipientBalanceAfter = await myToken.balanceOf(recipient.address);
  
      expect(senderBalanceAfter).to.equal(senderBalanceBefore.sub(amount));
      expect(recipientBalanceAfter).to.equal(recipientBalanceBefore.add(amount));
    });
  
    it("Transfer from", async () => {
      const ownerAddress = owner.address;
      const spenderAddress = user1.address;
      const recipientAddress = user2.address;
      const approvalAmount = ethers.utils.parseEther("0.5");
      const transferAmount = ethers.utils.parseEther("0.3");
  
      await myToken.connect(owner).mint(ownerAddress, approvalAmount);
  
      await myToken.connect(owner).approve(spenderAddress, approvalAmount);
  
      const spenderAllowanceBefore = await myToken.allowance(ownerAddress, spenderAddress);
      const recipientBalanceBefore = await myToken.balanceOf(recipientAddress);
  
      await myToken.connect(user1).transferFrom(ownerAddress, recipientAddress, transferAmount);
  
      const spenderAllowanceAfter = await myToken.allowance(ownerAddress, spenderAddress);
      const recipientBalanceAfter = await myToken.balanceOf(recipientAddress);
  
      expect(spenderAllowanceAfter).to.equal(spenderAllowanceBefore.sub(transferAmount));
      expect(recipientBalanceAfter).to.equal(recipientBalanceBefore.add(transferAmount));
    });
  

    it("Burn", async () => {
      const burnerAddress = owner.address;
      const burnAmount = ethers.utils.parseEther("0.5");

      await myToken.connect(owner).burn(burnAmount);

      const balance = await myToken.balanceOf(burnerAddress);
      expect(balance).to.equal(ethers.utils.parseEther("9.5"));
    });
  });
});
