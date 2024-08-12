import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { useAccount } from "wagmi";

function Jwt() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [publickey, setPublicKey] = useState("");

  const { address, isConnected } = useAccount();

  const { open } = useWeb3Modal();

  const login = async () => {
    if (address) {
      setPublicKey(address); // Set public key before making the request
    }

    axios
      .post("http://localhost:8000/login", {
        username,
        password,
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

  return (
    <>
      <div className="justify-center items-center grid gap-10 pt-10 ">
        <input
          type="username"
          placeholder="username"
          className="border border-orange-800 pl-2 outline-none text-3xl"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="border pl-2 border-orange-800   outline-none text-3xl"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="border border-orange-800  bg-orange-900 text-neutral-100 text-3xl"
        >
          Login
        </button>

        <button
          onClick={logout}
          className="border border-orange-800  bg-orange-900 text-neutral-100 text-3xl"
        >
          Logout
        </button>

        <button
          onClick={protectedRoute}
          className="border border-orange-800  bg-orange-900 text-neutral-100 text-3xl"
        >
          Protected Route
        </button>
        {isConnected ? <p>Connected</p> : <p>Not connected</p>}

        <button onClick={() => open()}>Open modal</button>
      </div>
    </>
  );
}

export default Jwt;
