import { User } from "@/types/users";

const USERS_KEY = "sisu.users";

export const userRepositoty = {

  find(email: string): User | undefined {
    return this.getAll().find((user) => user.email === email);
  },

  save(user: User) {
    const users = this.getAll()

    users.push(user)

    window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },

  getAll(): User[] {
    const raw = window.localStorage.getItem(USERS_KEY)

    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)

    return Array.isArray(parsed) ? parsed : []
  }

}