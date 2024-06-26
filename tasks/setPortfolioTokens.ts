import { Contract } from "ethers";
import { task, types } from "hardhat/config";
import { SET_TOKENS_PORTFOLIO } from "./task-names";
import { chainIdToAddresses } from "../scripts/networkVariables";

task(
  SET_TOKENS_PORTFOLIO,
  "Initiation of token and wight to Portfolio contract",
)
  .addParam("portfolio", "The portfolio's address")
  .addParam("tokens", "The tokens list address")
  .addParam("weight", "The  weight list address")
  .setAction(async (taskArgs): Promise<Contract> => {
    const hre = require("hardhat");
    const forkChainId: any = process.env.FORK_CHAINID;
    const { chainId } = await hre.ethers.provider.getNetwork();
    const addresses = chainIdToAddresses[forkChainId];
    const accounts = await hre.ethers.getSigners();
    console.log(
      "------------------------------ Initial Setup Ended ------------------------------",
    );

    console.log("--------------- Contract Deployment Started ---------------");

    const [owner] = accounts;
    // Access Controller
    // const VelvetSafeModule = hre.ethers.getContractFactory("VelvetSafeModule");
    // let velvetSafeModule = (await VelvetSafeModule).attach("0x4e91E38a0393FF2eD372Cb4E8638ae93aaD7844c");
    // await velvetSafeModule.transferModuleOwnership("0xc622bb6f014184369a15f61282c26C6baAee2515");

    // Portfolio
    const Portfolio = await hre.ethers.getContractFactory("Portfolio");
    let portfolio = (await Portfolio).attach(taskArgs.portfolio);
    console.log(taskArgs.tokens, " taskArgs.tokens");
    let tokens = [];
    tokens = taskArgs.tokens;

    let weight = [];

    weight = taskArgs.weight;
    console.log(tokens, "tokens");
    console.log(weight, "weight");

    await portfolio.init(tokens, weight);

    console.log(`Portfolio deployed to: ${portfolio.address}`);

    console.log(
      "------------------------------ Contract Deployment Ended ------------------------------",
    );

    return portfolio;
  });
