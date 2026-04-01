import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { components } from '../data/components'
import { devices } from '../config/devices'
import CompatibilityService from '../services/CompatibilityService'
import PowerService from '../services/PowerService'

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
    
    // Используем сервис для проверки совместимости
    const allRulesPass = CompatibilityService.checkAllRules(testSelected, device.compatibilityRules)
    
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
    return CompatibilityService.checkAllRules(testSelected, device.compatibilityRules)
  })

  // Вычисляемое свойство: получение причины несовместимости
  const getCompatibilityReason = computed(() => (slotId, component) => {
    const device = currentDevice.value
    if (!device || !component) return null
    
    const testSelected = { ...selected.value, [slotId]: component }
    
    const reason = CompatibilityService.getIncompatibilityReason(testSelected, device.compatibilityRules)
    return reason ? `Несовместимо: ${reason}` : null
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

  // Вычисляемое свойство: расчет мощности с использованием PowerService
  const powerInfo = computed(() => {
    return PowerService.calculateTotalPower(selected.value)
  })

  // Вычисляемое свойство: статус проверки мощности БП
  const powerStatus = computed(() => {
    const psu = selected.value.psu
    return PowerService.getPowerStatus(selected.value, psu)
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
    totalPrice,
    powerInfo,
    powerStatus
  }
})
