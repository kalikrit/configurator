<template>
  <div class="right-panel" :class="{ complete: buildStore.isComplete }">
    <div v-if="!buildStore.currentDevice">
      <p>Загрузка...</p>
    </div>
    
    <template v-else>
      <h3>Сборка: {{ buildStore.currentDevice.name }}</h3>
      
      <div class="slots">
        <div 
          v-for="slot in buildStore.currentDevice.slots" 
          :key="slot.id"
          class="slot" 
          :class="{ filled: buildStore.selected[slot.id] }"
        >
          <div class="slot-title">{{ slot.name }}</div>
          <div v-if="buildStore.selected[slot.id]" class="slot-content">
            <span>{{ buildStore.selected[slot.id].name }}</span>
            <button class="remove-btn" @click="buildStore.removeComponent(slot.id)">✕</button>
          </div>
          <div 
            v-else 
            class="slot-empty" 
            @dragover.prevent 
            @drop="(event) => onDrop(slot.id, event)"
          >
            Перетащите {{ slot.name.toLowerCase() }} сюда
          </div>
        </div>
      </div>

      <div class="summary" v-if="buildStore.totalPrice > 0">
        <div class="total-price">Итого: {{ buildStore.totalPrice.toLocaleString() }} ₽</div>
        <div v-if="buildStore.isComplete" class="success-message">
          {{ buildStore.currentDevice.name }} собран успешно!
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useBuildStore } from '../stores/buildStore'

const buildStore = useBuildStore()

const onDrop = (slotId, event) => {
  const rawData = event.dataTransfer.getData('application/json')
  if (!rawData) return
  
  const { slotId: draggedSlotId, component } = JSON.parse(rawData)
  
  if (draggedSlotId === slotId) {
    buildStore.selectComponent(slotId, component)
  }
}
</script>

<style scoped>
.right-panel {
  flex: 1; 
  padding: 20px;
  transition: box-shadow 0.2s;
  overflow-y: auto; 
  height: 100%;
}

.right-panel.complete {
  box-shadow: 0 0 0 3px #4caf50;
  border-radius: 8px;
}

.slots {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.slot {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.slot.filled {
  border: 2px solid #4caf50;
  background: #f1f8e9;
}

.slot-title {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.slot-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slot-empty {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.remove-btn {
  background: #ff5252;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
}

.remove-btn:hover {
  background: #ff1744;
}

.summary {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #ddd;
}

.total-price {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.success-message {
  margin-top: 12px;
  padding: 12px;
  background: #4caf50;
  color: white;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
}
</style>