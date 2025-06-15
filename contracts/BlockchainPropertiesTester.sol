// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ArbSys} from "@arbitrum/nitro-contracts/src/precompiles/ArbSys.sol";
import {ArbGasInfo} from "@arbitrum/nitro-contracts/src/precompiles/ArbGasInfo.sol";
import {ArbStatistics} from "@arbitrum/nitro-contracts/src/precompiles/ArbStatistics.sol";

contract BlockchainPropertiesTester {
	event BlockchainProperties5(
		uint256 blockNumber,
		uint256 blockTimeStamp,
		uint256 prevBlockHash,
		uint256 blockBaseFee,
		uint256 arbBlockNumber,
		uint256 prevArbBlockHash,
		uint256 gasBacklog,
		uint256 l1PricingUnitsSinceUpdate
	);

	ArbSys private constant _arbSys = ArbSys(address(0x64));
	ArbGasInfo private constant _arbGasInfo = ArbGasInfo(address(0x6C));
	ArbStatistics private constant _arbStatistics = ArbStatistics(address(0x6F));

	constructor() {
	}

	function test3() external view returns (uint256, uint256, uint256, uint256, uint256) {
		return (
			block.number,
			block.timestamp,
			uint256(blockhash(block.number - 1)),
			block.basefee,
			_arbSys.arbBlockNumber()
		);
	}

	function test5() external {
		uint256 arbBlockNumber_;
		{
			(bool isSuccess_, bytes memory returnData_) = address(_arbSys).call(abi.encodeWithSelector(ArbSys.arbBlockNumber.selector));
			if (isSuccess_ && returnData_.length == 256 / 8) {
				arbBlockNumber_ = abi.decode(returnData_, (uint256));
			} else {
				arbBlockNumber_ = 12345;
			}		
		}
		uint256 prevArbBlockHash_;
		unchecked {
			(bool isSuccess_, bytes memory returnData_) = address(_arbSys).call(abi.encodeWithSelector(ArbSys.arbBlockHash.selector, arbBlockNumber_ - 1));
			if (isSuccess_ && returnData_.length == 32) {
				prevArbBlockHash_ = uint256(abi.decode(returnData_, (bytes32)));
			} else {
				prevArbBlockHash_ = 0x1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111_1111;
				// prevArbBlockHash_ = blockhash(block.number - 1);
			}		
		}

		// ( uint256 perL2Tx_,
		//   uint256 perL1CallDataByte_,
		//   uint256 perStorageAllocation_,
		//   uint256 perArbGasBase_,
		//   uint256 perArbGasCongestion_,
		//   uint256 perArbGasTotal_
		// ) = _arbGasInfo.getPricesInWei();
		// _arbGasInfo.getPricesInArbGas
		// _arbGasInfo.getMinimumGasPrice
		// uint256 l1BaseFeeEstimate_ = _arbGasInfo.getL1BaseFeeEstimate();
		// uint64 l1RewardRate_ = _arbGasInfo.getL1RewardRate();
		// uint256 l1GasPriceEstimate_ = _arbGasInfo.getL1GasPriceEstimate();
		// uint256 currentTxL1GasFees_ = _arbGasInfo.getCurrentTxL1GasFees();

		uint256 gasBacklog_;
		{
			(bool isSuccess_, bytes memory returnData_) = address(_arbGasInfo).call(abi.encodeWithSelector(ArbGasInfo.getGasBacklog.selector));
			if (isSuccess_ && returnData_.length == 256 / 8) {
				// This is really a `uint64`, but it's probably more efficient to treat this as a blockchain-native word.
				gasBacklog_ = abi.decode(returnData_, (uint256));
			} else {
				gasBacklog_ = 23456;
			}		
		}

		// int256 l1PricingSurplus_ = _arbGasInfo.getL1PricingSurplus();
		// uint256 l1FeesAvailable_ = _arbGasInfo.getL1FeesAvailable();
		// uint64 lastL1PricingUpdateTime_ = _arbGasInfo.getLastL1PricingUpdateTime();
		// uint256 l1PricingFundsDueForRewards_ = _arbGasInfo.getL1PricingFundsDueForRewards();

		uint256 l1PricingUnitsSinceUpdate_;
		{
			(bool isSuccess_, bytes memory returnData_) = address(_arbGasInfo).call(abi.encodeWithSelector(ArbGasInfo.getL1PricingUnitsSinceUpdate.selector));
			if (isSuccess_ && returnData_.length == 256 / 8) {
				// This is really a `uint64`, but it's probably more efficient to treat this as a blockchain-native word.
				l1PricingUnitsSinceUpdate_ = abi.decode(returnData_, (uint256));
			} else {
				l1PricingUnitsSinceUpdate_ = 34567;
			}		
		}

		// int256 lastL1PricingSurplus_ = _arbGasInfo.getLastL1PricingSurplus();

		// (
		// 	uint256 blockNum_,
		// 	uint256 classicNumAccounts_,
		// 	uint256 classicStorageSum_,
		// 	uint256 classicGasSum_,
		// 	uint256 classicNumTxes_,
		// 	uint256 classicNumContracts_
		// ) = _arbStatistics.getStats();

		emit BlockchainProperties5(
			block.number,
			block.timestamp,
			uint256(blockhash(block.number - 1)),
			block.basefee,
			arbBlockNumber_,
			prevArbBlockHash_,
			gasBacklog_,
			l1PricingUnitsSinceUpdate_
		);
	}

	// function _getExtCodeSize(address address_) internal view returns (uint256) {
	// 	uint256 size_;
	// 	assembly {
	// 			size_ := extcodesize(address_)
	// 	}
	// 	return size_;
	// }
}
