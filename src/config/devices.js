// src/config/devices.js

export const pcDevice = {
  id: 'pc',
  name: 'Персональный компьютер',
  icon: '🖥️',
  
  // Слоты устройства
  slots: [
    { id: 'cpu', name: 'Процессор', category: 'cpu', required: true, multiple: false },
    { id: 'motherboard', name: 'Материнская плата', category: 'motherboard', required: true, multiple: false },
    { id: 'gpu', name: 'Видеокарта', category: 'gpu', required: true, multiple: false },
    { id: 'psu', name: 'Блок питания', category: 'psu', required: true, multiple: false }
  ],
  
  // Правила совместимости
  compatibilityRules: [
    {
      name: 'CPU-Motherboard Socket',
      check: (selected) => {
        // Если один из компонентов не выбран — правило не применяется
        if (!selected.cpu || !selected.motherboard) return true
        
        const result = selected.cpu.socket === selected.motherboard.socket
        console.log(`    CPU: ${selected.cpu.socket}, MB: ${selected.motherboard.socket} → ${result}`)
        return result
      }
    },
    {
      name: 'GPU-PSU Power',
      check: (selected) => {
        // Если один из компонентов не выбран — правило не применяется
        if (!selected.gpu || !selected.psu) return true
        
        const result = selected.psu.power >= selected.gpu.recommendedPsu
        console.log(`    GPU rec: ${selected.gpu.recommendedPsu}W, PSU: ${selected.psu.power}W → ${result}`)
        return result
      }
    }
  ],
  
  isComplete: (selected) => {
    return selected.cpu && selected.motherboard && selected.gpu && selected.psu
  }
}


// Сервер (заглушка для будущего расширения)
export const serverDevice = {
  id: 'server',
  name: 'Сервер',
  icon: '🖧',
  slots: [],
  compatibilityRules: [],
  isComplete: () => false
}

// Ноутбук (заглушка для будущего расширения)
export const laptopDevice = {
  id: 'laptop',
  name: 'Ноутбук',
  icon: '💻',
  slots: [],
  compatibilityRules: [],
  isComplete: () => false
}

// Реестр всех доступных устройств
export const devices = {
  pc: pcDevice,
  server: serverDevice,
  laptop: laptopDevice
}