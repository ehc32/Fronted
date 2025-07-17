/**
 * Quotation generation utilities
 */

import { PRICING_PER_M2, PAYMENT_STRUCTURE, PROJECT_DURATION_DAYS } from "@/constants/pricing"
import { calculateAreaBreakdown, generateAreaBreakdownText } from "./area-calculator"
import { convertNumberToSpanishText, formatDateToSpanish } from "./text-converter"
import { ADDITIONAL_SPACES, MAIN_QUESTIONS, ROOM_QUESTIONS } from "@/constants/questions"
import type { UserData, UserResponses, QuotationData, AreaBreakdown } from "@/types/chatbot"

/**
 * Generate complete quotation with detailed area breakdown
 */
export const generateCompleteQuotation = (
  userData: UserData,
  responses: UserResponses,
  additionalRooms: number,
): QuotationData => {
  // Calculate area breakdown
  const areaBreakdown = calculateAreaBreakdown(responses, additionalRooms)
  const totalArea = areaBreakdown.total

  // Calculate pricing stages
  const stage1Costs = calculateStage1Costs(totalArea)
  const stage2Costs = calculateStage2Costs(totalArea)

  // Calculate total design and licensing cost (sum of Etapa 1 and Etapa 2)
  const totalDesignAndLicensingCost = stage1Costs.subtotal + stage2Costs.subtotal

  // Calculate construction cost (Etapa 3)
  const costoConstruccion = totalArea * PRICING_PER_M2.costoConstruccion

  // Total cost includes design/licensing and construction
  const totalCost = totalDesignAndLicensingCost + costoConstruccion

  // Generate payment breakdown
  const paymentBreakdown = calculatePaymentBreakdown(totalCost)

  // Generate area breakdown text (still used internally for calculation, but not for display in main text)
  const areaBreakdownText = generateAreaBreakdownText(areaBreakdown)

  // Generate new summary strings for API payload
  const areasBasicasSummary = generateBaseAreasSummary(areaBreakdown)
  const habitacionPrincipalSummary = generatePrincipalRoomSummary(responses)
  const habitacionesAdicionalesSummary = generateAdditionalRoomsSummary(responses, additionalRooms)
  const espaciosAdicionalesSummary = generateExtraSpacesSummary(responses)
  const m2Formatted = `${totalArea.toLocaleString("es-CO", { maximumFractionDigits: 2 })} m²`

  // Generate complete quotation text
  const quotationText = generateQuotationText(
    userData,
    totalArea,
    areaBreakdownText, // This will be ignored in the new template
    stage1Costs,
    stage2Costs,
    totalDesignAndLicensingCost,
    costoConstruccion,
    totalCost,
    paymentBreakdown,
  )

  // JSON output for "PROPUESTA ECONÓMICA"
  const economicProposalJSON = {
    Etapa1: {
      Diseño_Arquitectonico: stage1Costs.disenoArquitectonico,
      Diseño_Estructural: stage1Costs.disenoEstructural,
      Acompañamiento_Licencias: stage1Costs.acompanamiento,
      Subtotal_Etapa_I: stage1Costs.subtotal,
    },
    Etapa2: {
      Diseño_Electrico: stage2Costs.disenoElectrico,
      Diseño_Hidraulico: stage2Costs.disenoHidraulico,
      Presupuesto_Proyecto: stage2Costs.presupuestoObra,
      Subtotal_Etapa_II: stage2Costs.subtotal,
    },
    Total_Diseño_Licencias: totalDesignAndLicensingCost,
    Etapa3: {
      Costo: costoConstruccion, // Changed key from Costo_Construccion to Costo
    },
    Total_General: totalCost,
    Total_General_Texto: convertNumberToSpanishText(totalCost),
  }

  console.log("PROPUESTA ECONÓMICA (JSON):", JSON.stringify(economicProposalJSON, null, 2))

  return {
    formato: "pdf",
    area_total: totalArea,
    cotizacionTexto: quotationText,
    areaBreakdown,
    economicProposalJSON,
    // New fields for technical summary in API payload
    areas_basicas_summary: areasBasicasSummary,
    habitacion_principal_summary: habitacionPrincipalSummary,
    habitaciones_adicionales_summary: habitacionesAdicionalesSummary,
    espacios_adicionales_summary: espaciosAdicionalesSummary,
    m2_formatted: m2Formatted,

    // API data fields - now matching Python backend's expected keys (lowercase, snake_case)
    nombre: userData.nombre,
    telefono: userData.telefono,
    correo: userData.correo,
    diseno_arquitectonico: stage1Costs.disenoArquitectonico.toLocaleString("es-CO"),
    diseno_estructural: stage1Costs.disenoEstructural.toLocaleString("es-CO"),
    acompanamiento_licencias: stage1Costs.acompanamiento.toLocaleString("es-CO"),
    subtotal_etapa_1: stage1Costs.subtotal.toLocaleString("es-CO"),
    diseno_electrico: stage2Costs.disenoElectrico.toLocaleString("es-CO"),
    diseno_hidraulico: stage2Costs.disenoHidraulico.toLocaleString("es-CO"),
    presupuesto_proyecto: stage2Costs.presupuestoObra.toLocaleString("es-CO"),
    subtotal_etapa_2: stage2Costs.subtotal.toLocaleString("es-CO"),
    costo: costoConstruccion.toLocaleString("es-CO"), // Changed key from costo_construccion to costo
    total_general: totalCost.toLocaleString("es-CO"),
    total_general_texto: convertNumberToSpanishText(totalCost),
    fecha: formatDateToSpanish(),
  }
}

