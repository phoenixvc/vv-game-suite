"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface WalletContextType {
  walletConnected: boolean
  setWalletConnected: React.Dispatch<React.SetStateAction<boolean>>
  walletBalance: number
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>
  walletType: string
  setWalletType: React.Dispatch<React.SetStateAction<string>>
}

const defaultWalletState = {
  walletConnected: false,
  walletBalance: 0,
  walletType: "ETH", // Default to Ethereum
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletConnected, setWalletConnected] = useState(defaultWalletState.walletConnected)
  const [walletBalance, setWalletBalance] = useState(defaultWalletState.walletBalance)
  const [walletType, setWalletType] = useState(defaultWalletState.walletType)

  return (
    <WalletContext.Provider value={{ walletConnected, setWalletConnected, walletBalance, setWalletBalance, walletType, setWalletType }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWalletContext() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider")
  }
  return context
}
