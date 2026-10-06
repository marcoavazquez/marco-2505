import { userBalanceRepository } from "@/lib/db/balance"
import { Balance } from "@/types/balance"

export const balanceService = {
  getBalance(email: string): Balance {
    return userBalanceRepository.getBalance(email)
  },

  createBalance(email: string): void {
    userBalanceRepository.createBalance(email)
  },

  deposit(email: string, amount: number): void {
    userBalanceRepository.deposit(email, amount)
  },

  withdraw(email: string, amount: number): void {
    userBalanceRepository.withdraw(email, amount)
  }
}