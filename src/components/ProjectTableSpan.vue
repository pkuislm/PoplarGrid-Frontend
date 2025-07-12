<template>
  <div class="project-table-span">
    <div style="display: flex; align-items: flex-start; gap: 3.5vh">
      <el-image
        style="min-width: 20vw; height: 60vh; flex-shrink: 0"
        :key="project.coverImage"
        :src="project.coverImage"
        :fit="contain"
        lazys
      ></el-image>
      <div
        style="
          width: 100%;
          height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 5%;
        "
      >
        <div style="width: 100%">
          <el-descriptions
            class="margin-top"
            :column="2"
            style="width: 100%"
            border
          >
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon><Aim /></el-icon>
                  图源
                </div>
              </template>
              {{ project.imageSource || "暂无" }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon><MagicStick /></el-icon>
                  美工
                </div>
              </template>
              {{ project.artist || "暂无" }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon><EditPen /></el-icon>
                  翻译
                </div>
              </template>
              {{ project.translator || "暂无" }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon><DocumentChecked /></el-icon>
                  校对
                </div>
              </template>
              {{ project.proofreader || "暂无" }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon><Stamp /></el-icon>
                  嵌字
                </div>
              </template>
              {{ project.typesetter || "暂无" }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon><CircleCheck /></el-icon>
                  审核
                </div>
              </template>
              {{ project.reviewer || "暂无" }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div style="height: 45%; width: 100%">
          <el-descriptions
            class="margin-top"
            :column="1"
            style="width: 100%"
            border
          >
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon><Flag /></el-icon>
                  创建时间
                </div>
              </template>
              {{ project.createdAt || "暂无" }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon><Edit /></el-icon>
                  最后更新时间
                </div>
              </template>
              {{ project.updatedAt || "暂无" }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Aim,
  MagicStick,
  EditPen,
  DocumentChecked,
  Stamp,
  CircleCheck,
} from "@element-plus/icons-vue";
import type { SyncedProject } from "@/types";

interface Props {
  project: SyncedProject;
}

defineProps<Props>();
</script>

<style scoped>
.project-table-span {
  padding: 16px 24px;
  background: #91a1ba;
  border-radius: 8px;
  margin: 8px 12px;
  border: 1px solid #e2e8f0;
  transform: translateY(-10px);
  opacity: 0;
  animation: expandIn 0.3s ease-out forwards;
}

@keyframes expandIn {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.cell-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #374151;
}

.dark .cell-item {
  color: #d1d5db;
}

/* 描述列表样式优化 */
:deep(.el-descriptions) {
  --el-descriptions-item-bordered-label-background: #f8fafc;
  --el-descriptions-item-bordered-content-background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark :deep(.el-descriptions) {
  --el-descriptions-item-bordered-label-background: #374151;
  --el-descriptions-item-bordered-content-background: #1f2937;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .project-table-span {
    padding: 12px 16px;
    margin: 4px 0;
  }
}
</style>
