<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="error" class="text-red-600">
    错误：{{ error }}
  </div>
  <div v-else>
    <div ref="container" class="w-100vw h-100vh block bg-gray-500 fixed inset-0">
      <div class="absolute inset-0 flex top-0 left-0 items-stretch">
        <div class="translator-nav-back absolute top-[2vh] left-[2vh] z-50">
          <div class="flex bg-white/80 rounded overflow-hidden shadow-xl">
            <ToolTip content="返回">
              <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                      @click="goBack"
              >
                <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
                  <ArrowLeftBold/>
                </el-icon>
              </button>
            </ToolTip>
            <ToolTip content="设置">
              <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                      @click="() => {  }"
              >
                <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
                  <Tools/>
                </el-icon>
              </button>
            </ToolTip>
          </div>
        </div>
        <div class="translator-nav-page absolute top-[2vh] right-[2vh] z-50">
          <div class="flex bg-white/80 rounded overflow-hidden shadow-xl">
            <ToolTip content="上一页">
              <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                      @click="() => {  }"
              >
                <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
                  <CaretLeft/>
                </el-icon>
              </button>
            </ToolTip>
            <button
                class="px-[1vw] py-[0.8vw] text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                @click="() => { }"
            >
              100/110
            </button>
            <ToolTip content="下一页">
              <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                      @click="() => {  }"
              >
                <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
                  <CaretRight/>
                </el-icon>
              </button>
            </ToolTip>
          </div>
        </div>
        <ImageViewer :imageUrl="imageUrl" :initialMarks="markerData"/>
      </div>
    </div>
  </div>
</template>
<style>
.header-navigator {
  display: none;
}

main {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

.text-red-600 {
  color: #dc2626;
}
</style>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import ImageViewer from "@/components/ImageViewer.vue";
import {ArrowLeftBold, CaretLeft, CaretRight, Tools} from "@element-plus/icons-vue";
import ToolTip from "@/components/ToolTip.vue";

const route = useRoute()
const router = useRouter()

const projectId = computed(() => route.params.projectId as string)
const fileId = computed(() => route.params.fileId as string)
const targetId = '687e219c77c1d93171a969f3'//zh-CN
const apiUrl = 'https://api.moetran.com'
const authToken = ''

const markerData = ref()
const imageUrl = ref()
const error = ref<string | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    //https://api.moetran.com/v1/files/687e21b977c1d93171a969fc?target=687e219c77c1d93171a969f3
    const fileInfoParams = new URLSearchParams({
      target: targetId,
    })
    const fileRes = await fetch(apiUrl + `/v1/files/${fileId.value}?${fileInfoParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    if (!fileRes.ok) {
      const contentType = fileRes.headers.get('Content-Type') || ''
      let message = `请求失败（${fileRes.status}）`

      if (contentType.includes('application/json')) {
        const errJson = await fileRes.json()
        if (errJson.message) message = errJson.message
      } else {
        const errText = await fileRes.text()
        if (errText) message = errText
      }

      throw new Error(message)
    }
    const fileInfo = await fileRes.json()
    imageUrl.value = fileInfo['url'].replace('c01.m-t.pics', 'oss.maloutran.top')

    //https://api.moetran.com/v1/files/687e21b977c1d93171a969fc/sources?target_id=687e219c77c1d93171a969f3&paging=false
    const targetParams = new URLSearchParams({
      target_id: targetId,
      paging: 'false'
    })
    const targetRes = await fetch(apiUrl + `/v1/files/${fileId.value}/sources?${targetParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    if (!fileRes.ok) {
      const contentType = fileRes.headers.get('Content-Type') || ''
      let message = `请求失败（${fileRes.status}）`

      if (contentType.includes('application/json')) {
        const errJson = await fileRes.json()
        if (errJson.message) message = errJson.message
      } else {
        const errText = await fileRes.text()
        if (errText) message = errText
      }

      throw new Error(message)
    }
    markerData.value = await targetRes.json()
  } catch (err: any) {
    error.value = err.message || '未知错误'
  } finally {
    loading.value = false
  }
})

const goBack = () => {
  router.push(`/projects/${projectId.value}`)
}
</script>