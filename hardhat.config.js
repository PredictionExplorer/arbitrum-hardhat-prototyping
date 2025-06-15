"use strict";

require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_KEY = "qykvunnTiSFjAEz2ZvHTKs1-ke40kxXN";
const SEPOLIA_PRIVATE_KEY = "77f59006b58fe17acc45f270b6e25fb8cfb301c387deeb76e382d2783a20d0ba";
const ARBITRUM_SEPOLIA_PRIVATE_KEY = "a4f4ffa74b24cb950c5bdb747fbd657b3014969274a3227fc61e054186493e6c";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		version: "0.8.30",
		settings: {
			evmVersion: "cancun",
			viaIR: true,
			optimizer: {
				enabled: true,
				// runs: 20_000,
			},
		},
	},

	networks: {
		hardhat: {
			gas: "auto",
		},
      sepolia: {
         url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
         accounts: [SEPOLIA_PRIVATE_KEY,],
			// gas: "auto",
      },
      arbitrumSepolia: {
         url: "https://sepolia-rollup.arbitrum.io/rpc",
         accounts: [ARBITRUM_SEPOLIA_PRIVATE_KEY,],
			// gas: "auto",
      },
		arbitrumOne: {
			url: "https://arb1.arbitrum.io/rpc",
			// accounts: (process.env.MAINNET_PRIVATE_KEY != undefined) ? [process.env.MAINNET_PRIVATE_KEY,] : [],
			// gas: "auto",
		},
	},

	mocha: {
		// parallel: true,
		timeout: 2 * 60 * 60 * 1000,
	},
};
