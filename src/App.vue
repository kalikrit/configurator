<template>
  <div class="app">
    <DeviceSelection 
      v-if="!deviceInitialized" 
      @select-device="initDevice"
    />
    <div v-else class="configurator-layout">
      <LeftPanel />
      <RightPanel />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBuildStore } from './stores/buildStore'
import DeviceSelection from './components/DeviceSelection.vue'
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'

const buildStore = useBuildStore()
const deviceInitialized = ref(false)

const initDevice = (deviceId) => {
  const success = buildStore.initDevice(deviceId)
  if (success) {
    deviceInitialized.value = true
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #f5f5f5;
}

.app {
  height: 100vh;
  overflow: hidden;
}

.configurator-layout {
  display: flex;
  height: 100%;
  width: 100%;
}
</style>