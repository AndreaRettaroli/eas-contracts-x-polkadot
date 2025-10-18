import { provider } from "./provider";
import { ethers } from "ethers";
import { config } from "./config";

export const signer = new ethers.Wallet(config.privateKey, provider);