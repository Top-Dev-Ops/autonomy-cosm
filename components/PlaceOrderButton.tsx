import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, CautionIcon } from '@/components'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useConnectWallet } from '@/hooks/application/wallet/useConnectWallet'
import { useTokenBalance } from '@/hooks/application/token/useTokenBalance'
import {
  walletState,
  WalletStatusType,
} from '@/hooks/application/atoms/walletAtoms'
import { NETWORK_FEE } from '@/util/constants'

import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { useRegistry } from '@/hooks/application/swap/useRegistry'
import { useTokenSwap } from '@/hooks/application/swap/useTokenSwap'
import {
  slippageAtom,
  tokenSwapAtom,
} from '@/hooks/application/atoms/swapAtoms'

export interface PriceOrderButtonProps {
  isPriceLoading: boolean
  price: number
  rate: number
  currentPrice: number
}

export default function PriceOrderButton({
  isPriceLoading,
  price,
  rate,
  currentPrice,
}: PriceOrderButtonProps) {
  const { pathname } = useRouter()
  const [requestedSwap, setRequestedSwap] = useState(false)
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)
  const { balance: tokenABalance } = useTokenBalance(tokenA?.tokenSymbol ?? '')
  // wallet state
  const { status } = useRecoilValue(walletState)
  const { mutate: connectWallet } = useConnectWallet()
  const [slippage, setSlippage] = useRecoilState(slippageAtom)

  const { themeMode } = useAppSettings()

  const { mutate: handleSwap, isLoading: isExecutingTransaction } =
    useTokenSwap({
      tokenASymbol: tokenA?.tokenSymbol ?? '',
      tokenBSymbol: tokenB?.tokenSymbol ?? '',
      tokenAmount: tokenA?.amount,
      tokenToTokenPrice: price || 0,
    })

  const { mutate: handleRegistry, isLoading: isExecutingRegistryTransaction } =
    useRegistry({
      tokenASymbol: tokenA?.tokenSymbol ?? '',
      tokenBSymbol: tokenB?.tokenSymbol ?? '',
      tokenAmount: tokenA?.amount,
      tokenToTokenPrice: price || 0,
      type: pathname.replace('/', ''),
    })

  useEffect(() => {
    const shouldTriggerTransaction =
      !isPriceLoading &&
      !isExecutingTransaction &&
      !isExecutingRegistryTransaction &&
      requestedSwap
    if (shouldTriggerTransaction) {
      if (['/limit-order', '/stop-loss'].includes(pathname)) {
        handleRegistry()
        setRequestedSwap(false)
      } else {
        handleSwap()
        setRequestedSwap(false)
      }
    }
  }, [
    isPriceLoading,
    isExecutingTransaction,
    requestedSwap,
    handleSwap,
    isExecutingRegistryTransaction,
    handleRegistry,
    pathname,
  ])

  const handleButtonClick = () => {
    if (status === WalletStatusType.connected) {
      return setRequestedSwap(true)
    }

    connectWallet(null)
  }

  const shouldDisableSubmissionButton =
    isExecutingTransaction ||
    isExecutingRegistryTransaction ||
    !tokenB.tokenSymbol ||
    !tokenA.tokenSymbol ||
    status !== WalletStatusType.connected ||
    tokenA.amount <= 0 ||
    tokenA?.amount > tokenABalance ||
    (pathname === '/limit-order'
      ? currentPrice <= rate
      : pathname === '/stop-loss'
      ? currentPrice >= rate
      : false)

  const shouldDisplayerCautionButton =
    !isExecutingTransaction &&
    !isExecutingRegistryTransaction &&
    status === WalletStatusType.connected &&
    tokenA?.amount > tokenABalance

  return (
    <div className="flex flex-col">
      {shouldDisplayerCautionButton && (
        <div className="w-full bg-red-700 px-4 py-2 mb-4 flex flex-row justify-center rounded-lg font-semibold text-primary">
          <div className="mr-2">
            <CautionIcon
              size="lg"
              color={themeMode === 'light' ? '#4d4040' : '#fff'}
            />
          </div>
          INSUFFICIENT BALANCE
        </div>
      )}
      <Button
        className="px-20"
        disabled={shouldDisableSubmissionButton}
        onClick={
          !isExecutingTransaction &&
          !isExecutingRegistryTransaction &&
          !isPriceLoading
            ? handleButtonClick
            : undefined
        }
      >
        {pathname === '/' ? 'SWAP' : 'PLACE ORDER'}
      </Button>
    </div>
  )
}
