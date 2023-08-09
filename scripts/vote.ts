import {
    proposalsFile,
    developmentChains,
    VOTING_DELAY,
    VOTING_PERIOD,
} from "../helper-hardhat-config"
import * as fs from "fs"
//@ts-ignore
import { ethers, network } from "hardhat"
import { moveBlocks } from "../utils/move-blocks"

const index = 0 // index of proposal to vote on (0 is the first proposal in proposals.json)

async function main(proposalIndex: number) {
    let proposalState
    const governor = await ethers.getContract("GovernorContract")
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    const proposalId = proposals[network.config.chainId!][proposalIndex]
    proposalState = await governor.state(proposalId)
    console.log("Proposal status bfore vote: ", proposalState.toString())

    // 0 = Against, 1 = For, 2 = Abstain
    const voteWay = 1
    const reason = "I like a do da cha cha"
    await vote(proposalId, voteWay, reason)

    // const voteTxResponse = await governor.castVoteWithReason(
    //     proposalId,
    //     vote,
    //     reason,
    // )
    // const proposalStatus = await voteTxResponse.wait(1)
    // // If working on a development chain, we will push forward till we get to the voting period.
    // if (developmentChains.includes(network.name)) {
    //     await moveBlocks(VOTING_DELAY + 1)
    // }
    // console.log(`Voted for proposal ${proposalId}`)
    // proposalState = await governor.state(proposalId)
    // console.log("Proposal status after vote: ", proposalState.toString())
}

export async function vote(
    proposalId: string,
    voteWay: number,
    reason: string,
) {
    console.log("Voting...")
    const governor = await ethers.getContract("GovernorContract")
    const voteTx = await governor.castVoteWithReason(
        proposalId,
        voteWay,
        reason,
    )
    const voteTxReceipt = await voteTx.wait(1)
    console.log(voteTxReceipt.events[0].args.reason)
    const proposalState = await governor.state(proposalId)
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
    console.log(`Current Proposal State: ${await governor.state(proposalId)}`)
}

main(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
