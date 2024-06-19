import React, { useState } from "react";
import Web3 from "web3";
import AdditionABI from "./Addition.json"; // Ensure this path is correct

const Addition = () => {
  const [account, setAccount] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);

        const contractAddress = "0x4d1A6a6a1B3E32d90075d1eb0C75fbFeb2d35a9f"; // Update with your contract address
        const contractInstance = new web3Instance.eth.Contract(
          AdditionABI.abi,
          contractAddress
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("User denied account access or error occurred:", error);
      }
    } else {
      console.error(
        "No Ethereum browser extension detected. Install MetaMask!"
      );
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
          if (resultFromContract) {
            setResult(resultFromContract);
            setError(""); // Clear any previous error
          } else {
            setError("Addition is invalid");
            setResult(null);
          }
        } catch (error) {
          console.error("Error in transaction or fetching result:", error);
          setError("Error in transaction or fetching result");
          setResult(null);
        }
      } else {
        setError("Inputs must be valid numbers.");
        setResult(null);
      }
    } else {
      setError("Please enter valid numbers and connect your wallet.");
      setResult(null);
    }
  };

  const reset = () => {
    setA("");
    setB("");
    setResult(null);
    setError("");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Addition DApp</h1>
      {!account ? (
        <button onClick={connectWallet} className="btn">
          Connect Wallet
        </button>
      ) : (
        <>
          {result === null && error === "" ? (
            <div>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="Enter first number"
                className="form-input"
              />
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="Enter second number"
                className="form-input"
              />
              <button onClick={handleAdd} className="btn">
                Add
              </button>
            </div>
          ) : (
            <div>
              {result !== null ? <h2>Result: {result}</h2> : <h2>{error}</h2>}
              <button onClick={reset} className="btn">
                Back
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Addition;
