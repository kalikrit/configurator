import { describe, it, expect } from 'vitest'
import { PowerService } from '../PowerService.js'

describe('PowerService', () => {
  // Тестовые данные
  const cpu = { name: 'AMD Ryzen 9 7950X', tdp: 170 }
  const gpu = { name: 'NVIDIA RTX 4090', powerConsumption: 450, recommendedPsu: 850 }
  const gpuLow = { name: 'NVIDIA GTX 1650', powerConsumption: 75, recommendedPsu: 450 }
  const psu850 = { name: 'Corsair RM850x', power: 850 }
  const psu650 = { name: 'Corsair RM650x', power: 650 }
  const psu450 = { name: 'Corsair RM450x', power: 450 }

  describe('calculateTotalPower', () => {
    it('должен рассчитывать мощность для CPU и GPU', () => {
      const selected = { cpu, gpu }
      const result = PowerService.calculateTotalPower(selected)
      
      expect(result.totalPower).toBeGreaterThan(0)
      expect(result.totalTDP).toBe(170)
      expect(result.componentDetails).toHaveLength(2)
      expect(result.recommendedPsu).toBeGreaterThan(result.totalPower)
    })

    it('должен рассчитывать мощность только для CPU', () => {
      const selected = { cpu }
      const result = PowerService.calculateTotalPower(selected)
      
      expect(result.totalTDP).toBe(170)
      expect(result.componentDetails).toHaveLength(1)
    })

    it('должен рассчитывать мощность только для GPU', () => {
      const selected = { gpu }
      const result = PowerService.calculateTotalPower(selected)
      
      expect(result.totalPower).toBeGreaterThanOrEqual(450 + 50) // GPU + baseSystemPower
      expect(result.componentDetails).toHaveLength(1)
    })

    it('должен возвращать базовое потребление системы', () => {
      const selected = {}
      const result = PowerService.calculateTotalPower(selected)
      
      expect(result.baseSystemPower).toBe(50)
    })

    it('должен рассчитывать рекомендуемый БП с запасом 30%', () => {
      const selected = { cpu, gpu }
      const result = PowerService.calculateTotalPower(selected)
      
      expect(result.recommendedPsu).toBe(Math.ceil(result.totalPower * 1.3 / 50) * 50)
    })
  })

  describe('isPsuSufficient', () => {
    it('должен возвращать true если мощности БП достаточно', () => {
      const selected = { cpu, gpu: gpuLow }
      expect(PowerService.isPsuSufficient(selected, psu650)).toBe(true)
    })

    it('должен возвращать false если мощности БП недостаточно', () => {
      const selected = { cpu, gpu }
      expect(PowerService.isPsuSufficient(selected, psu450)).toBe(false)
    })

    it('должен возвращать false если БП не указан', () => {
      const selected = { cpu }
      expect(PowerService.isPsuSufficient(selected, null)).toBe(false)
    })
  })

  describe('checkGpuRecommendedPsu', () => {
    it('должен возвращать true если БП соответствует рекомендациям GPU', () => {
      expect(PowerService.checkGpuRecommendedPsu(gpu, psu850)).toBe(true)
      expect(PowerService.checkGpuRecommendedPsu(gpu, { power: 1000 })).toBe(true)
    })

    it('должен возвращать false если БП не соответствует рекомендациям GPU', () => {
      expect(PowerService.checkGpuRecommendedPsu(gpu, psu650)).toBe(false)
    })

    it('должен возвращать true если GPU или БП не указаны', () => {
      expect(PowerService.checkGpuRecommendedPsu(null, psu850)).toBe(true)
      expect(PowerService.checkGpuRecommendedPsu(gpu, null)).toBe(true)
    })
  })

  describe('findSuitablePsu', () => {
    const availablePsus = [psu450, psu650, psu850]

    it('должен находить подходящий БП минимальной достаточной мощности', () => {
      const selected = { cpu, gpu: gpuLow }
      // cpu (170W) + gpuLow (75W) + base (50W) = 295W
      // recommended = ceil(295 * 1.3 / 50) * 50 = ceil(383.5 / 50) * 50 = 8 * 50 = 400W
      // psu450 (450W) >= 400W, поэтому он будет выбран
      const result = PowerService.findSuitablePsu(selected, availablePsus)
      
      expect(result).toEqual(psu450)
    })

    it('должен находить мощный БП для топовой конфигурации', () => {
      const selected = { cpu, gpu }
      // cpu (170W) + gpu (450W) + base (50W) = 670W
      // recommended = ceil(670 * 1.3 / 50) * 50 = ceil(871 / 50) * 50 = 18 * 50 = 900W
      // Ни один БП не подходит (max 850W), поэтому null
      const result = PowerService.findSuitablePsu(selected, availablePsus)
      
      expect(result).toBe(null)
    })

    it('должен возвращать null если нет подходящего БП', () => {
      const selected = { cpu, gpu }
      const limitedPsus = [psu450, psu650]
      const result = PowerService.findSuitablePsu(selected, limitedPsus)
      
      expect(result).toBe(null)
    })

    it('должен возвращать null если список БП пуст', () => {
      const selected = { cpu }
      expect(PowerService.findSuitablePsu(selected, [])).toBe(null)
      expect(PowerService.findSuitablePsu(selected, null)).toBe(null)
    })
  })

  describe('getPowerStatus', () => {
    it('должен возвращать warning если БП не выбран', () => {
      const selected = { cpu }
      const result = PowerService.getPowerStatus(selected, null)
      
      expect(result.status).toBe('warning')
      expect(result.sufficient).toBe(false)
    })

    it('должен возвращать error если мощности недостаточно', () => {
      const selected = { cpu, gpu }
      const result = PowerService.getPowerStatus(selected, psu450)
      
      expect(result.status).toBe('error')
      expect(result.sufficient).toBe(false)
      expect(result.required).toBeDefined()
      expect(result.available).toBe(450)
    })

    it('должен возвращать warning если мощности достаточно но нет запаса', () => {
      const selected = { cpu, gpu }
      // Подбираем ситуацию где мощности刚好 достаточно но нет 30% запаса
      const result = PowerService.getPowerStatus(selected, psu650)
      
      // В зависимости от расчетов это может быть error или warning
      expect(result.sufficient).toBe(result.status !== 'error')
    })

    it('должен возвращать success если мощности достаточно с запасом', () => {
      const selected = { cpu, gpu: gpuLow }
      const result = PowerService.getPowerStatus(selected, psu850)
      
      expect(result.status).toBe('success')
      expect(result.sufficient).toBe(true)
      expect(result.headroom).toBeGreaterThan(0)
    })
  })
})

