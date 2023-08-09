import "hardhat-deploy"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import { HardhatUserConfig } from "hardhat/types"
import "dotenv/config"
import "hardhat-contract-sizer"
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia"
const SANAA_PRIVATE_KEY = process.env.SANAA_PRIVATE_KEY || ""
/**
 * @type import('hardhat/config').HardhatUserConfig
 * */

// module.exports = {
//   solidity: "0.8.19",
// };

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: { chainId: 31337 }, // the hardhat network when you run tests
        localhost: {
            // the hardhat network when you run a hardhat node locally
            chainId: 31337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [SANAA_PRIVATE_KEY],
            chainId: 11155111,
        },
    },
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    contractSizer: {
        alphaSort: true,
        disambiguatePaths: false,
        runOnCompile: true,
        strict: true,
        only: [":ERC20$"],
    },
    namedAccounts: {
        deployer: {
            default: 0, // Whatever network wre on, the zeroed-indexed account will be the deployer
        },
    },
}

export default config
