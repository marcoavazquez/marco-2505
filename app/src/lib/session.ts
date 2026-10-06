import { User } from "@/types/user";

export const SESSION_KEY = "snail.auth.session";

export const authSession = {

  get(): User | null {
    const raw = window.localStorage.getItem(SESSION_KEY)

    if (!raw) return null

    try {
      const parsed: unknown = JSON.parse(raw)

      return parsed as User
    } catch {
      return null
    }
  },

  save(user: User) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  },

  clear() {
    window.localStorage.removeItem(SESSION_KEY)
  }

}