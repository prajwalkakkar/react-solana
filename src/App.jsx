import Balances from "./Balances";
import WalletConnection from "./WalletConnection";
import WalletButton from "./WalletButton";

function App() {
  return (
    <div>
      <WalletConnection>
        <WalletButton />
        <Balances />
      </WalletConnection>
    </div>
  );
}

export default App;
