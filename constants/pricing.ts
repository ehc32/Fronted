/**
 * Pricing constants and configuration for the quotation system
 */
// Fixed values per square meter (corrected according to Excel)
export const PRICING_PER_M2 = {
  disenoArquitectonico: 54740,
  disenoEstructural: 28560,
  disenoElectrico: 23800,
  disenoHidraulico: 21420,
  presupuestoObra: 10710,
  acompanamiento: 11900,
  costoConstruccion: 1800000, // $1,800,000/m²
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
