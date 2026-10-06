export interface User {
  id: string
  fullName: string
  email: string
  createdAt: string
}

export interface StoredUser extends User {
  passwordHash: string
}