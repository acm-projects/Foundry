"use client"

import { useEffect, useState } from "react"
import { Cloud } from "lucide-react"

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex justify-center px-4 sm:px-6 transition-all duration-200 ${
        scrolled ? "top-0 pt-1" : "top-2 pt-2"
      }`}
    >
      <div className="bg-white/30 backdrop-blur-md shadow-md rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between w-full max-w-5xl">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-600 shadow-sm">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <span className="text-orange-600 font-extrabold text-lg">Foundry</span>
        </div>
        <button className="px-4 py-1 rounded-xl border border-gray-300 text-orange-600 font-semibold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition">
          Login
        </button>
      </div>
    </header>
  )
}