/**
 * Calculate Stage 1 costs (Architectural, Structural, Licensing)
 */
const calculateStage1Costs = (totalArea: number) => {
  const disenoArquitectonico = totalArea * PRICING_PER_M2.disenoArquitectonico
  const disenoEstructural = totalArea * PRICING_PER_M2.disenoEstructural
  const acompanamiento = totalArea * PRICING_PER_M2.acompanamiento

  return {
    disenoArquitectonico,
    disenoEstructural,
    acompanamiento,
    subtotal: disenoArquitectonico + disenoEstructural + acompanamiento,
  }
}

/**
 * Calculate Stage 2 costs (Electrical, Hydraulic, Budget)
 */
const calculateStage2Costs = (totalArea: number) => {
  const disenoElectrico = totalArea * PRICING_PER_M2.disenoElectrico
  const disenoHidraulico = totalArea * PRICING_PER_M2.disenoHidraulico
  const presupuestoObra = totalArea * PRICING_PER_M2.presupuestoObra

  return {
    disenoElectrico,
    disenoHidraulico,
    presupuestoObra,
    subtotal: disenoElectrico + disenoHidraulico + presupuestoObra,
  }
}

/**
 * Calculate payment breakdown with discount options
 */
const calculatePaymentBreakdown = (totalCost: number) => {
  const firstPayment = totalCost * PAYMENT_STRUCTURE.firstPayment
  const secondPayment = totalCost * PAYMENT_STRUCTURE.secondPayment
  const thirdPayment = totalCost * PAYMENT_STRUCTURE.thirdPayment

  const discountedFirstPayment = firstPayment * (1 - PAYMENT_STRUCTURE.earlyPaymentDiscount)
  const totalWithDiscount = totalCost * (1 - PAYMENT_STRUCTURE.earlyPaymentDiscount)

  return {
    firstPayment,
    secondPayment,
    thirdPayment,
    discountedFirstPayment,
    totalWithDiscount,
  }
}

/**
 * Generate the complete quotation text
 */
