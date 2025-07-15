/**
 * Pricing constants and configuration for the quotation system
 */

// Fixed values per square meter (corrected according to Excel)
export const PRICING_PER_M2 = {
  disenoArquitectonico: 65141, // $65,141/m²
  disenoEstructural: 33987, // $33,987/m²
  disenoElectrico: 28322, // $28,322/m²
  disenoHidraulico: 25490, // $25,490/m²
  presupuestoObra: 12745, // $12,745/m²
  acompanamiento: 14161, // $14,161/m²
} as const

// Fixed base areas for all projects
export const BASE_AREAS = {
  cocina: 11.5,
  sala: 13.5,
  comedor: 18,
  ropas: 8,
  bano_social: 2.5,
} as const

// Payment structure percentages
export const PAYMENT_STRUCTURE = {
  firstPayment: 0.4, // 40%
  secondPayment: 0.5, // 50%
  thirdPayment: 0.1, // 10%
  earlyPaymentDiscount: 0.1, // 10% discount
} as const

// Project duration in days
export const PROJECT_DURATION_DAYS = 120
