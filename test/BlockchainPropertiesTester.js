"use strict";

const hre = require("hardhat");
// const {
// 	// time,
// 	loadFixture,
// } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
// const {expect} = require("chai");
const {NonceManager} = require("ethers");
const {sleepForMilliSeconds} = require("../src/Helpers.js");

describe("BlockchainPropertiesTester", function() {
	async function deployContracts() {
		const signers_ = await hre.ethers.getSigners();
		let ownerAcct_ = signers_[0];
		ownerAcct_ = new NonceManager(ownerAcct_);
		const blockchainPropertiesTesterFactory_ = await hre.ethers.getContractFactory("BlockchainPropertiesTester", ownerAcct_);
		let blockchainPropertiesTester_;
		let blockchainPropertiesTesterAddr_ = process.env["BlockchainPropertiesTesterAddr"];
		if (blockchainPropertiesTesterAddr_ == undefined) {
			blockchainPropertiesTester_ = await blockchainPropertiesTesterFactory_.deploy();
			// console.info("202506267")
			await blockchainPropertiesTester_.waitForDeployment();
			// console.info("202506268")
			blockchainPropertiesTesterAddr_ = await blockchainPropertiesTester_.getAddress();
			console.info(blockchainPropertiesTesterAddr_);
		} else {
			blockchainPropertiesTester_ = blockchainPropertiesTesterFactory_.attach(blockchainPropertiesTesterAddr_);
		}
		return {ownerAcct: ownerAcct_, blockchainPropertiesTester: blockchainPropertiesTester_, blockchainPropertiesTesterAddr: blockchainPropertiesTesterAddr_,};
	}

	it("Test 2", async function() {
		// const contracts_ = await deployContracts();

		for ( let counter_ = 1; counter_ <= 30; ++ counter_ ) {
			let dateTimeStamp1_;

			{
				const requestSendTimeOffsetWithinSecondInMilliSeconds_ = 700;
				let currentDateTime_ = Date.now();
				let numMilliSecondsToSleep_ = (1000 - (currentDateTime_ - requestSendTimeOffsetWithinSecondInMilliSeconds_) % 1000) /* % 1000 */;
				let wakeUpTime_ = currentDateTime_ + numMilliSecondsToSleep_;
				// console.info("***", currentDateTime_.toString(), numMilliSecondsToSleep_.toString(), wakeUpTime_.toString());
				do {
					await sleepForMilliSeconds(Math.max(numMilliSecondsToSleep_ - 1, 1));
					dateTimeStamp1_ = Date.now();
					numMilliSecondsToSleep_ = wakeUpTime_ - dateTimeStamp1_;
					// console.info("***", numMilliSecondsToSleep_.toString());
				} while (numMilliSecondsToSleep_ > 0);
			}

			{
				let latestBlock_ = await hre.ethers.provider.getBlock("latest");
				let dateTimeStamp2_ = Date.now();
				console.info(
					dateTimeStamp1_.toString(),
					dateTimeStamp2_.toString(),
					(dateTimeStamp2_ - dateTimeStamp1_).toString().padStart(4, " "),
					latestBlock_.timestamp.toString(),

					// This should be equal `requestSendTimeOffsetWithinSecondInMilliSeconds_`.
					// A greater value indicates a high latency.
					// We are interested in the block that lasts from 750 ms within a second until the next second.
					// In other words, it completes zero ms after the beginning of a second, which becomes its timestamp.
					// If we send a request for latest block at a boundary of a second plus few in any milliseconds,
					// and plus network latency that it's going to take Arbitrum to receive our request,
					// we are supposed to get that block.
					// But to achieve the desired behavior,
					// we have to set `requestSendTimeOffsetWithinSecondInMilliSeconds_` to a big value.
					(dateTimeStamp1_ - latestBlock_.timestamp * 1000).toString().padStart(4, " ")
				);
			}
		}
	});

	it("Test 3", async function() {
		const contracts_ = await deployContracts();

		for ( let counter_ = 1; counter_ <= 30; ++ counter_ ) {
			let dateTimeStamp1_ = Date.now();
			let test3Result_ = await contracts_.blockchainPropertiesTester.test3();
			let dateTimeStamp2_ = Date.now();
			console.info(
				counter_.toString().padStart(2, " "),
				(dateTimeStamp2_ - dateTimeStamp1_).toString().padStart(4, " "),
				test3Result_[0].toString(),
				test3Result_[1].toString(),
				(dateTimeStamp2_ - Number(test3Result_[1]) * 1000).toString().padStart(4, " "),
				test3Result_[2].toString(16).padStart(64, "0"),
				(Number(test3Result_[3]) / 1.0e+9).toString(),
				test3Result_[4].toString(),
			);
		}
	});

	it("Test 4", async function() {
		// const contracts_ = await deployContracts();

		const arbSys_ = await hre.ethers.getContractAt("ArbSys", "0x0000000000000000000000000000000000000064"/*, contracts_.ownerAcct*/);
		const arbGasInfo_ = await hre.ethers.getContractAt("ArbGasInfo", "0x000000000000000000000000000000000000006C"/*, contracts_.ownerAcct*/);

		{
			let dateTimeStamp1_ = Date.now();
			console.info(
				await arbSys_.arbBlockNumber(), "\n",
				await arbGasInfo_.getPricesInWei(), "\n",
				await arbGasInfo_.getPricesInArbGas(), "\n",
				await arbGasInfo_.getMinimumGasPrice(), "\n",
				await arbGasInfo_.getL1BaseFeeEstimate(), "\n",
				await arbGasInfo_.getL1GasPriceEstimate(), "\n",
				await arbGasInfo_.getGasBacklog(), "\n",
				await arbGasInfo_.getL1PricingSurplus(), "\n",
				await arbGasInfo_.getL1PricingUnitsSinceUpdate(), "\n"
			);
			let dateTimeStamp2_ = Date.now();
			console.info((dateTimeStamp2_ - dateTimeStamp1_).toString(), "\n");
		}

		for ( let counter_ = 1; counter_ <= 20; ++ counter_ ) {
			let dateTimeStamp1_ = Date.now();
			let arbBlockNumberPromise_ = arbSys_.arbBlockNumber();
			let latestBlockPromize_ = hre.ethers.provider.getBlock("latest");
			let getGasBacklogPromise_ = arbGasInfo_.getGasBacklog();
			let getL1PricingUnitsSinceUpdatePromise_ = arbGasInfo_.getL1PricingUnitsSinceUpdate();
			let results_ = await Promise.all([arbBlockNumberPromise_, latestBlockPromize_, getGasBacklogPromise_, getL1PricingUnitsSinceUpdatePromise_]);
			let dateTimeStamp2_ = Date.now();
			console.info(
				(dateTimeStamp2_ - dateTimeStamp1_).toString().padStart(4, " "),
				results_[0].toString(),
				(dateTimeStamp2_ - results_[1].timestamp * 1000).toString().padStart(4, " "),
				results_[2].toString().padStart(7, " "),
				results_[3].toString().padStart(8, " ")
			);
		}
	});

	it("Test 5", async function() {
		const modeCode_ = 0;

		const contracts_ = await deployContracts();

		const arbSys_ = await hre.ethers.getContractAt("ArbSys", "0x0000000000000000000000000000000000000064", contracts_.ownerAcct);
		// const arbGasInfo_ = await hre.ethers.getContractAt("ArbGasInfo", "0x000000000000000000000000000000000000006C", contracts_.ownerAcct);

		const feeData_ = await hre.ethers.provider.getFeeData();
		// console.log(feeData_);
		// return;

		// The use of this will prevent another request to estimate gas.
		const myFeeData_ = {
			// gasPrice: feeData_.gasPrice * 2n,
			maxFeePerGas: feeData_.maxFeePerGas,
			maxPriorityFeePerGas: feeData_.maxPriorityFeePerGas,
			gasLimit: 100_000n,
		};

		// let initialDateTimeStamp_;

		const manageTransactionResponsePromise_ =
			async (
				counter_,
				transactionRequestSendDateTimeStamp_,
				arbBlockNumberPromise_,
				transactionResponsePromise_
			) => {
				try {
					let arbBlockNumber_;
					let dateTimeStamp1_;
					const waitForArbBlockNumber_ = async () => {
						try {
							arbBlockNumber_ = await arbBlockNumberPromise_;
							dateTimeStamp1_ = Date.now();
						} catch (errorObject_) {
							dateTimeStamp1_ = Date.now();
							// console.error(errorObject_);
							// console.error(errorObject_.message);
							arbBlockNumber_ = 111_111_111_111n;
						}
					};
					let waitForArbBlockNumberPromise_ = waitForArbBlockNumber_();
					let transactionResponse_ = await transactionResponsePromise_;
					let dateTimeStamp2_ = Date.now();
					let transactionReceipt_ = await transactionResponse_.wait();
					let dateTimeStamp3_ = Date.now();
					await waitForArbBlockNumberPromise_;
					let log_ = transactionReceipt_.logs[0];
					console.info(
						counter_.toString().padStart(2, " "),
						transactionRequestSendDateTimeStamp_.toString(),
						// (transactionRequestSendDateTimeStamp_ - initialDateTimeStamp_).toString().padStart(4, " "),
						(dateTimeStamp1_ - transactionRequestSendDateTimeStamp_).toString().padStart(4, " "),
						(dateTimeStamp2_ - transactionRequestSendDateTimeStamp_).toString().padStart(4, " "),
						"+",
						(dateTimeStamp3_ - dateTimeStamp2_).toString().padStart(4, " "),
						"=",
						(dateTimeStamp3_ - transactionRequestSendDateTimeStamp_).toString().padStart(4, " "),
						(dateTimeStamp3_ - dateTimeStamp1_).toString().padStart(5, " "),
						log_.args[0].toString(),
						log_.args[1].toString(),

						// [Comment-202506272/]
						(Number(log_.args[1]) * 1000 - transactionRequestSendDateTimeStamp_).toString().padStart(4, " "),

						(dateTimeStamp3_ - Number(log_.args[1]) * 1000).toString().padStart(4, " "),
						log_.args[2].toString(16).padStart(64, "0"),
						(Number(log_.args[3]) / 1.0e+9).toString(),
						arbBlockNumber_.toString(),
						log_.args[4].toString(),
						(log_.args[4] - arbBlockNumber_).toString().padStart(3, " "),
						log_.args[5].toString(16).padStart(64, "0"),
						log_.args[6].toString().padStart(7, " "),
						log_.args[7].toString().padStart(8, " ")
					);
				} catch (errorObject_) {
					// console.error(errorObject_);
					console.error(errorObject_.message);
				}
			};

		// Reducing the chance of the "too many requests" error.
		await sleepForMilliSeconds(2000);

		const promises_ = [];
		// initialDateTimeStamp_ = Date.now();
		for ( let counter_ = 1; counter_ <= 35; ++ counter_ ) {
			if (modeCode_ <= 0) {
				await sleepForMilliSeconds(79);
			} else {
				// We want our transaction to be included in the last block with a particular second resolution timestamp.
				// Arbitrum mines 4 blocks per second, so the block from 500 ms until 750 ms after the beginning of a second
				// is the one we want.
				// The next block timestamp will be greater by 1.
				// We will send our transaction some time after the target block time interval begins
				// and hope that it will still be included in the block.
				// The value logged near Comment-202506272
				// being approximately equal negative `transactionRequestSendTimeOffsetWithinSecondInMilliSeconds_`
				// will indicate that our hope has been fulfilled.
				{
					const targetBlockBeginOffsetWithinSecondInMilliSeconds_ = 500;
					const offsetWithinTargetBlockInMilliSeconds_ = 125;
					const transactionRequestSendTimeOffsetWithinSecondInMilliSeconds_ = targetBlockBeginOffsetWithinSecondInMilliSeconds_ + offsetWithinTargetBlockInMilliSeconds_;
					let currentDateTime_ = Date.now();
					let numMilliSecondsToSleep_ = (1000 - (currentDateTime_ - transactionRequestSendTimeOffsetWithinSecondInMilliSeconds_) % 1000) /* % 1000 */;
					let wakeUpTime_ = currentDateTime_ + numMilliSecondsToSleep_;
					// console.info("***", currentDateTime_.toString(), numMilliSecondsToSleep_.toString(), wakeUpTime_.toString());
					do {
						await sleepForMilliSeconds(Math.max(numMilliSecondsToSleep_ - 1, 1));
						numMilliSecondsToSleep_ = wakeUpTime_ - Date.now();
						// console.info("***", numMilliSecondsToSleep_.toString());
					} while (numMilliSecondsToSleep_ > 0);
				}
			}
			{
				let transactionRequestSendDateTimeStamp_ = Date.now();
				let arbBlockNumberPromise_ = arbSys_.arbBlockNumber();
				let transactionResponsePromise_ = contracts_.blockchainPropertiesTester.test5(myFeeData_);
				let manageTransactionResponsePromisePromise_ =
					manageTransactionResponsePromise_(
						counter_,
						transactionRequestSendDateTimeStamp_,
						arbBlockNumberPromise_,
						transactionResponsePromise_
					);
				promises_.push(manageTransactionResponsePromisePromise_);
			}
		}
		await Promise.all(promises_);
	});
});
