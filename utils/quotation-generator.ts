/**
 * Quotation generation utilities
 */

import { PRICING_PER_M2, PAYMENT_STRUCTURE, PROJECT_DURATION_DAYS } from "@/constants/pricing"
import { calculateAreaBreakdown, generateAreaBreakdownText } from "./area-calculator"
import { convertNumberToSpanishText, formatDateToSpanish } from "./text-converter"
import type { UserData, UserResponses, QuotationData } from "@/types/chatbot"

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
  const totalCost = stage1Costs.subtotal + stage2Costs.subtotal

  // Generate payment breakdown
  const paymentBreakdown = calculatePaymentBreakdown(totalCost)

  // Generate area breakdown text
  const areaBreakdownText = generateAreaBreakdownText(areaBreakdown)

  // Generate quotation text
  const quotationText = generateQuotationText(
    userData,
    totalArea,
    areaBreakdownText,
    stage1Costs,
    stage2Costs,
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
    Total_General: totalCost,
    Total_General_Texto: convertNumberToSpanishText(totalCost),
  }

  console.log("PROPUESTA ECONÓMICA (JSON):", JSON.stringify(economicProposalJSON, null, 2))

  return {
    formato: "pdf",
    area_total: totalArea,
    cotizacionTexto: quotationText,
    areaBreakdown,
    economicProposalJSON, // ADDED: Now included in the returned object
    // API data fields (these are already formatted strings, keeping as is)
    Diseño_Ar: `$ ${stage1Costs.disenoArquitectonico.toLocaleString("es-CO")}`,
    Diseño_Calcu: `$ ${stage1Costs.disenoEstructural.toLocaleString("es-CO")}`,
    Acompañamie: `$ ${stage1Costs.acompanamiento.toLocaleString("es-CO")}`,
    Subtotal_1: `$ ${stage1Costs.subtotal.toLocaleString("es-CO")}`,
    Diseño_Electrico: `$ ${stage2Costs.disenoElectrico.toLocaleString("es-CO")}`,
    Diseño_Hidraulico: `$ ${stage2Costs.disenoHidraulico.toLocaleString("es-CO")}`,
    Presupuesta: `$ ${stage2Costs.presupuestoObra.toLocaleString("es-CO")}`,
    Subtotal_2: `$ ${stage2Costs.subtotal.toLocaleString("es-CO")}`,
    Total: `$ ${totalCost.toLocaleString("es-CO")}`,
    fecha: formatDateToSpanish(),
    nombre: userData.nombre,
    correo: userData.correo,
    telefono: userData.telefono,
    texto: convertNumberToSpanishText(totalCost),
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
  areaBreakdownText: string,
  stage1Costs: any,
  stage2Costs: any,
  totalCost: number,
  paymentBreakdown: any,
): string => {
  return `🎉 COTIZACIÓN COMPLETA GENERADA

👤 Cliente: ${userData.nombre}
📧 Correo: ${userData.correo}
📱 Teléfono: ${userData.telefono}
📅 Fecha: ${formatDateToSpanish()}

${areaBreakdownText}

💰 PROPUESTA ECONÓMICA

📋 Etapa 1 - Diseño y Licencias:
• Diseño Arquitectónico: $${stage1Costs.disenoArquitectonico.toLocaleString("es-CO")}
• Diseño Estructural: $${stage1Costs.disenoEstructural.toLocaleString("es-CO")}
• Acompañamiento Licencias: $${stage1Costs.acompanamiento.toLocaleString("es-CO")}

📍 SUBTOTAL ETAPA I: $${stage1Costs.subtotal.toLocaleString("es-CO")}

📋 Etapa 2 - Instalaciones y Presupuesto:
• Diseño Eléctrico: $${stage2Costs.disenoElectrico.toLocaleString("es-CO")}
• Diseño Hidráulico: $${stage2Costs.disenoHidraulico.toLocaleString("es-CO")}
• Presupuesto del Proyecto: $${stage2Costs.presupuestoObra.toLocaleString("es-CO")}

📍 SUBTOTAL ETAPA II: $${stage2Costs.subtotal.toLocaleString("es-CO")}

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
