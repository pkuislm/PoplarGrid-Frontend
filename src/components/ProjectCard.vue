<template>
  <div 
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
    @click="viewProject"
  >
    <div class="flex">
      <!-- Left side - Project Image with Status Overlay -->
      <div class="w-32 flex-shrink-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
        <img
          v-if="project.coverImage"
          :src="project.coverImage"
          :alt="project.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
          </svg>
        </div>
        
        <!-- Status Badge Overlay -->
        <div class="absolute top-2 left-2">
          <el-tag :type="statusType" size="small" class="shadow-sm">
            {{ statusText }}
          </el-tag>
        </div>
      </div>

      <!-- Right side - Project Info and Progress -->
      <div class="flex-1 p-4 min-w-0 flex flex-col">
        <!-- Title and Edit Button Section -->
        <div class="mb-3">
          <div class="flex items-start justify-between gap-3 mb-2">
            <div class="flex-1 min-w-0">
              <div class="scrolling-title-container" :title="project.name">
                <h3 
                  ref="titleRef"
                  class="scrolling-title text-lg font-semibold text-gray-900 dark:text-white leading-tight mb-1"
                  :class="{ 'animate-scroll': shouldScroll }"
                >
                  {{ project.name }}
                </h3>
              </div>
            </div>
            
            <!-- Edit Button -->
            <div v-if="canEdit" class="flex-shrink-0" @click.stop>
              <el-button 
                size="small" 
                circle
                @click="editProject"
                class="!w-8 !h-8 !min-h-8"
                :icon="Edit"
              />
            </div>
          </div>
          
          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed" 
             v-if="project.description"
             :title="project.description">
            {{ project.description }}
          </p>
        </div>

        <!-- Progress Section -->
        <div class="space-y-2 flex-1">
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-700 dark:text-gray-300">翻译进度</span>
              <span class="font-medium">{{ project.progress.translation }}%</span>
            </div>
            <el-progress 
              :percentage="project.progress.translation" 
              :stroke-width="4"
              :show-text="false"
              color="#3b82f6"
            />
          </div>
          
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-700 dark:text-gray-300">校对进度</span>
              <span class="font-medium">{{ project.progress.proofreading }}%</span>
            </div>
            <el-progress 
              :percentage="project.progress.proofreading" 
              :stroke-width="4"
              :show-text="false"
              color="#10b981"
            />
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="flex justify-between items-center">
              <span class="text-gray-700 dark:text-gray-300">嵌字</span>
              <el-tag :type="typesettingTagType" size="small">
                {{ typesettingText }}
              </el-tag>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-gray-700 dark:text-gray-300">审核</span>
              <el-tag :type="reviewTagType" size="small">
                {{ reviewText }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- Footer Section -->
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span>{{ project.progress.completedSources }}/{{ project.progress.totalSources }} 源文本</span>
          <span>{{ formatDate(project.updatedAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Edit } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { Project } from '@/types'

interface Props {
  project: Project
}

const props = defineProps<Props>()
const router = useRouter()
const authStore = useAuthStore()

const titleRef = ref<HTMLElement>()
const shouldScroll = ref(false)

// 检查用户是否可以编辑项目
const canEdit = computed(() => {
  if (!authStore.user) return false
  
  // 管理员可以编辑所有项目
  if (authStore.user.isAdmin) return true
  
  // 项目创建者可以编辑自己的项目
  return authStore.user.id === props.project.ownerId
})

const statusType = computed(() => {
  switch (props.project.status) {
    case 'active': return 'success'
    case 'completed': return 'info'
    case 'paused': return 'warning'
    default: return 'info'
  }
})

const statusText = computed(() => {
  switch (props.project.status) {
    case 'active': return '进行中'
    case 'completed': return '已完成'
    case 'paused': return '已暂停'
    default: return '未知'
  }
})

const typesettingTagType = computed(() => {
  switch (props.project.progress.typesetting) {
    case 'not_started': return 'info'
    case 'in_progress': return 'warning'
    case 'completed': return 'success'
    default: return 'info'
  }
})

const typesettingText = computed(() => {
  switch (props.project.progress.typesetting) {
    case 'not_started': return '未嵌字'
    case 'in_progress': return '嵌字中'
    case 'completed': return '已完成嵌字'
    default: return '未知'
  }
})

const reviewTagType = computed(() => {
  switch (props.project.progress.review) {
    case 'not_reviewed': return 'info'
    case 'reviewing': return 'warning'
    case 'reviewed': return 'success'
    default: return 'info'
  }
})

const reviewText = computed(() => {
  switch (props.project.progress.review) {
    case 'not_reviewed': return '未审核'
    case 'reviewing': return '审核中'
    case 'reviewed': return '已审核'
    default: return '未知'
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const viewProject = () => {
  router.push(`/projects/${props.project.id}`)
}

const editProject = () => {
  // TODO: Implement edit functionality
  console.log('Edit project:', props.project.id)
}

const checkTitleOverflow = () => {
  nextTick(() => {
    if (titleRef.value) {
      const container = titleRef.value.parentElement
      if (container && titleRef.value.scrollWidth > container.clientWidth) {
        shouldScroll.value = true
      } else {
        shouldScroll.value = false
      }
    }
  })
}

onMounted(() => {
  checkTitleOverflow()
  
  // 监听窗口大小变化
  window.addEventListener('resize', checkTitleOverflow)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrolling-title-container {
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  width: 100%;
}

.scrolling-title {
  display: inline-block;
  white-space: nowrap;
  transition: transform 0.3s ease;
}

.scrolling-title.animate-scroll {
  animation: scroll-text 8s linear infinite;
}

.scrolling-title-container:hover .scrolling-title.animate-scroll {
  animation-play-state: paused;
}

@keyframes scroll-text {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(0);
  }
  75% {
    transform: translateX(calc(-100% + 100px));
  }
  100% {
    transform: translateX(calc(-100% + 100px));
  }
}

/* 确保在较小的容器中也能正常工作 */
@media (max-width: 768px) {
  @keyframes scroll-text {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(0);
    }
    75% {
      transform: translateX(calc(-100% + 80px));
    }
    100% {
      transform: translateX(calc(-100% + 80px));
    }
  }
}
</style>