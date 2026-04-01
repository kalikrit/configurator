import { describe, it, expect } from 'vitest'
import { CompatibilityService } from '../CompatibilityService.js'

describe('CompatibilityService', () => {
  // Тестовые данные
  const cpuAMD = { name: 'AMD Ryzen 9 7950X', socket: 'AM5' }
  const cpuIntel = { name: 'Intel Core i7-13700K', socket: 'LGA1700' }
  const motherboardAM5 = { name: 'ASUS ROG X670E', socket: 'AM5' }
  const motherboardLGA1700 = { name: 'MSI Z790', socket: 'LGA1700' }
  const motherboardAM4 = { name: 'Gigabyte B550', socket: 'AM4' }
  
  describe('checkSocketCompatibility', () => {
    it('должен возвращать true для совместимых сокетов (AMD)', () => {
      expect(CompatibilityService.checkSocketCompatibility(cpuAMD, motherboardAM5)).toBe(true)
    })

    it('должен возвращать true для совместимых сокетов (Intel)', () => {
      expect(CompatibilityService.checkSocketCompatibility(cpuIntel, motherboardLGA1700)).toBe(true)
    })

    it('должен возвращать false для несовместимых сокетов', () => {
      expect(CompatibilityService.checkSocketCompatibility(cpuAMD, motherboardLGA1700)).toBe(false)
      expect(CompatibilityService.checkSocketCompatibility(cpuIntel, motherboardAM5)).toBe(false)
    })

    it('должен возвращать true если CPU или материнская плата не указаны', () => {
      expect(CompatibilityService.checkSocketCompatibility(null, motherboardAM5)).toBe(true)
      expect(CompatibilityService.checkSocketCompatibility(cpuAMD, null)).toBe(true)
      expect(CompatibilityService.checkSocketCompatibility(null, null)).toBe(true)
    })
  })

  describe('checkChipsetCompatibility', () => {
    it('должен возвращать true для AMD Ryzen 7/9 с сокетом AM5', () => {
      expect(CompatibilityService.checkChipsetCompatibility(cpuAMD, motherboardAM5)).toBe(true)
    })

    it('должен возвращать false для AMD Ryzen 7/9 с сокетом не AM5', () => {
      expect(CompatibilityService.checkChipsetCompatibility(cpuAMD, motherboardAM4)).toBe(false)
    })

    it('должен возвращать true для Intel Core i7/i9 с сокетом LGA1700', () => {
      expect(CompatibilityService.checkChipsetCompatibility(cpuIntel, motherboardLGA1700)).toBe(true)
    })

    it('должен возвращать false для Intel Core i7/i9 с сокетом не LGA1700', () => {
      expect(CompatibilityService.checkChipsetCompatibility(cpuIntel, motherboardAM4)).toBe(false)
    })

    it('должен возвращать true если CPU или материнская плата не указаны', () => {
      expect(CompatibilityService.checkChipsetCompatibility(null, motherboardAM5)).toBe(true)
      expect(CompatibilityService.checkChipsetCompatibility(cpuAMD, null)).toBe(true)
    })
  })

  describe('checkMemoryTypeCompatibility', () => {
    it('должен возвращать true когда память не указана', () => {
      expect(CompatibilityService.checkMemoryTypeCompatibility(motherboardAM5, [])).toBe(true)
      expect(CompatibilityService.checkMemoryTypeCompatibility(motherboardAM5, null)).toBe(true)
    })

    it('должен возвращать true когда материнская плата не указана', () => {
      const ram = [{ name: 'DDR5 32GB' }]
      expect(CompatibilityService.checkMemoryTypeCompatibility(null, ram)).toBe(true)
    })
  })

  describe('checkAllRules', () => {
    const mockRule1 = { name: 'Правило 1', check: () => true }
    const mockRule2 = { name: 'Правило 2', check: () => true }
    const mockRuleFail = { name: 'Правило ошибки', check: () => false }

    it('должен возвращать true если все правила пройдены', () => {
      expect(CompatibilityService.checkAllRules({}, [mockRule1, mockRule2])).toBe(true)
    })

    it('должен возвращать false если хотя бы одно правило не пройдено', () => {
      expect(CompatibilityService.checkAllRules({}, [mockRule1, mockRuleFail])).toBe(false)
    })

    it('должен возвращать true если правил нет', () => {
      expect(CompatibilityService.checkAllRules({}, [])).toBe(true)
      expect(CompatibilityService.checkAllRules({}, null)).toBe(true)
    })
  })

  describe('getIncompatibilityReason', () => {
    const mockRule1 = { name: 'Совместимость сокета', check: () => true }
    const mockRuleFail = { name: 'Недостаточно мощности', check: () => false }

    it('должен возвращать null если все правила пройдены', () => {
      expect(CompatibilityService.getIncompatibilityReason({}, [mockRule1])).toBe(null)
    })

    it('должен возвращать название первого непройденного правила', () => {
      expect(CompatibilityService.getIncompatibilityReason({}, [mockRule1, mockRuleFail])).toBe('Недостаточно мощности')
    })

    it('должен возвращать null если правил нет', () => {
      expect(CompatibilityService.getIncompatibilityReason({}, [])).toBe(null)
      expect(CompatibilityService.getIncompatibilityReason({}, null)).toBe(null)
    })
  })
})

