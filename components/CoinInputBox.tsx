import {
  RefObject,
  useRef,
  useImperativeHandle,
  CSSProperties,
  ReactNode,
} from 'react'
import {
  Row,
  CoinAvatar,
  Icon,
  Button,
  Input,
  Badge,
  Image,
  ArrowDownIcon,
} from '@/components'
import { twMerge } from 'tailwind-merge'

import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { useTokenBalance } from '@/hooks/application/token/useTokenBalance'
import { useTokenInfo } from '@/hooks/application/token/useTokenInfo'

import { isString } from '@/functions/judgers/dateType'
import { TokenInfo } from '@/hooks/application/chain-pool/usePoolsListQuery'

export interface CoinInputBoxHandle {
  focusInput?: () => void
  selectToken?: () => void
}

export interface CoinInputBoxProps {
  // basic
  className?: string
  style?: CSSProperties
  domRef?: RefObject<any>
  componentRef?: RefObject<any>
  // data
  symbol?: string | null
  amount?: number
  dollar?: number
  disabled?: boolean
  disabledInput?: boolean
  disabledTokenSelect?: boolean
  // customize appearance
  topLeftLabel?: ReactNode
  haveHalfButton?: boolean
  haveCoinIcon?: boolean
  onUserInput?(input: { tokenSymbol: string | null; amount: number }): void
  onEnter?(input: string | undefined): void
  onTryToTokenSelect?(): void
}

export default function CoinInputBox({
  className,
  style,
  domRef,
  componentRef,
  symbol,
  amount,
  dollar,
  disabled,
  disabledInput: innerDisabledInput,
  disabledTokenSelect: innerDisabledTokenSelect,
  topLeftLabel,

  onUserInput,
  onEnter,
  onTryToTokenSelect,
}: CoinInputBoxProps) {
  const { themeMode } = useAppSettings()

  const disabledInput = disabled || innerDisabledInput
  const disabledTokenSelect = disabled || innerDisabledTokenSelect

  const isOutsideValueLocked = useRef(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const focusInput = () => null

  const { balance } = useTokenBalance(symbol ?? '')

  useImperativeHandle(
    componentRef,
    () =>
      ({
        focusInput: () => focusInput(),
        selectToken: () => onTryToTokenSelect?.(),
      } as CoinInputBoxHandle)
  )

  const handleAmount = (val: string) =>
    onUserInput?.({ tokenSymbol: symbol ?? '', amount: +val })

  const { logoURI } = useTokenInfo(symbol ?? '') || {}

  return (
    <Row
      domRef={domRef}
      className={twMerge(
        `flex bg-stack-3 cursor-text rounded-xl py-3 px-3 mobile:px-4`,
        className
      )}
      style={style}
      htmlProps={{ tabIndex: 0 }}
      onClick={({ target }) => {
        const isClickSelf = target === domRef?.current
        if (isClickSelf) focusInput()
      }}
    >
      <Row className="flex-col flex-1 pr-3">
        {/* swap */}
        <Row className="justify-between mb-2 mobile:mb-4 px-2">
          <div className="text-xs font-bold mobile:text-sm text-primary flex-1">
            {topLeftLabel}
          </div>
        </Row>

        {/* coin selector - coin avatar, symbol & chevron down */}
        <Row
          className="items-center gap-1.5 bg-stack-4 p-2 mb-2 mobile:mb-4 rounded-xl border-stack-4 border-2 clickable clickable-mask-offset-2"
          onClick={(ev) => {
            ev.stopPropagation()
            ev.preventDefault()
            if (disabledTokenSelect) return
            onTryToTokenSelect?.()
          }}
        >
          <CoinAvatar size="lg" src={logoURI} />
          <div className="text-primary font-extrabold text-base flex-grow mobile:text-sm whitespace-nowrap">
            {symbol ?? '--'}
          </div>
          <ArrowDownIcon
            color={themeMode === 'light' ? '#4d4040' : '#ffffff'}
          />
        </Row>

        {/* balance & price */}
        <Row className="justify-between mb-2 mobile:mb-4 px-2">
          <div
            className={`text-xs mobile:text-sm font-medium text-primary ${
              disabledInput
                ? ''
                : 'clickable no-clickable-transform-effect clickable-filter-effect'
            }`}
            onClick={() => {
              if (disabled) return
            }}
          >
            Balance: {balance}
          </div>
          <div className="text-xs mobile:text-sm font-medium justify-self-end text-primary">
            ${dollar ?? 0}
          </div>
        </Row>
      </Row>

      <Row className="flex-col flex-1 pl-3">
        {/* amount */}
        <Row className="mb-2 mobile:mb-4 items-center px-2">
          <div className="text-xs font-bold mobile:text-sm text-primary mr-4">
            Total:
          </div>
        </Row>

        {/* input */}
        <Row
          className={`items-center justify-between gap-1.5 ${
            disabledInput
              ? 'bg-transparent border-stack-4 border-2 cursor-not-allowed'
              : 'bg-stack-4 border-transparent border-2'
          } py-2 px-8 mb-2 mobile:mb-4 rounded-xl`}
          onClick={(ev) => {
            ev.stopPropagation()
            ev.preventDefault()
            if (disabledTokenSelect) return
          }}
        >
          <Input
            className="font-extrabold text-lg text-primary flex-grow"
            disabled={disabledInput}
            type="number"
            componentRef={inputRef}
            value={
              `${amount}`.length > 7 ? `${amount?.toFixed(7)}` : `${amount}`
            }
            onUserInput={handleAmount}
            onEnter={onEnter}
            inputClassName={`text-left mobile:text-sm font-bold ${
              disabledInput ? 'opacity-50' : ''
            }`}
            inputHTMLProps={{
              onFocus: () => (isOutsideValueLocked.current = true),
              onBlur: () => (isOutsideValueLocked.current = false),
            }}
          />

          <Row className="px-2">
            <div className="text-primary opacity-50 text-xs mobile:text-sm font-medium">
              {symbol}
            </div>
          </Row>
        </Row>

        <Row className="justify-between mb-2 mobile:mb-4 px-2 invisible">
          <div
            className={`text-xs mobile:text-sm font-medium text-primary ${
              disabledInput
                ? ''
                : 'clickable no-clicable-transform-effect clickable-filter-effect'
            }`}
            onClick={() => {
              if (disabled) return
            }}
          >
            Balance: {amount}
          </div>
          <div className="text-xs mobile:text-sm font-medium justify-self-end text-primary">
            -$2.37
          </div>
        </Row>
      </Row>
    </Row>
  )
}
