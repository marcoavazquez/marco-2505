const DEPOSIT_KEY = "snail.deposit"

export const depositRepository = {
  saveDeposit(email: string, amount: number, cvv: string, cardNumber: string) {

    const existingDeposits = this.getAllDeposits(email)

    const depositData = {
      userEmail: email,
      amount: amount,
      cvv: cvv,
      cardNumber: cardNumber
    }

    existingDeposits.push(depositData)
    window.localStorage.setItem(`${DEPOSIT_KEY}.${email}`, JSON.stringify(existingDeposits))
  },

  getAllDeposits(email: string) {
    const raw = window.localStorage.getItem(`${DEPOSIT_KEY}.${email}`)

    if (!raw) return []

    try {
      const parsed: unknown = JSON.parse(raw)

      return parsed as Array<{
        userEmail: string
        amount: number
        cvv: string
        cardNumber: string
      }>
    } catch {
      return []
    }
  }
}