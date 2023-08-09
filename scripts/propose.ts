//@ts-ignore
import { ethers, network } from "hardhat"
import * as fs from "fs"
import {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
} from "../helper-hardhat-config"

import { moveBlocks } from "../utils/move-blocks"

export async function propose(
    args: any[],
    functionToCall: string,
    proposalDescription: string,
) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    const boxAddress = box.address
    const encodedFunctionCall = await box.interface.encodeFunctionData(
        functionToCall,
        args,
    )
    console.log("----------------------------------------------------")
    console.log("encodedFunctionCall", encodedFunctionCall)
    console.log(`Proposing ${functionToCall} on ${boxAddress} with ${args}`)
    console.log(`Proposal Description:\n  ${proposalDescription}`)
    const proposetx = await governor.propose(
        [boxAddress],
        [0],
        [encodedFunctionCall],
        proposalDescription,
    )
    const proposeReceipt = await proposetx.wait(1)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }

    const proposalId = proposeReceipt.events[0].args.proposalId
    const proposalState = await governor.state(proposalId)

    console.log(`Proposed with proposal ID:\n  ${proposalId}`)
    console.log("Proposal status: ", proposalState.toString())

    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals, null, 2))
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
