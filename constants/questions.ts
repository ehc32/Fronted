/**
 * Question definitions and options for the chatbot flow
 */

import type { QuestionOption } from "@/types/chatbot"

export const MAIN_QUESTIONS = [
  {
    id: "lote",
    text: "¿Tiene lote?",
    options: [
      { letra: "A", text: "Sí", value: "si" },
      { letra: "B", text: "No, estamos en proceso de compra", value: "no_proceso" },
    ] as QuestionOption[],
  },
  {
    id: "habitacion_principal",
    text: "Habitación principal - ¿Qué tipo de cama le gustaría?",
    options: [
      { letra: "A", text: "Sencilla (99x191 cm) - Habitación 4.5x3 = 13.5 m²", value: "sencilla", area: 13.5 },
      { letra: "B", text: "Doble (137x191 cm) - Habitación 4.5x3.5 = 15.75 m²", value: "doble", area: 15.75 },
      { letra: "C", text: "Queen (152x203 cm) - Habitación 4.5x4 = 18 m²", value: "queen", area: 18 },
      { letra: "D", text: "King (193x203 cm) - Habitación 4.5x5.5 = 24.75 m²", value: "king", area: 24.75 },
      {
        letra: "E",
        text: "California King (183x213 cm) - Habitación 4.5x6 = 27 m²",
        value: "california_king",
        area: 27,
      },
      { letra: "F", text: "Habitación 4.5x6.5 = 29.25 m²", value: "f", area: 29.25 },
      { letra: "G", text: "Habitación 4.5x7 = 31.5 m²", value: "g", area: 31.5 },
    ] as QuestionOption[],
  },
  {
    id: "habitaciones_adicionales",
    text: "Además de la habitación principal, ¿cuántas habitaciones adicionales desea?",
    options: [
      { letra: "A", text: "0", value: 0 },
      { letra: "B", text: "1", value: 1 },
      { letra: "C", text: "2", value: 2 },
      { letra: "D", text: "3", value: 3 },
    ] as QuestionOption[],
  },
] as const

export const ROOM_QUESTIONS = [
  {
    id: "tipo_cama",
    text: (num: number) => `Habitación ${num} - ¿Qué tipo de cama le gustaría?`,
    options: [
      { letra: "A", text: "Sencilla (99x191 cm) - Habitación 4.5x3 = 13.5 m²", value: "sencilla", area: 13.5 },
      { letra: "B", text: "Doble (137x191 cm) - Habitación 4.5x3.5 = 15.75 m²", value: "doble", area: 15.75 },
      { letra: "C", text: "Queen (152x203 cm) - Habitación 4.5x4 = 18 m²", value: "queen", area: 18 },
    ] as QuestionOption[],
  },
  {
    id: "bano_propio",
    text: (num: number) => `Habitación ${num} - ¿Tiene baño propio?`,
    options: [
      { letra: "A", text: "Sí (+ 3.5 m²)", value: "si", area: 3.5 },
      { letra: "B", text: "No", value: "no", area: 0 },
    ] as QuestionOption[],
  },
] as const

export const ADDITIONAL_SPACES = [
  { letra: "A", text: "Estudio (14 m²)", value: "estudio", area: 14 },
  { letra: "B", text: "Sala de TV (14 m²)", value: "sala_tv", area: 14 },
  { letra: "C", text: "Habitación de servicio + baño (18 m²)", value: "hab_servicio", area: 18 },
  { letra: "D", text: "Depósito pequeño (9 m²)", value: "deposito_pequeno", area: 9 },
  { letra: "E", text: "Depósito mediano (9 m²)", value: "deposito_mediano", area: 9 },
  { letra: "F", text: "Depósito grande (16 m²)", value: "deposito_grande", area: 16 },
  { letra: "G", text: "Sauna (16 m²)", value: "sauna", area: 16 },
  { letra: "H", text: "Turco (24 m²)", value: "turco", area: 24 },
  { letra: "I", text: "Piscina pequeña (16 m²)", value: "piscina_pequena", area: 16 },
  { letra: "J", text: "Piscina mediana (24 m²)", value: "piscina_mediana", area: 24 },
  { letra: "K", text: "Piscina grande (32 m²)", value: "piscina_grande", area: 32 },
  { letra: "L", text: "Baño social exterior (4 m²)", value: "bano_social_ext", area: 4 },
  { letra: "M", text: "Ninguno", value: "ninguno", area: 0 },
] as QuestionOption[]
