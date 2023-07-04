import { task } from 'hardhat/config';
import { BigNumber, ContractTransaction, ContractReceipt } from 'ethers';
import { Address } from 'cluster';

task('transferFrom', 'Transfer tokens from an approved allowance')
    .addParam('token', 'Token address')
    .addParam('sender', 'Sender user address')
    .addParam('recipient', 'Recipient user address')
    .addParam('amount', 'Token amount')
    .setAction(async ({ token, sender, recipient, amount }, { ethers }) => {
        const Token = await ethers.getContractFactory('MyToken');
        const tokenContract = Token.attach(token);

        const contractTx: ContractTransaction = await tokenContract.transferFrom(sender, recipient, amount);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Transfer');
        const eFrom: Address = event?.args!['from'];
        const eTo: Address = event?.args!['to'];
        const eAmount: BigNumber = event?.args!['value'];

        console.log(`From: ${eFrom}`);
        console.log(`To: ${eTo}`);
        console.log(`Amount: ${eAmount}`);
    });
