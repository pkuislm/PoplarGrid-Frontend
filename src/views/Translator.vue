<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="error" class="text-red-600">
    错误：{{ error }}
  </div>
  <div v-else>
    <ImageViewer :imageUrl="imageUrl" :initialMarks="markerData"/>
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