import { Balance } from "@/types/balance";

const BALANCE_KEY = "snail.balance";

export const userBalanceRepository = {
  getBalance(email: string): Balance {
    const raw = window.localStorage.getItem(BALANCE_KEY + "." + email)

    if (!raw) return {
      userEmail: email,
      amount: 0,
    }

    try {
      const parsed: unknown = JSON.parse(raw)

      return parsed as Balance
    } catch {
      return {
        userEmail: email,
        amount: 0,
      }
    }
  },

  createBalance(email: string) {
    window.localStorage.setItem(BALANCE_KEY + "." + email, JSON.stringify({
      userEmail: email,
      amount: 0,
    }))
  },

  deposit(email: string, amount: number) {
    const balance = this.getBalance(email)
    balance.amount += amount

    window.localStorage.setItem(BALANCE_KEY + "." + email, JSON.stringify(balance))
  },

  withdraw(email: string, amount: number) {
    const balance = this.getBalance(email)
    balance.amount -= amount

    window.localStorage.setItem(BALANCE_KEY + "." + email, JSON.stringify(balance))
  },
}