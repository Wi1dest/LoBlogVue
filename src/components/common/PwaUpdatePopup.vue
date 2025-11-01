<template>
  <transition name="slide-fade">
    <div v-if="refreshing || updateAvailable" class="pwa-update-popup">
      <div class="pwa-update-content">
        <div class="pwa-update-header">
          <h3>新版本可用</h3>
          <span class="close-btn" @click="dismissUpdate" v-if="!refreshing">&times;</span>
        </div>
        <div class="pwa-update-body">
          <div class="update-icon">
            <i class="el-icon-refresh"></i>
          </div>
          <p>发现新版本，请刷新页面以使用最新功能和修复。</p>
        </div>
        <div class="pwa-update-footer">
          <button 
            @click="refreshApp" 
            :disabled="refreshing" 
            class="refresh-btn"
          >
            <span v-if="refreshing" class="loading-spinner"></span>
            {{ refreshing ? '正在刷新...' : '立即刷新' }}
          </button>
          <button 
            @click="dismissUpdate" 
            v-if="!refreshing" 
            class="later-btn"
          >
            稍后提醒
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PwaUpdatePopup',
  data() {
    return {
      updateAvailable: false,
      refreshing: false,
      registration: null,
      dismissCount: 0
    }
  },
  created() {
    // 监听service worker更新事件
    document.addEventListener('swUpdated', this.handleSwUpdate, { once: false })
    window.addEventListener('swUpdated', this.handleSwUpdate, { once: false })
    
    // 如果已经存在更新，立即显示弹窗
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return
      this.refreshing = true
      window.location.reload()
    })
    
    // 检查是否有被推迟的更新
    this.checkDeferredUpdate()
  },
  methods: {
    handleSwUpdate(event) {
      this.registration = event.detail
      this.updateAvailable = true
    },
    showUpdatePopup() {
      this.updateAvailable = true
    },
    refreshApp() {
      this.refreshing = true
      
      // 清除推迟更新的记录
      localStorage.removeItem('pwaUpdateDeferred')
      
      if (this.registration && this.registration.waiting) {
        // 通知 SW 跳过等待
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      } else {
        // 如果没有registration对象，直接刷新页面
        window.location.reload()
      }
    },
    dismissUpdate() {
      this.updateAvailable = false
      this.dismissCount++
      
      // 记录推迟更新的时间
      const now = new Date().getTime()
      localStorage.setItem('pwaUpdateDeferred', now)
      
      // 如果用户多次推迟，缩短提醒间隔
      const remindDelay = Math.max(30 - (this.dismissCount * 5), 5) // 最少5分钟，最多30分钟
      
      // 设置定时器，稍后再次提醒
      setTimeout(() => {
        this.updateAvailable = true
      }, remindDelay * 60 * 1000) // 转换为毫秒
    },
    checkDeferredUpdate() {
      const deferredTime = localStorage.getItem('pwaUpdateDeferred')
      if (deferredTime) {
        const now = new Date().getTime()
        const elapsed = (now - deferredTime) / (60 * 1000) // 转换为分钟
        
        // 如果已经过了30分钟，再次显示更新提示
        if (elapsed > 30) {
          this.updateAvailable = true
          localStorage.removeItem('pwaUpdateDeferred')
        } else {
          // 否则，设置定时器在剩余时间后显示
          setTimeout(() => {
            this.updateAvailable = true
          }, (30 - elapsed) * 60 * 1000)
        }
      }
    }
  }
}
</script>

<style scoped>
/* 弹窗动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.pwa-update-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  z-index: 9999;
  max-width: 320px;
  overflow: hidden;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  50% {
    box-shadow: 0 4px 20px rgba(64, 158, 255, 0.4);
  }
  100% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.pwa-update-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f8f8;
}

.pwa-update-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.close-btn {
  cursor: pointer;
  font-size: 20px;
  color: #909399;
}

.close-btn:hover {
  color: #606266;
}

.pwa-update-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.update-icon {
  font-size: 36px;
  color: #409EFF;
  margin-bottom: 12px;
}

.pwa-update-body p {
  margin: 0;
  text-align: center;
  color: #606266;
  line-height: 1.5;
}

.pwa-update-footer {
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  justify-content: space-between;
}

.refresh-btn {
  background-color: #409EFF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  flex: 1;
  margin-right: 8px;
  position: relative;
}

.refresh-btn:hover {
  background-color: #66b1ff;
}

.refresh-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.later-btn {
  background-color: #f0f0f0;
  color: #606266;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.later-btn:hover {
  background-color: #e6e6e6;
}

/* 加载动画 */
.loading-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 6px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
