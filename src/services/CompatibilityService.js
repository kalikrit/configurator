/**
 * CompatibilityService
 * Сервис для проверки совместимости компонентов
 * Не зависит от Vue, не использует реактивность
 */

export const CompatibilityService = {
  /**
   * Проверяет совместимость сокета CPU и материнской платы
   * @param {Object} cpu - Объект процессора
   * @param {Object} motherboard - Объект материнской платы
   * @returns {boolean} true если совместимы
   */
  checkSocketCompatibility(cpu, motherboard) {
    if (!cpu || !motherboard) return true
    return cpu.socket === motherboard.socket
  },

  /**
   * Проверяет совместимость чипсета (расширенная проверка)
   * @param {Object} cpu - Объект процессора
   * @param {Object} motherboard - Объект материнской платы
   * @returns {boolean} true если совместимы
   */
  checkChipsetCompatibility(cpu, motherboard) {
    if (!cpu || !motherboard) return true
    
    // Простая логика: AMD Ryzen 7000 требует AM5, Intel 13-го поколения требует LGA1700
    const cpuName = cpu.name || ''
    const mbSocket = motherboard.socket || ''
    
    if (cpuName.includes('Ryzen 7') || cpuName.includes('Ryzen 9')) {
      return mbSocket === 'AM5'
    }
    if (cpuName.includes('Core i7') || cpuName.includes('Core i9')) {
      return mbSocket === 'LGA1700'
    }
    
    return true
  },

  /**
   * Проверяет совместимость типа памяти (для будущего расширения)
   * @param {Object} motherboard - Объект материнской платы
   * @param {Array} ram - Массив модулей памяти
   * @returns {boolean} true если совместимы
   */
  checkMemoryTypeCompatibility(motherboard, ram) {
    if (!motherboard || !ram || ram.length === 0) return true
    // Заглушка для будущего расширения
    return true
  },

  /**
   * Проверяет все правила совместимости для выбранной конфигурации
   * @param {Object} selected - Объект с выбранными компонентами
   * @param {Array} rules - Массив правил совместимости устройства
   * @returns {boolean} true если все правила пройдены
   */
  checkAllRules(selected, rules) {
    if (!rules || rules.length === 0) return true
    return rules.every(rule => rule.check(selected))
  },

  /**
   * Возвращает причину несовместимости
   * @param {Object} selected - Объект с выбранными компонентами
   * @param {Array} rules - Массив правил совместимости устройства
   * @returns {string|null} Причина несовместимости или null
   */
  getIncompatibilityReason(selected, rules) {
    if (!rules || rules.length === 0) return null
    
    for (const rule of rules) {
      if (!rule.check(selected)) {
        return rule.name
      }
    }
    return null
  }
}

export default CompatibilityService
