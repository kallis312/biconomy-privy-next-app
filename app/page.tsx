'use client'
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { createSmartAccountClient, LightSigner, BiconomySmartAccountV2 } from "@biconomy/account";


export default function Home() {
  const { ready, authenticated, login, user } = usePrivy();
  // const { wallets } = useWallets();
  // const [smartWallet, setSmartWallet] = useState<BiconomySmartAccountV2>()

  useEffect(() => {
    if (user)
      console.log('user', user)
  }, [user])

  // useEffect(() => {
  //   getSmartWallet()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [wallets, ready, authenticated])

  // const getSmartWallet = async () => {
  //   if (smartWallet) return;
  //   const embeddedWallet = wallets.find((wallet) => (wallet.walletClientType === 'privy'))
  //   if (embeddedWallet) {
  //     await embeddedWallet.switchChain(80002);
  //     const provider = await embeddedWallet.getEthersProvider();
  //     const signer = provider.getSigner();
  //     const smartAccount = await createSmartAccountClient({
  //       signer: signer as LightSigner,
  //       chainId: 80002,
  //       bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_API_KEY ?? '', // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
  //       biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL ?? '', // <-- Read about at https://docs.biconomy.io/dashboard/paymaster
  //     });
  //     setSmartWallet(smartAccount)
  //   }
  // }

  // console.log('smartWallet', smartWallet)
  return (
    <main className="container">
      <button
        onClick={login}>
        Login
      </button>
    </main>
  );
}
