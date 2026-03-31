import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { components } from '../data/components'
import { devices } from '../config/devices'

export const useBuildStore = defineStore('build', () => {
  const currentDevice = ref(null)
  const selected = ref({})
  const updateTrigger = ref(0) // Триггер для принудительного обновления

  const initDevice = (deviceId) => {
    const device = devices[deviceId]
    if (!device) return false
    
    currentDevice.value = device
    
    const newSelected = {}
    device.slots.forEach(slot => {
      newSelected[slot.id] = null
    })
    selected.value = newSelected
    
    updateTrigger.value++ // Триггерим обновление
    return true
  }

  const selectComponent = (slotId, component) => {
    const device = currentDevice.value
    if (!device) return false
    
    const testSelected = { ...selected.value, [slotId]: component }
    const allRulesPass = device.compatibilityRules.every(rule => rule.check(testSelected))
    
    if (allRulesPass) {
      selected.value = { ...selected.value, [slotId]: component }
      updateTrigger.value++ // Триггерим обновление
      return true
    }
    return false
  }

  const removeComponent = (slotId) => {
    selected.value = { ...selected.value, [slotId]: null }
    updateTrigger.value++ // Триггерим обновление
  }

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
    updateTrigger,
    initDevice,
    selectComponent,
    removeComponent,
    isComplete,
    totalPrice
  }
})