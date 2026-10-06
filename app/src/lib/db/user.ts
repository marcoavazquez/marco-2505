import { User } from "@/types/user";

export const USERS_KEY = "snail.users";

export const userRepositoty = {

  find<T extends User>(email: string): T | undefined {
    return this.getAll<T>().find((user) => user.email === email);
  },

  save<T extends User>(user: T) {
    const users = this.getAll<T>()

    users.push(user)

    window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },

  getAll<T extends User>(): T[] {
    const raw = window.localStorage.getItem(USERS_KEY)

    if (!raw) return []

    try {
      const parsed: unknown = JSON.parse(raw)

      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
}