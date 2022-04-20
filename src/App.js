import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Lottery from './artifacts/contracts/Lottery.sol/Lottery.json';

const CA = process.env.REACT_APP_CA;

const App = () => {
  const [enter, setEnter] = useState();
  const [players, setPlayers] = useState();
  const [manager, setManager] = useState();

  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  };

  const fetchPlayers = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CA, Lottery.abi, provider);

      try {
        const data = await contract.listPayers();
        setPlayers(data);
      } catch (err) {
        console.log('Error', err);
      }
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const enterLottery = async () => {
    if (!enter) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CA, Lottery.abi, signer);
      contract.transfer();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Number of Players in lottery: {players?.length}</p>
        <form>
          <h4>Want to try your luck?</h4>
          <label>Send above 0.1 ETH to join Lottery</label>
          <br />
          <input type="number" />
          <button> Send </button>
        </form>
      </header>
    </div>
  );
};

export default App;
