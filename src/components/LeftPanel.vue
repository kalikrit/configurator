<template>
  <div class="left-panel">
    <h3>Комплектующие</h3>
    
    <div v-if="!buildStore.currentDevice">
      <p>Загрузка...</p>
    </div>
    
    <div 
      v-else
      v-for="slot in buildStore.currentDevice.slots" 
      :key="slot.id"
      class="category"
    >
      <h4>{{ slot.name }}</h4>
      <div class="components-list">
        <ComponentCard
          v-for="component in getAllComponentsForSlot(slot)"
          :key="component.id"
          :component="component"
          :slot-id="slot.id"
          :available="isComponentAvailable(slot, component)"
          :reason="getCompatibilityReason(slot, component)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBuildStore } from '../stores/buildStore'
import ComponentCard from './ComponentCard.vue'
import { components } from '../data/components'

const buildStore = useBuildStore()

const getAllComponentsForSlot = (slot) => {
  return components[slot.category] || []
}

const isComponentAvailable = (slot, component) => {
  const device = buildStore.currentDevice
  if (!device) return false
  
  const testSelected = { ...buildStore.selected, [slot.id]: component }
  
  // Проверяем все правила совместимости
  return device.compatibilityRules.every(rule => rule.check(testSelected))
}

const getCompatibilityReason = (slot, component) => {
  const device = buildStore.currentDevice
  if (!device) return null
  
  const testSelected = { ...buildStore.selected, [slot.id]: component }
  
  // Находим первое правило, которое не проходит
  for (const rule of device.compatibilityRules) {
    if (!rule.check(testSelected)) {
      return rule.name
    }
  }
  return null
}
</script>

<style scoped>
.left-panel {
  width: 320px;
  min-width: 320px;
  background: #f9f9f9;
  padding: 20px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  height: 100%;
}

.category {
  margin-bottom: 24px;
}

.category h4 {
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #ddd;
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
