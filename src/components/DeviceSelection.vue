<template>
  <div class="device-selection">
    <h1>Конфигуратор устройств</h1>
    <p class="subtitle">Выберите устройство для сборки</p>
    
    <div class="devices-grid">
      <div 
        class="device-card"
        @click="selectDevice('pc')"
      >
        <div class="device-icon">🖥️</div>
        <div class="device-name">Персональный компьютер (ПК)</div>
        <div class="device-description">
          Соберите свой идеальный компьютер из совместимых компонентов
        </div>
        <div class="device-specs">
          <span>⚡ Процессор</span>
          <span>🎮 Видеокарта</span>
          <span>💾 Память</span>
        </div>
      </div>

      <!-- Заглушки для будущих устройств (пока disabled) -->
      <div class="device-card disabled">
        <div class="device-icon">🖧</div>
        <div class="device-name">Сервер</div>
        <div class="device-description">
          Скоро будет доступно
        </div>
      </div>

      <div class="device-card disabled">
        <div class="device-icon">💻</div>
        <div class="device-name">Ноутбук</div>
        <div class="device-description">
          Скоро будет доступно
        </div>
      </div>

      <div class="device-card disabled">
        <div class="device-icon">🖨️</div>
        <div class="device-name">Рабочая станция</div>
        <div class="device-description">
          Скоро будет доступно
        </div>
      </div>
    </div>

    <footer class="footer">
      <span class="version">Версия {{ appVersion }}</span>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['select-device'])

// Версия приложения из package.json (обновляется вручную при релизе)
const appVersion = ref('1.5.0')

const selectDevice = (deviceId) => {
  emit('select-device', deviceId)
}
</script>

<style scoped>
.device-selection {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 48px;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 20px;
}

.device-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  padding: 32px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.device-card:not(.disabled):hover {
  transform: translateY(-4px);
  border-color: #4caf50;
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.2);
}

.device-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.2);
}

.device-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.device-name {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 12px;
}

.device-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.device-specs {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.device-specs span {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 6px;
}

.footer {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.version {
  font-size: 12px;
  color: #999;
}
</style>