<template>
  <div class="space-y-6">
    <el-card style="width: 100%">
      <template #header>
        <div class="card-header">
          <span class="font-semibold text-xl">设置主题色</span>
        </div>
      </template>
      <div class="card-body">
        <div class="flex gap-2 items-center font-semibold">
          <span>主题色1（所有项目） </span>
          <el-color-picker v-model="color_theme_1" size="large" @change="handleColorTheme1Change"/>
        </div>
        <div class="flex gap-2 items-center font-semibold">
          <span>主题色2（我的项目） </span>
          <el-color-picker v-model="color_theme_2" size="large" @change="handleColorTheme2Change"/>
        </div>
        <span class="font-semibold text-red-500">注意：在设置较浅的主题色时，可能会出现文字辨认不清的情况。</span>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";

const color_theme_1 = ref<string | null>("");
const color_theme_2 = ref<string | null>("");

const handleColorTheme1Change = (value: string) => {
  if (value) {
    localStorage.setItem("color-theme-1", value);
  } else {
    localStorage.seteItem("color-theme-1", "#3b82f6");
  }

  ElMessage({
    message: '主题色1设置成功。',
    type: 'success',
  });
}

const handleColorTheme2Change = (value: string) => {
  if (value) {
    localStorage.setItem("color-theme-2", value);
  } else {
    localStorage.seteItem("color-theme-2", "#fa5555");
  }

  ElMessage({
    message: '主题色2设置成功。',
    type: 'success',
  });
}

onMounted(async () => {
  color_theme_1.value = localStorage.getItem("color-theme-1");
  color_theme_2.value = localStorage.getItem("color-theme-2");
});
</script>

<style scope>
.card-body {
  display: flex;
  flex-direction: column;
  gap: 2vh;
}
</style>
