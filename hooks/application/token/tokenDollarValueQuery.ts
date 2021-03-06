import { TokenInfo } from '@/hooks/application/chain-pool/usePoolsListQuery'

import { fetchDollarPriceByTokenIds } from '@/hooks/application/token/fetchDollarPriceByTokenIds'

export async function tokenDollarValueQuery(tokenIds: Array<TokenInfo['id']>) {
  if (!tokenIds?.length) {
    throw new Error('Provide token ids in order to query their price')
  }

  try {
    const prices = await fetchDollarPriceByTokenIds(tokenIds)
    return tokenIds.map((id): number => prices[id]?.usd || 0)
  } catch (e) {
    console.log(e)
    throw e
  }
}
