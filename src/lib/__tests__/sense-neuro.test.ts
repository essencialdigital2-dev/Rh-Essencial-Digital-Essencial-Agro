import { describe, it, expect } from 'vitest'
import {
  getConstelacao, getCheckInAdaptado, getAcomodacoesUniversais,
  PCD_INFO, getCheckInPcd, PERFIS_LABELS, DISC_LABELS,
} from '../sense-neuro'

describe('getConstelacao', () => {
  it('encontra a constelação para uma combinação válida perfil x DISC', () => {
    const c = getConstelacao('TDAH', 'D')
    expect(c).toBeDefined()
    expect(c?.perfil).toBe('TDAH')
    expect(c?.disc).toBe('D')
  })

  it('cobre todas as 20 combinações perfil x DISC (5 perfis x 4 DISC)', () => {
    const perfis = ['TDAH', 'TEA', 'Dislexia', 'AltasHabilidades', 'Descobrindo'] as const
    const discs = ['D', 'I', 'S', 'C'] as const
    for (const p of perfis) {
      for (const d of discs) {
        expect(getConstelacao(p, d), `faltando constelação ${p}/${d}`).toBeDefined()
      }
    }
  })
})

describe('getCheckInAdaptado', () => {
  it('retorna perguntas para cada perfil neurodivergente', () => {
    expect(getCheckInAdaptado('TDAH').length).toBeGreaterThan(0)
    expect(getCheckInAdaptado('TEA').length).toBeGreaterThan(0)
  })
})

describe('getAcomodacoesUniversais', () => {
  it('retorna uma lista não vazia', () => {
    expect(getAcomodacoesUniversais().length).toBeGreaterThan(0)
  })
})

describe('PCD_INFO', () => {
  it('tem os 3 perfis de PCD com todos os campos preenchidos', () => {
    for (const perfil of ['Visual', 'Auditiva', 'Motora'] as const) {
      const info = PCD_INFO[perfil]
      expect(info.label).toBeTruthy()
      expect(info.pontosForca.length).toBeGreaterThan(0)
      expect(info.desafiosNoTrabalho.length).toBeGreaterThan(0)
      expect(info.comoComunicar.length).toBeGreaterThan(0)
      expect(info.acomodacoesRazoaveis.length).toBeGreaterThan(0)
      expect(info.sinaisDeAlerta.length).toBeGreaterThan(0)
    }
  })
})

describe('getCheckInPcd', () => {
  it('retorna uma pergunta específica e diferente por perfil', () => {
    const visual = getCheckInPcd('Visual')
    const auditiva = getCheckInPcd('Auditiva')
    const motora = getCheckInPcd('Motora')
    expect(visual).not.toBe(auditiva)
    expect(auditiva).not.toBe(motora)
  })
})

describe('labels', () => {
  it('PERFIS_LABELS cobre os 5 perfis', () => {
    expect(Object.keys(PERFIS_LABELS)).toHaveLength(5)
  })
  it('DISC_LABELS cobre os 4 tipos', () => {
    expect(Object.keys(DISC_LABELS)).toHaveLength(4)
  })
})
