import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import React, { useMemo, useState } from "react";

function Balances() {
  // React States
  const [solBal, setSolBal] = useState(0);
  const [usdBal, setUsdBal] = useState(0);

  // solana web3 connection
  const { connection } = useConnection();
  const { disconnect, publicKey } = useWallet();

  useMemo(() => {
    if (publicKey) {
      // Get Dollar to Crypto
      let solUsd = 0;
      let usdUSd = 0;
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd&include_last_updated_at=false"
      ).then((res) =>
        res.json().then((data) => {
          usdUSd = data["usd-coin"].usd;
        })
      );

      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_last_updated_at=false"
      ).then((res) =>
        res.json().then((data) => {
          solUsd = data.solana.usd;
        })
      );
      // get usd balance
      connection
        .getParsedTokenAccountsByOwner(publicKey, {
          // this new public key refers to USD coin address on solana-devnet.
          // Please change it to mainnet's address before pushing to production.
          mint: new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"),
        })
        .then((res) => {
          if (res.value.length > 0) {
            setUsdBal(
              (
                res.value[0].account.data.parsed.info.tokenAmount.uiAmount *
                usdUSd
              ).toFixed(2)
            );
          }
        });

      // get solana balance
      connection
        .getBalance(publicKey)
        .then((res) =>
          setSolBal(((res / LAMPORTS_PER_SOL) * solUsd).toFixed(2))
        );
    }
  }, [publicKey]);

  return (
    <div>
      <p>
        Address: {publicKey ? publicKey.toString() : "Please connect wallet"}
      </p>
      <p> Solana Balance : {solBal}</p>
      <p> USD Balance : {usdBal}</p>
    </div>
  );
}

export default Balances;
