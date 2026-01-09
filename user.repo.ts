type User = {
  id: number
  email: string
  password: string
}

const users: User[] = []

export const userRepo = {
  create(data: Omit<User, "id">): User {
    const user = {
      id: Date.now(),
      ...data
    }

    users.push(user)
    return user
  },

  findByEmail(email: string): User | undefined {
    return users.find(u => u.email === email)
  }
}
