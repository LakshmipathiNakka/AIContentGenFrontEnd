import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) return savedTheme

    // Then check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }
    return "light"
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    root.setAttribute("data-theme", theme)
    
    // Add transition class
    root.classList.add("theme-transition")
    
    // Remove transition class after animation completes
    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition")
    }, 300)
    
    return () => clearTimeout(timeout)
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = (e) => {
      const newTheme = e.matches ? "dark" : "light"
      setTheme(newTheme)
      localStorage.setItem("theme", newTheme)
    }
    
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme)
      localStorage.setItem("theme", newTheme)
      // Force immediate update of document classes
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(newTheme)
      document.documentElement.setAttribute("data-theme", newTheme)
    },
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
} 