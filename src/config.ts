import { createWalletClient, custom, http, createPublicClient } from "viem";
import { polygonAmoy } from "viem/chains";

declare let window: any;

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: polygonAmoy,
  transport: custom(window.ethereum),
});
