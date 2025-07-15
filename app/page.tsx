"use client"

import { useState } from "react"
import EnhancedChatbotCotizacion from "@/components/enhanced-chatbot-cotizacion"

export default function Home() {
  const [showChatbot, setShowChatbot] = useState(true)

  if (showChatbot) {
    return <EnhancedChatbotCotizacion onBack={() => setShowChatbot(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">SAAVE Arquitectos</h1>
        <p className="text-gray-600 mb-6">Sistema de cotización inteligente mejorado</p>
        <button
          onClick={() => setShowChatbot(true)}
          className="w-full bg-black text-white py-3 px-6 rounded-full hover:bg-gray-800 transition-colors font-medium"
        >
          Iniciar Cotización
        </button>
      </div>
    </div>
  )
}
