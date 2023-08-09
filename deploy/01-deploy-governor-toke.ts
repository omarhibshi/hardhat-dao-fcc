import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// @ts-ignore
import { ethers } from "hardhat"

const deployGovernanceToken: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment,
) {
    // @ts-ignore
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("_______________________________________")
    log("Deploying Governance Token...")
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        //waitConfirmations: 1,
    })
    log(`Governance Token deployed at ${governanceToken.address}`)
    log("_______________________________________")
    await delegate(governanceToken.address, deployer)
    log(
        `Delegated Governance Token "${governanceToken.address}" to "${deployer}" (to itself)`,
    )
}

const delegate = async function (
    governanceTokenAddress: string,
    delegatedAccount: string,
) {
    const governanceToken = await ethers.getContractAt(
        "GovernanceToken",
        governanceTokenAddress,
    )
    const transactionResponse = await governanceToken.delegate(delegatedAccount)
    await transactionResponse.wait(1)
    console.log(
        `Checkpoints: ${await governanceToken.numCheckpoints(
            delegatedAccount,
        )}`,
    )
}
export default deployGovernanceToken
deployGovernanceToken.tags = ["all", "governor"]