const generateQuotationText = (
  userData: UserData,
  totalArea: number,
  areaBreakdownText: string, // This parameter is no longer used in the new template
  stage1Costs: any,
  stage2Costs: any,
  totalDesignAndLicensingCost: number,
  costoConstruccion: number,
  totalCost: number,
  paymentBreakdown: any,
): string => {
  return `🎉 COTIZACIÓN COMPLETA GENERADA

👤 Cliente: ${userData.nombre}
📧 Correo: ${userData.correo}
📱 Teléfono: ${userData.telefono}
📅 Fecha: ${formatDateToSpanish()}

🏠 ÁREA TOTAL CONSTRUIDA: ${totalArea.toLocaleString("es-CO", { maximumFractionDigits: 2 })} m²

💰 PROPUESTA ECONÓMICA

✨ Inversión de Diseño: $${totalDesignAndLicensingCost.toLocaleString("es-CO")}

📋 Inversión de Construcción:
• Costo: ${totalArea.toLocaleString("es-CO", { maximumFractionDigits: 2 })} m² × $${PRICING_PER_M2.costoConstruccion.toLocaleString("es-CO")} = $${costoConstruccion.toLocaleString("es-CO")}

🏆 TOTAL GENERAL: $${totalCost.toLocaleString("es-CO")}

💵 ${convertNumberToSpanishText(totalCost)}

✅ Incluye IVA

💳 FORMA DE PAGO:
• Primer pago (40%): $${paymentBreakdown.firstPayment.toLocaleString("es-CO")}
• Segundo pago (50%): $${paymentBreakdown.secondPayment.toLocaleString("es-CO")}
• Tercer pago (10%): $${paymentBreakdown.thirdPayment.toLocaleString("es-CO")}

🎯 DESCUENTO ESPECIAL:
Paga el primer 40% en 30 días y obtén 10% de descuento.

💰 Primer pago con descuento: $${paymentBreakdown.discountedFirstPayment.toLocaleString("es-CO")}
🏆 Total con descuento: $${paymentBreakdown.totalWithDiscount.toLocaleString("es-CO")}

⏱️ DURACIÓN DEL PROYECTO: ${PROJECT_DURATION_DAYS} días calendario (4 meses)`
}

/**
 * Helper to get display name for base areas
 */
const getAreaDisplayName = (key: string): string => {
  const displayNames: { [key: string]: string } = {
    cocina: "Cocina",
    sala: "Sala",
    comedor: "Comedor",
    ropas: "Zona de ropas",
    bano_social: "Baño social",
  }
  return displayNames[key] || key
}

/**
 * Helper to get display name for extra spaces
 */
const getSpaceDisplayName = (key: string): string => {
  const spaceOption = ADDITIONAL_SPACES.find((space) => space.value === key)
  return spaceOption ? spaceOption.text.split(" (")[0] : key
}

/**
 * Generate a concise summary of base areas.
 */
const generateBaseAreasSummary = (areaBreakdown: AreaBreakdown): string => {
  const baseAreaNames = Object.keys(areaBreakdown.baseAreas).map(getAreaDisplayName)
  return baseAreaNames.join(", ")
}

/**
 * Generate a concise summary of the principal room.
 */
const generatePrincipalRoomSummary = (responses: UserResponses): string => {
  if (responses.habitacion_principal) {
    const principalRoomOption = MAIN_QUESTIONS[1].options.find((opt) => opt.value === responses.habitacion_principal)
    if (principalRoomOption) {
      return `Habitación principal (${principalRoomOption.text.split(" (")[0]})`
    }
  }
  return "No seleccionada"
}

/**
 * Generate a concise summary of additional bedrooms.
 */
const generateAdditionalRoomsSummary = (responses: UserResponses, additionalRoomsCount: number): string => {
  const roomSummaries: string[] = []
  for (let i = 1; i <= additionalRoomsCount; i++) {
    let roomDetails = `Habitación ${i}`
    if (responses[`habitacion_${i}_cama`]) {
      const bedOption = ROOM_QUESTIONS[0].options.find((opt) => opt.value === responses[`habitacion_${i}_cama`])
      if (bedOption) roomDetails += ` (${bedOption.text.split(" (")[0]})`
    }
    if (responses[`habitacion_${i}_bano`] === "si") {
      roomDetails += " con baño"
    } else {
      roomDetails += " sin baño"
    }
    roomSummaries.push(roomDetails)
  }
  return roomSummaries.length > 0 ? roomSummaries.join(", ") : "Ninguna"
}

/**
 * Generate a concise summary of other additional spaces.
 */
const generateExtraSpacesSummary = (responses: UserResponses): string => {
  if (responses.espacios_adicionales && Array.isArray(responses.espacios_adicionales)) {
    const selectedSpaces = responses.espacios_adicionales.filter((space) => space !== "ninguno")
    if (selectedSpaces.length > 0) {
      const spaceNames = selectedSpaces.map(getSpaceDisplayName)
      return spaceNames.join(", ")
    }
  }
  return "Ninguno"
}
