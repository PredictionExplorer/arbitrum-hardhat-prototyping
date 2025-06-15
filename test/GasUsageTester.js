"use strict";

const hre = require("hardhat");
// const {
// 	// time,
// 	loadFixture,
// } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {expect} = require("chai");

describe("GasUsageTester", function() {
	async function deployContracts() {
		let ownerAcct_;
		// const ownerAcctPrivateKey_ = process.env["OwnerAcctPrivateKey"];
		// if (ownerAcctPrivateKey_ != undefined) {
		// 	ownerAcct_ = new hre.ethers.Wallet(ownerAcctPrivateKey_, hre.ethers.provider);
		// } else {
			const signers_ = await hre.ethers.getSigners();
			// console.info(signers_.length.toString());
			ownerAcct_ = signers_[0];
		// }
		const gasUsageTesterFactory_ = await hre.ethers.getContractFactory("GasUsageTester", ownerAcct_);
		let gasUsageTester_;
		let gasUsageTesterAddr_ = process.env["GasUsageTesterAddr"];
		if (gasUsageTesterAddr_ == undefined) {
			gasUsageTester_ = await gasUsageTesterFactory_.deploy();
			await gasUsageTester_.waitForDeployment();
			gasUsageTesterAddr_ = await gasUsageTester_.getAddress();
			console.info(gasUsageTesterAddr_);
		} else {
			gasUsageTester_ = gasUsageTesterFactory_.attach(gasUsageTesterAddr_);
		}
		return {ownerAcct: ownerAcct_, gasUsageTester: gasUsageTester_, gasUsageTesterAddr: gasUsageTesterAddr_,};
	}

	it("Test 1", async function() {
		// const contracts_ = await loadFixture(deployContracts);
		const contracts_ = await deployContracts();

		// const value_ = 10n ** 18n;
		const value_ = 1n;
		// const gasLimit_ = 30_022n + 500n;
		let transactionResponse_ = await contracts_.gasUsageTester.test1(value_, {value: value_, /*gasLimit: gasLimit_,*/});
		let transactionReceipt_ = await transactionResponse_.wait();
		const gasPrice_ = transactionReceipt_.effectiveGasPrice ?? transactionReceipt_.gasPrice;
		const transactionFeeInEth_ = transactionReceipt_.gasUsed * gasPrice_;
		expect(transactionFeeInEth_).equal(transactionReceipt_.fee);
		console.info(
			transactionResponse_.chainId.toString(),
			transactionResponse_.gasLimit.toString(),
			(Number(transactionResponse_.maxFeePerGas) / 1.0e9).toString(),
			(Number(transactionResponse_.maxPriorityFeePerGas) / 1.0e9).toString(),
			(Number(transactionReceipt_.effectiveGasPrice ?? -1n) / 1.0e9).toString(),
			(Number(transactionReceipt_.gasPrice) / 1.0e9).toString(),
			transactionReceipt_.gasUsed.toString(),
			(Number(transactionFeeInEth_) / 1.0e9).toString()
		);
		let log_ = transactionReceipt_.logs[0];
		// log_ = contracts_.gasUsageTester.interface.parseLog(log_);
		console.info(
			(Number(log_.args[0]) / 1.0e9).toString(),
			(Number(log_.args[1]) / 1.0e9).toString(),
			log_.args[2].toString(16).padStart(64, "0"),
			log_.args[3].toString()
		);
	});
});
