/**
 * PowerService
 * Сервис для расчета мощности и подбора блока питания
 * Не зависит от Vue, не использует реактивность
 */

export const PowerService = {
  /**
   * Рассчитывает общую мощность системы на основе выбранных компонентов
   * @param {Object} selected - Объект с выбранными компонентами
   * @returns {Object} Объект с результатами расчета
   */
  calculateTotalPower(selected) {
    let totalPower = 0
    let totalTDP = 0
    const componentDetails = []

    // CPU TDP
    if (selected.cpu) {
      const cpuTdp = selected.cpu.tdp || 0
      totalTDP += cpuTdp
      componentDetails.push({
        name: selected.cpu.name,
        type: 'cpu',
        tdp: cpuTdp,
        power: cpuTdp
      })
    }

    // GPU power consumption
    if (selected.gpu) {
      const gpuPower = selected.gpu.powerConsumption || 0
      totalPower += gpuPower
      componentDetails.push({
        name: selected.gpu.name,
        type: 'gpu',
        power: gpuPower
      })
    }

    // Добавляем базовое потребление системы (материнская плата, память, диски)
    const baseSystemPower = 50 // Вт
    totalPower += baseSystemPower
    totalPower += totalTDP

    return {
      totalPower,
      totalTDP,
      baseSystemPower,
      componentDetails,
      recommendedPsu: Math.ceil(totalPower * 1.3 / 50) * 50 // +30% запас, округление до 50
    }
  },

  /**
   * Проверяет, достаточно ли мощности БП для выбранной конфигурации
   * @param {Object} selected - Объект с выбранными компонентами
   * @param {Object} psu - Объект блока питания
   * @returns {boolean} true если мощности достаточно
   */
  isPsuSufficient(selected, psu) {
    if (!psu) return false
    
    const { totalPower } = this.calculateTotalPower(selected)
    return psu.power >= totalPower
  },

  /**
   * Проверяет соответствие рекомендованной мощности БП для видеокарты
   * @param {Object} gpu - Объект видеокарты
   * @param {Object} psu - Объект блока питания
   * @returns {boolean} true если БП соответствует рекомендациям
   */
  checkGpuRecommendedPsu(gpu, psu) {
    if (!gpu || !psu) return true
    return psu.power >= (gpu.recommendedPsu || 0)
  },

  /**
   * Подбирает подходящий БП из списка доступных
   * @param {Object} selected - Объект с выбранными компонентами
   * @param {Array} availablePsus - Массив доступных блоков питания
   * @returns {Object|null} Подходящий БП или null
   */
  findSuitablePsu(selected, availablePsus) {
    if (!availablePsus || availablePsus.length === 0) return null
    
    const { recommendedPsu } = this.calculateTotalPower(selected)
    
    // Сортируем по мощности (от меньшей к большей) и находим первый подходящий
    const sortedPsus = [...availablePsus].sort((a, b) => a.power - b.power)
    
    for (const psu of sortedPsus) {
      if (psu.power >= recommendedPsu) {
        return psu
      }
    }
    
    return null
  },

  /**
   * Возвращает статус проверки мощности
   * @param {Object} selected - Объект с выбранными компонентами
   * @param {Object} psu - Выбранный блок питания
   * @returns {Object} Статус проверки
   */
  getPowerStatus(selected, psu) {
    if (!psu) {
      return {
        status: 'warning',
        message: 'Блок питания не выбран',
        sufficient: false
      }
    }

    const { totalPower, recommendedPsu } = this.calculateTotalPower(selected)
    const isSufficient = psu.power >= totalPower
    const hasHeadroom = psu.power >= recommendedPsu

    if (!isSufficient) {
      return {
        status: 'error',
        message: `Недостаточно мощности! Требуется: ${totalPower}Вт, у вас: ${psu.power}Вт`,
        sufficient: false,
        required: totalPower,
        available: psu.power
      }
    }

    if (!hasHeadroom) {
      return {
        status: 'warning',
        message: `Мощности достаточно, но нет запаса. Рекомендуется: ${recommendedPsu}Вт`,
        sufficient: true,
        recommended: recommendedPsu
      }
    }

    return {
      status: 'success',
      message: `Мощность в норме. Потребление: ~${totalPower}Вт, запас: ${psu.power - totalPower}Вт`,
      sufficient: true,
      headroom: psu.power - totalPower
    }
  }
}

export default PowerService
