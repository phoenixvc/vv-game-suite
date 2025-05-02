"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

/**
 * WalletContextType interface defines the structure of the wallet context.
 * It includes the wallet connection status, balance, and type, along with their respective state setters.
 */
interface WalletContextType {
  walletConnected: boolean
  setWalletConnected: React.Dispatch<React.SetStateAction<boolean>>
  walletBalance: number
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>
  walletType: string
  setWalletType: React.Dispatch<React.SetStateAction<string>>
}

/**
 * Default wallet state values.
 */
const defaultWalletState = {
  walletConnected: false,
  walletBalance: 0,
  walletType: "ETH", // Default to Ethereum
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

/**
 * WalletProvider component provides the wallet context to its children.
 * It manages the wallet connection status, balance, and type using React state.
 * @param children - The child components that will have access to the wallet context.
 */
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

/**
 * Custom hook to use the WalletContext.
 * Throws an error if used outside of a WalletProvider.
 * @returns The wallet context value.
 */
export function useWalletContext() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider")
  }
  return context
}
