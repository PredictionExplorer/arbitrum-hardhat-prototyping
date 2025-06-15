#!/usr/bin/bash

# '/usr/bin/clear'

(
	# 'npx' 'hardhat' 'test' '--grep' '^GasUsageTester Test 1$'

	# export GasUsageTesterAddr='0xD6041aDa97c4F2A5654a0323e3221eb4F8ae4c06'
	# 'npx' 'hardhat' 'test' '--network' 'sepolia' '--grep' '^GasUsageTester Test 1$'

	# export GasUsageTesterAddr='0x5D6f0661D03d1116bD3F385b42CFA5E52BF9D2bd'
	# 'npx' 'hardhat' 'test' '--network' 'arbitrumSepolia' '--grep' '^GasUsageTester Test 1$'


	# 'npx' 'hardhat' 'test' '--grep' '^BlockchainPropertiesTester Test 2$'

	# export BlockchainPropertiesTesterAddr='0x59E40Fce598f8A7ca5Cf727666853b0B12acA21f'
	# 'npx' 'hardhat' 'test' '--network' 'sepolia' '--grep' '^BlockchainPropertiesTester Test 2$'

	export BlockchainPropertiesTesterAddr='0xe34dBce166eC1932AD038253B2Eb2A20e4f4562d'
	'npx' 'hardhat' 'test' '--network' 'arbitrumSepolia' '--grep' '^BlockchainPropertiesTester Test 5$'

	# 'npx' 'hardhat' 'test' '--network' 'arbitrumOne' '--grep' '^BlockchainPropertiesTester Test 2$'
)
