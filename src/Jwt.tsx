import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { useAccount } from "wagmi";

import { publicClient, walletClient } from "./config";

import { wagmiAbi } from "../NFTMarketplace";
import { formatEther, formatGwei, parseEther, parseUnits } from "viem";

function Jwt() {
  const [price, setPrice] = useState("");
  const [tokenURI, setTokenURI] = useState("");

  const [publickey, setPublicKey] = useState("");
  const { address, isConnected } = useAccount();

  const { open } = useWeb3Modal();

  const login = async () => {
    if (address) {
      setPublicKey(address); // Set public key before making the request
    }

    axios
      .post("http://localhost:8000/login", {
        publickey: address,
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!isConnected) {
      open(); // Open the modal if not connected
    } else if (address) {
      login();

      console.log(publickey);
    }
  }, [isConnected, address]);

  const logout = () => {
    localStorage.removeItem("token");
  };

  const protectedRoute = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:8000/protected",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
      });
  };

  const createNFT = async () => {
    const priceInEther = parseEther("0.001");
    console.log(priceInEther);

    const { request } = await publicClient.simulateContract({
      address: "0xDf50E6a0B6d6731adc8a6c3Dfd049D18E8368671",
      abi: wagmiAbi,
      functionName: "createToken",
      account: publickey as `0x${string}`,
      args: [tokenURI, priceInEther],
      value: parseEther("0.0015"), //commision in eth
    });
    console.log(request);
    const hash = await walletClient.writeContract(request);
    console.log(hash);
  };

  const fetchTokenPrice = async () => {
    const items = await publicClient.readContract({
      address: "0xdf50e6a0b6d6731adc8a6c3dfd049d18e8368671",
      abi: wagmiAbi,
      functionName: "fetchItemsListed",
    });

    items.forEach((item) => {
      console.log(`Token ID: ${item.tokenId}, Price: ${item.price}`);
      console.log(
        `Token ID: ${item.tokenId}, Price: ${formatEther(item.price)}`
      );
    });
  };

  const buyNFT = async () => {
    const priceInEther = parseEther("0.001");

    console.log(priceInEther);

    const { request } = await publicClient.simulateContract({
      address: "0xdf50e6a0b6d6731adc8a6c3dfd049d18e8368671",
      abi: wagmiAbi,
      functionName: "createMarketSale",
      account: publickey as `0x${string}`,
      args: [BigInt(11)],
      value: priceInEther, ///1eth
    });
    console.log(request);
    const hash = await walletClient.writeContract(request);
    console.log(hash);
  };

  return (
    <>
      <div className="justify-center items-center grid gap-10 pt-10  ">
        <input
          type="text"
          placeholder="tokenURI"
          className=" pl-4 border-4 border-orange-800  outline-none text-xl rounded-2xl py-1"
          onChange={(e) => setTokenURI(e.target.value)}
        />
        <input
          type="text"
          placeholder="price"
          className="border-4 pl-2 border-orange-800   outline-none text-xl rounded-2xl py-1"
          onChange={(e) => setPrice(e.target.value)}
        />

        <button
          onClick={createNFT}
          className="border border-orange-800  bg-orange-900 text-neutral-100 text-3xl rounded-2xl py-2 font-semibold"
        >
          create nft
        </button>

        <button
          onClick={buyNFT}
          className="border border-orange-800  bg-orange-900 text-neutral-100 text-3xl rounded-2xl py-2 font-semibold"
        >
          buy nft
        </button>

        <button
          onClick={fetchTokenPrice}
          className="border border-orange-800  bg-orange-900 text-neutral-100 text-3xl rounded-2xl py-2 font-semibold"
        >
          fetch token price
        </button>

        <button
          onClick={logout}
          className="border border-orange-800  bg-orange-900 text-neutral-100 text-3xl rounded-2xl py-2 font-semibold"
        >
          Logout
        </button>
        <w3m-button />

        {/* <button
          onClick={protectedRoute}
          className="border border-orange-800  bg-orange-900 text-neutral-100 text-3xl"
        >
          Protected Route
        </button> */}

        <button
          onClick={() => open()}
          className="text-3xl bg-orange-900 rounded-2xl py-2 text-white font-semibold"
        >
          Open modal
        </button>
        {isConnected ? (
          <p className="text-3xl bg-blue-600 rounded-2xl py-2 text-white font-semibold text-center ">
            Connected
          </p>
        ) : (
          <p>Not connected</p>
        )}
      </div>
    </>
  );
}

export default Jwt;
