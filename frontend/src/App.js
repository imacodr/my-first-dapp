import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

import Greeter from "./Greeter.json";

const CONTRACT_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

function App() {
  const [fieldValue, setFieldValue] = useState("");
  const [greeting, setGreeting] = useState("");
  const [address, setAddress] = useState("");

  const contract = useMemo(() => {
    if (!window.ethereum) {
      alert("Metamask not installed");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    return new ethers.Contract(CONTRACT_ADDRESS, Greeter.abi, signer);
  }, []);

  const getGreeting = async () => {
    if (!contract) {
      return;
    }

    const greeting = await contract.greet();

    setGreeting(greeting);
  };

  const submitGreeting = async () => {
    if (!contract) {
      return;
    }

    const transaction = await contract.setGreeting(fieldValue);

    await transaction.wait();

    await getGreeting();

    setFieldValue("");
  };

  useEffect(() => {
    getGreeting();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Metamask not installed");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAddress(accounts[0]);
  };

  if (!contract) {
    return null;
  }

  return (
    <div>
      <div>
        <h1>Your address:</h1>
        {address ? (
          <p>{address}</p>
        ) : (
          <button onClick={connectWallet}>Connect wallet</button>
        )}
      </div>
      <div>
        <h1>Contract</h1>
        <p>{contract.address}</p>
      </div>
      <div>
        <h1>The current Greeting is:</h1>
        <p>{greeting}</p>
      </div>
      <div>
        <h1>Change the greeting to:</h1>
        <input
          type="text"
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
        />
        <button disabled={!address} onClick={submitGreeting}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default App;
