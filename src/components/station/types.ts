export interface Game {
  id: number
  title: string
  image?: string
  category: string
  playtime: number
  lastPlayed?: string
  isInstalled: boolean
  progress?: number
}

export interface User {
  name: string
  email: string
  avatar?: string
  level: number
  totalPlaytime: number
  gamesPlayed: number
  achievements: number
}

export type Platform = "pc" | "ps5"
export type ActiveTab = "games" | "timepacks" | "coins" | "arcade" | "apps" | "food"
