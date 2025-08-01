<template>
  <div 
    class="file-card"
    @click="handleCardClick"
  >
    <!-- 图片区域 -->
    <div class="image-container">
      <el-image
        class="card-image"
        :src="file.coverUrl"
        fit="cover"
        lazy
      >
        <template #error>
          <div class="image-error">
            <el-icon size="24"><Picture /></el-icon>
            <span>加载失败</span>
          </div>
        </template>
      </el-image>
      <!-- 悬停遮罩 -->
      <div class="hover-overlay">
        <el-icon size="20"><View /></el-icon>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 统计信息 -->
      <div class="stats-row">
        <div class="stat-item">
          <el-icon><CollectionTag /></el-icon>
          <span>{{ file.sourceCount }}</span>
        </div>
        <div class="stat-item">
          <el-icon><EditPen /></el-icon>
          <span>{{ file.translatedSourceCount }}</span>
        </div>
        <div class="stat-item">
          <el-icon><Select /></el-icon>
          <span>{{ file.checkedSourceCount }}</span>
        </div>
      </div>

      <!-- 双层进度条 -->
      <div class="progress-container">
        <!-- 底层进度条 (翻译进度) -->
        <div class="progress-bar progress-translate">
          <div 
            class="progress-fill translate-fill"
            :style="{ width: translateProgress + '%', background: color_theme_trans }"
          ></div>
        </div>
        <!-- 上层进度条 (检查进度) -->
        <div class="progress-bar progress-check">
          <div 
            class="progress-fill check-fill"
            :style="{ width: checkProgress + '%', background: color_theme_check }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProjectFile } from "@/types";
import { computed } from "vue";
import { Picture, CollectionTag, EditPen, Select, View } from '@element-plus/icons-vue';

interface Props {
  file: ProjectFile;
  color_theme_trans: string;
  color_theme_check: string;
}

const props = defineProps<Props>();

// 计算翻译进度百分比
const translateProgress = computed(() => {
  if (props.file.sourceCount === 0) return 0;
  return (props.file.translatedSourceCount / props.file.sourceCount) * 100;
});

// 计算校对进度百分比
const checkProgress = computed(() => {
  if (props.file.sourceCount === 0) return 0;
  return (props.file.checkedSourceCount / props.file.sourceCount) * 100;
});

const emit = defineEmits<{
  cardClick: [file: ProjectFile];
}>();

const handleCardClick = () => {
  emit('cardClick', props.file);
};
</script>

<style scoped>
.file-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
  position: relative;
}

.file-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border-color: #000000;
}

.file-card:active {
  transform: translateY(-2px) scale(1.01);
  transition: transform 0.1s ease;
}

.image-container {
  position: relative;
  height: 140px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.file-card:hover .card-image {
  transform: scale(1.05);
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 11px;
  gap: 6px;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.file-card:hover .hover-overlay {
  opacity: 1;
}

.content-area {
  padding: 12px 16px 5px 16px;
  background: #ffffff;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 4px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #606266;
  font-weight: 500;
  transition: color 0.2s ease;
}

.stat-item .el-icon {
  font-size: 13px;
  transition: transform 0.2s ease;
}

.file-card:hover .stat-item .el-icon {
  transform: scale(1.1);
}

.progress-container {
  position: relative;
  height: 16px;
}

.progress-bar {
  position: absolute;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.progress-translate {
  top: 0;
  background-color: #e8f4fd;
}

.progress-check {
  top: 0;
  background-color: transparent;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  position: relative;
}

.translate-fill {
  box-shadow: 0 2px 4px rgba(103, 194, 58, 0.3);
}

.check-fill {
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
}

.file-card:hover .progress-text {
  opacity: 1;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .image-container {
    height: 130px;
  }
  
  .stats-row {
    margin-bottom: 10px;
  }
  
  .stat-item {
    font-size: 11px;
  }
  
  .content-area {
    padding: 10px 14px 12px;
  }
  
  .progress-text {
    font-size: 9px;
  }
}
</style>