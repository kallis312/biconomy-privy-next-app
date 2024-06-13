"use client"
import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { encodeFunctionData, parseAbi, parseEther, ParseAbi, erc20Abi, createPublicClient, http, getContract } from "viem";
import { createSmartAccountClient, LightSigner, BiconomySmartAccountV2, PaymasterMode, IBundler, Bundler, IPaymaster, BiconomyPaymaster } from "@biconomy/account";
import { ethers } from "ethers";
import { mainnet, sepolia } from "viem/chains";


export default function Home() {
  const { ready, authenticated, login, user, logout } = usePrivy();
  const { wallets } = useWallets();
  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [chainSelected, setChainSelected] = useState<number>(0);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(
    null
  );
  // console.log('smartWallet', smartWallet)
  const chains = [
    {
      chainId: 11155111,
      name: "Ethereum Sepolia",
      providerUrl: "https://eth-sepolia.public.blastapi.io",
      incrementCountContractAdd: "0xd9ea570eF1378D7B52887cE0342721E164062f5f",
      biconomyPaymasterApiKey: "0_DGkTozX.ad732550-8cb8-4eb1-8528-a1504820cdc2",
      explorerUrl: "https://sepolia.etherscan.io/tx/",
    },
    {
      chainId: 80002,
      name: "Polygon Amoy",
      providerUrl: "https://rpc-amoy.polygon.technology/",
      incrementCountContractAdd: "0xfeec89eC2afD503FF359487967D02285f7DaA9aD",
      biconomyPaymasterApiKey: "TVDdBH-yz.5040805f-d795-4078-9fd1-b668b8817642",
      explorerUrl: "https://www.oklink.com/amoy/tx/",
    },
  ];

  const connect = async () => {
    try {
      login();
      const wallet = wallets.find((wallet) => (wallet.walletClientType === 'privy')) as ConnectedWallet;
      await wallet.switchChain(chains[chainSelected].chainId);
      const provider = await wallet.getEthersProvider();
      const signer = provider.getSigner();

      const config = {
        biconomyPaymasterApiKey: chains[chainSelected].biconomyPaymasterApiKey,
        bundlerUrl: `https://bundler.biconomy.io/api/v2/${chains[chainSelected].chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
      };

      const smartWallet = await createSmartAccountClient({
        signer: signer,
        biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
        bundlerUrl: config.bundlerUrl,
        // rpcUrl: chains[chainSelected].providerUrl,
        chainId: chains[chainSelected].chainId,
      });

      console.log("Biconomy Smart Account", smartWallet);
      setSmartAccount(smartWallet);
      const saAddress = await smartWallet.getAccountAddress();
      console.log("Smart Account Address", saAddress);
      setSmartAccountAddress(saAddress);
    } catch (error) {
      console.error(error);
    }
  };

  const sendTransaction = async () => {
    if (smartAccount) {
      // const erc20Abi = parseAbi([
      //   "function transfer(address to, uint256 value)"
      // ])

      // const transactionData = encodeFunctionData({
      //   abi: erc20Abi,
      //   functionName: 'transfer',
      //   args: [
      //     "0x1C1247c342eA324b26178086c7464AC6ab03672d",
      //     parseEther('0.001')
      //   ]
      // })
      // const client = createPublicClient({
      //   transport: http(chains[chainSelected].providerUrl),
      //   chain: sepolia
      // })

      // const contract = getContract({
      //   abi: erc20Abi,
      //   address: '0x344B37Cb81431d530d1B2ea9af695f64b2A87781',
      //   client,
      // })

      // const transactionData = await contract.write.transfer(['0x1C1247c342eA324b26178086c7464AC6ab03672d', parseEther('0.001')], {
      //   account: await smartAccount.getAccountAddress()
      // })
      // console.log('transactionData', transactionData)
      // const provider = new ethers.JsonRpcProvider(
      //   chains[chainSelected].providerUrl
      // );
      // const contractInstance = new ethers.Contract(
      //   '0x344B37Cb81431d530d1B2ea9af695f64b2A87781',
      //   erc20Abi,
      //   provider
      // );
      // const minTx = await contractInstance.
      const abi = parseAbi([
        "function transfer(address to, uint256 value)"
      ])

      const transactionData = encodeFunctionData({
        abi: abi,
        functionName: 'transfer',
        args: [
          "0x1C1247c342eA324b26178086c7464AC6ab03672d",
          parseEther('0.001')
        ]
      })
      const tx = {
        to: "0x8267cF9254734C6Eb452a7bb9AAF97B392258b21",
        data: transactionData
      }

      const userOpResponse = await smartAccount.sendTransaction(tx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      })

      const { transactionHash } = await userOpResponse.waitForTxHash();
      console.log("Transaction Hash", transactionHash);

      const userOpReceipt = await userOpResponse.wait();
      if (userOpReceipt.success == "true") {
        console.log("UserOp receipt", userOpReceipt);
        console.log("Transaction receipt", userOpReceipt.receipt);
      }
      console.log('transactionData', transactionData)
    }
  }

  const getBalance = async () => {
    if (smartAccount) {
      const balance = await smartAccount.getBalances();
      console.log("Balance", balance);
    }
  }
  return (
    <main className="container">
      <div className="flex gap-2 items-center">
        <button
          className="border px-8 py-2 rounded-md"
          onClick={connect}>
          Login
        </button>
        <button
          className="border px-8 py-2 rounded-md"
          onClick={logout}>
          Logout
        </button>
        <button
          className="border px-8 py-2 rounded-md"
          onClick={() => {
            sendTransaction()
            // getSmartWallet('1C1247c342eA324b26178086c7464AC6ab03672d', '0.001')
          }}
        >
          Send
        </button>
        <button
          className="border px-8 py-2 rounded-md"
          onClick={() => {
            getBalance()
            // getSmartWallet('1C1247c342eA324b26178086c7464AC6ab03672d', '0.001')
          }}
        >
          balance
        </button>
        {smartAccountAddress}
      </div>
    </main>
  );
}
