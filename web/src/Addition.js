import React, { useState, useEffect } from "react";
import Web3 from "web3";
import AdditionABI from "./Addition.json"; // Ensure this path is correct

const Addition = () => {
  const [account, setAccount] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const contractAddress = "0x4d1A6a6a1B3E32d90075d1eb0C75fbFeb2d35a9f";
          const contractInstance = new web3Instance.eth.Contract(
            AdditionABI.abi,
            contractAddress
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("User denied account access", error);
        }
      } else {
        console.error(
          "No Ethereum browser extension detected. Install MetaMask!"
        );
      }
    };

    initWeb3();
  }, []);

  const connectWallet = async () => {
    if (web3) {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
    }
  };

  const handleAdd = async () => {
    if (contract && account && a !== "" && b !== "") {
      const valueA = parseInt(a, 10);
      const valueB = parseInt(b, 10);

      if (!isNaN(valueA) && !isNaN(valueB)) {
        try {
          await contract.methods.add(valueA, valueB).send({ from: account });
          const resultFromContract = await contract.methods.result().call();
          console.log(resultFromContract);
          setResult(resultFromContract);
          console.log(resultFromContract);
        } catch (error) {
          console.error("Error in transaction or fetching result:", error);
        }
      } else {
        console.error("Inputs must be valid numbers.");
      }
    } else {
      console.error("Please enter valid numbers.");
    }
  };

  return (
    <div>
      <h1>Addition DApp</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <div>
        <input
          type="number"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Enter first number"
        />
        <input
          type="number"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Enter second number"
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {result !== null && result !== " " && <h2>Result: {result}</h2>}
      {!result && <h2>Result found</h2>}
    </div>
  );
};

export default Addition;
