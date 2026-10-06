import { Snail } from "./snail"

export interface Race {
  id: string
  name: string
  snails: Snail[]
  winner: string
}