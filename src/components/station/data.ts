import { Library, Clock, Coins, Award, AppWindow, Utensils } from "lucide-react"

export const gameData = {
  pc: [
    { id: 1, title: "Cyberpunk 2077", category: "Game", playtime: 234, lastPlayed: "2 hours ago", isInstalled: true, progress: 65 },
    { id: 2, title: "Valorant", category: "Game", playtime: 456, lastPlayed: "Yesterday", isInstalled: true, progress: 0 },
    { id: 3, title: "League of Legends", category: "Game", playtime: 789, lastPlayed: "3 days ago", isInstalled: true, progress: 0 },
    { id: 4, title: "Steam", category: "Launcher", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 5, title: "Discord", category: "Tool", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
    { id: 6, title: "Chrome", category: "Browser", playtime: 0, lastPlayed: "Always", isInstalled: true, progress: 0 },
  ],
  ps5: [
    { id: 1, title: "Spider-Man 2", category: "Action", playtime: 134, lastPlayed: "1 hour ago", isInstalled: true, progress: 75 },
    { id: 2, title: "God of War Ragnarök", category: "Action RPG", playtime: 256, lastPlayed: "Yesterday", isInstalled: true, progress: 45 },
    { id: 3, title: "Horizon Forbidden West", category: "Action RPG", playtime: 189, lastPlayed: "2 days ago", isInstalled: true, progress: 60 },
    { id: 4, title: "The Last of Us Part II", category: "Action", playtime: 223, lastPlayed: "1 week ago", isInstalled: true, progress: 100 },
    { id: 5, title: "Ratchet & Clank", category: "Platformer", playtime: 145, lastPlayed: "3 days ago", isInstalled: true, progress: 85 },
  ]
}

export const navItems = [
  { id: "games" as const, label: "Games", icon: Library },
  { id: "timepacks" as const, label: "Time Packs", icon: Clock },
  { id: "coins" as const, label: "Coins", icon: Coins },
  { id: "arcade" as const, label: "Arcade", icon: Award },
  { id: "apps" as const, label: "Apps", icon: AppWindow },
  { id: "food" as const, label: "Food", icon: Utensils },
]

export const timePacks = [
  { id: 1, duration: 30, price: 50, label: "30 Minutes" },
  { id: 2, duration: 60, price: 90, label: "1 Hour" },
  { id: 3, duration: 120, price: 160, label: "2 Hours" },
  { id: 4, duration: 180, price: 220, label: "3 Hours" },
  { id: 5, duration: 300, price: 350, label: "5 Hours" },
  { id: 6, duration: 480, price: 500, label: "8 Hours" },
]

export const coinPacks = [
  { id: 1, amount: 100, price: "₹50", label: "100 Coins" },
  { id: 2, amount: 250, price: "₹100", label: "250 Coins" },
  { id: 3, amount: 600, price: "₹200", label: "600 Coins" },
  { id: 4, amount: 1500, price: "₹450", label: "1500 Coins" },
]
