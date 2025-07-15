/**
 * Type definitions for the chatbot quotation system
 */

export interface QuestionOption {
  letra: string
  text: string
  value: string | number
  area?: number
  action?: string
  data?: any
}

export interface ChatMessage {
  sender: "user" | "bot"
  text: string
  options?: QuestionOption[]
  timestamp: Date
  extraData?: any
}

export interface UserResponses {
  lote?: string
  habitacion_principal?: string
  habitaciones_adicionales?: number
  espacios_adicionales?: string[]
  [key: string]: any
}

export interface UserData {
  nombre: string
  telefono: string
  correo: string
}

export interface AreaBreakdown {
  baseAreas: { [key: string]: number }
  principalRoom: number
  additionalRooms: { [key: string]: number }
  extraSpaces: { [key: string]: number }
  total: number
}

export interface QuotationData {
  formato: string
  area_total: number
  cotizacionTexto: string
  areaBreakdown: AreaBreakdown
  economicProposalJSON: any // ADDED: Include the economic proposal JSON
  [key: string]: any
}

export interface ChatbotProps {
  onBack?: () => void
}
