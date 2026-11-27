import type { CollectionConfig, FieldHook } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { comoTexto, leerCampo } from '@/compartido/infraestructura/campos/validaciones'

import {
  type FechaPorDigito,
  MESES,
  nombreDelPeriodo,
  validarFechasPorDigito,
} from '../dominio/cronograma-sunat'

const aFechaPorDigito = (fila: unknown): FechaPorDigito => ({
  digito: Number(leerCampo(fila, 'digito')),
  fecha: comoTexto(leerCampo(fila, 'fecha')),
})

const validarCronograma = (filas: unknown): true | string =>
  validarFechasPorDigito(Array.isArray(filas) ? filas.map(aFechaPorDigito) : []) ?? true

const calcularPeriodo: FieldHook = ({ siblingData }) =>
  nombreDelPeriodo(Number(leerCampo(siblingData, 'anio')), Number(leerCampo(siblingData, 'mes')))

// Cronograma oficial de vencimientos de SUNAT de un periodo tributario: una fecha por cada
// último dígito del RUC. Un solo cronograma por año y mes.
export const coleccionCronogramasSunat: CollectionConfig = {
  slug: 'cronogramas-sunat',
  labels: { singular: 'Cronograma de SUNAT', plural: 'Cronogramas de SUNAT' },
  admin: {
    useAsTitle: 'periodo',
    defaultColumns: ['periodo', 'anio', 'mes'],
    group: 'Guía de clientes',
  },
  defaultSort: ['-anio', '-mes'],
  access: ACCESO_DE_CONTENIDO,
  indexes: [{ fields: ['anio', 'mes'], unique: true }],
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'anio', label: 'Año', type: 'number', required: true, min: 2020, max: 2100 },
        {
          name: 'mes',
          label: 'Mes del periodo',
          type: 'number',
          required: true,
          min: 1,
          max: 12,
          admin: { description: 'Mes que se declara, de 1 (enero) a 12 (diciembre).' },
        },
      ],
    },
    {
      name: 'periodo',
      label: 'Periodo',
      type: 'text',
      admin: { readOnly: true, description: `Se calcula: ${MESES[0]} 2026, por ejemplo.` },
      hooks: { beforeChange: [calcularPeriodo] },
    },
    {
      name: 'fechasPorDigito',
      label: 'Fechas de vencimiento por último dígito del RUC',
      labels: { singular: 'Fecha', plural: 'Fechas' },
      type: 'array',
      validate: validarCronograma,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'digito', label: 'Dígito', type: 'number', required: true, min: 0, max: 9 },
            {
              name: 'fecha',
              label: 'Vence el',
              type: 'date',
              required: true,
              admin: { date: { pickerAppearance: 'dayOnly' } },
            },
          ],
        },
      ],
    },
    {
      name: 'fechaBuenosContribuyentes',
      label: 'Vence el (buenos contribuyentes y UESP)',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
  ],
}
