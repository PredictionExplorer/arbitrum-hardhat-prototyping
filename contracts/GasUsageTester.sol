// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract GasUsageTester {
	event GasUsed(
		uint256 blockBaseFee,
		uint256 txGasPrice,
		uint256 prevBlockHash,
		uint256 accurateGasUsed
	);

	constructor() {
	}

	function test1(uint256 value_) external payable {
		uint256 gasUsed1_ = gasleft();
		uint256 gasUsed2_ = gasleft();
		(bool isSuccess_, ) = msg.sender.call{value: value_}("");
		if ( ! isSuccess_ ) {
			revert("Error 202506215.");
		}
		gasUsed2_ -= gasleft();
		gasUsed1_ -= gasleft();
		uint256 accurateGasUsed_ = gasUsed2_ - (gasUsed1_ - gasUsed2_);
		emit GasUsed(block.basefee, tx.gasprice, uint256(blockhash(block.number - 1)), accurateGasUsed_);
	}
}
