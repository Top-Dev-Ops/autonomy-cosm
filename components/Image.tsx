import React, {
  CSSProperties,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useClick } from '@/hooks/general/useClick'

import { shakeUndefindedItem } from '@/functions/arrayMethods'
import mergeRef from '@/functions/react/mergeRef'
import { getFileNameOfURI } from '@/functions/dom/getFileNameOfURI'

/**
 * usually in the leading part of an list-item
 */

export interface ImageProps {
  /** can accept multi srcs */
  src: string | string[]
  fallbackSrc?: string
  alt?: string // for readability
  onClick?: () => void
  domRef?: RefObject<any>
  className?: string
  style?: CSSProperties
}

export default function Image({
  src,
  fallbackSrc,
  alt: alert,
  onClick,
  domRef,
  className,
  style,
}: ImageProps) {
  const ref = useRef<HTMLImageElement>(null)
  useClick(ref, { onClick })
  const srcSet = shakeUndefindedItem([src, fallbackSrc].flat())
  const srcFingerprint = srcSet.join(' ')
  const [currentUsedSrcIndex, setCurrentUsedSrcIndex] = useState(0)
  const currentSrc = srcSet[currentUsedSrcIndex]
  const alertText = alert ?? getFileNameOfURI(currentSrc ?? '')

  useEffect(() => {
    setCurrentUsedSrcIndex(0)
  }, [srcFingerprint])

  useEffect(() => {
    ref.current?.addEventListener('error', (ev) => {
      setCurrentUsedSrcIndex((n) => n + 1)
    })
  }, [])
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={mergeRef(domRef, ref)}
      className={`Image ${className ?? ''}`}
      src={srcSet[currentUsedSrcIndex]}
      alt={alertText}
      style={style}
    />
  )
}
