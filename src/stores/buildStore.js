import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { components } from '../data/components'
import { devices } from '../config/devices'

export const useBuildStore = defineStore('build', () => {
  const currentDevice = ref(null)
  const selected = ref({})
  
  const initDevice = (deviceId) => {
    const device = devices[deviceId]
    if (!device) return false
    
    currentDevice.value = device
    
    const newSelected = {}
    device.slots.forEach(slot => {
      newSelected[slot.id] = null
    })
    selected.value = newSelected
    
    return true
  }

  const selectComponent = (slotId, component) => {
    const device = currentDevice.value
    if (!device) return false
    
    const testSelected = { ...selected.value, [slotId]: component }
    const allRulesPass = device.compatibilityRules.every(rule => rule.check(testSelected))
    
    if (allRulesPass) {
      selected.value = { ...selected.value, [slotId]: component }
      return true
    }
    return false
  }

  const removeComponent = (slotId) => {
    selected.value = { ...selected.value, [slotId]: null }
  }

  const reset = () => {
    currentDevice.value = null
    selected.value = {}
  }

  // Вычисляемое свойство: проверка совместимости для конкретного слота и компонента
  const isComponentCompatible = computed(() => (slotId, component) => {
    const device = currentDevice.value
    if (!device || !component) return false
    
    const testSelected = { ...selected.value, [slotId]: component }
    return device.compatibilityRules.every(rule => rule.check(testSelected))
  })

  // Вычисляемое свойство: получение причины несовместимости
  const getCompatibilityReason = computed(() => (slotId, component) => {
    const device = currentDevice.value
    if (!device || !component) return null
    
    const testSelected = { ...selected.value, [slotId]: component }
    
    for (const rule of device.compatibilityRules) {
      if (!rule.check(testSelected)) {
        return `Несовместимо: ${rule.name}`
      }
    }
    return null
  })

  const isComplete = computed(() => {
    const device = currentDevice.value
    if (!device) return false
    return device.isComplete(selected.value)
  })

  const totalPrice = computed(() => {
    let sum = 0
    Object.values(selected.value).forEach(component => {
      if (component && component.price) {
        sum += component.price
      }
    })
    return sum
  })

  return {
    currentDevice,
    selected,
    initDevice,
    selectComponent,
    removeComponent,
    reset,
    isComponentCompatible,
    getCompatibilityReason,
    isComplete,
    totalPrice
  }
})
