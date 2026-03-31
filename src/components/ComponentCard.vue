<template>
  <div 
    class="component-card" 
    :class="{
      'component-card--available': available,
      'component-card--unavailable': !available
    }"
    :draggable="available"
    @dragstart="onDragStart"
  >
    <div class="component-card__name">{{ component.name }}</div>
    <div class="component-card__price">{{ component.price }} ₽</div>
    <div class="component-card__specs">{{ specsText }}</div>
    <div v-if="!available" class="component-card__badge">⛔ Недоступно</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  component: Object,
  available: {
    type: Boolean,
    default: true
  },
  slotId: String
})

const specsText = computed(() => {
  const specs = []
  if (props.component.socket) specs.push(`🔌 ${props.component.socket}`)
  if (props.component.recommendedPsu) specs.push(`⚡ ${props.component.recommendedPsu}Вт`)
  if (props.component.power) specs.push(`💪 ${props.component.power}Вт`)
  if (props.component.powerConsumption) specs.push(`🔥 ${props.component.powerConsumption}Вт`)
  if (props.component.tdp) specs.push(`🌡️ ${props.component.tdp}Вт`)
  return specs.join(' · ')
})

const onDragStart = (event) => {
  if (!props.available) {
    event.preventDefault()
    return false
  }
  
  event.dataTransfer.setData('application/json', JSON.stringify({
    slotId: props.slotId,
    component: props.component
  }))
  event.dataTransfer.effectAllowed = 'copy'
}
</script>

<style scoped>
.component-card {
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
}

/* Доступный компонент */
.component-card--available {
  background: white;
  border: 2px solid #4caf50;
  cursor: grab;
}

.component-card--available:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  background: #f1f8e9;
}

/* Недоступный компонент */
.component-card--unavailable {
  background: #e8e8e8;
  border: 2px solid #d0d0d0;
  cursor: not-allowed;
  opacity: 0.6;
  filter: grayscale(0.3);
}

.component-card--unavailable:hover {
  transform: none;
  box-shadow: none;
}

.component-card__name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.component-card--available .component-card__name {
  color: #1a3e2c;
}

.component-card--unavailable .component-card__name {
  color: #8c8c8c;
}

.component-card__price {
  font-size: 13px;
  font-weight: 600;
  margin-top: 4px;
}

.component-card--available .component-card__price {
  color: #2c3e50;
}

.component-card--unavailable .component-card__price {
  color: #a0a0a0;
}

.component-card__specs {
  font-size: 11px;
  margin-top: 4px;
}

.component-card--available .component-card__specs {
  color: #666;
}

.component-card--unavailable .component-card__specs {
  color: #aaa;
}

.component-card__badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #d32f2f;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}
</style>