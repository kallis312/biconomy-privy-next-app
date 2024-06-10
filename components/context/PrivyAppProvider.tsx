"use client"

import { useRouter } from "next/navigation";

import { PrivyProvider } from '@privy-io/react-auth';
import { polygonAmoy } from "viem/chains";


export default function PrivyProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) throw new Error('Privy app id is undefined.')

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      onSuccess={() => router.push("/dashboard-b")}
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          noPromptOnSignature: true,

        },
        loginMethods: ["email", "google"],
        defaultChain: polygonAmoy,
        supportedChains: [
          polygonAmoy
        ]
      }}
    >
      {children}
    </PrivyProvider>
  )
}