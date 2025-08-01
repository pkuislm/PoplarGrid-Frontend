<template>
  <div class="space-y-6">
    <el-card style="width: 100%">
      <template #header>
        <div class="card-header">
          <span class="font-semibold text-xl">设置主题色</span>
        </div>
      </template>
      <div class="card-body">
        <div class="card-color">
          <div>
            <div class="flex gap-2 items-center font-semibold">
              <span>主题色1（所有项目） </span>
              <el-color-picker
                v-model="color_theme_1"
                size="large"
                @change="handleColorTheme1Change"
              />
            </div>
            <div class="flex gap-2 items-center font-semibold">
              <span>主题色2（我的项目） </span>
              <el-color-picker
                v-model="color_theme_2"
                size="large"
                @change="handleColorTheme2Change"
              />
            </div>
          </div>
          <div>
            <div class="flex gap-2 items-center font-semibold">
              <span>主题色3（翻译进度） </span>
              <el-color-picker
                v-model="color_theme_trans"
                size="large"
                @change="handleColorThemeTransChange"
              />
            </div>
            <div class="flex gap-2 items-center font-semibold">
              <span>主题色4（校对进度） </span>
              <el-color-picker
                v-model="color_theme_check"
                size="large"
                @change="handleColorThemeCheckChange"
              />
            </div>
          </div>
        </div>
        <span class="font-semibold text-red-500"
          >注意：在设置较浅的主题色时，可能会出现文字辨认不清的情况。</span
        >
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";

const color_theme_1 = ref<string | null>("");
const color_theme_2 = ref<string | null>("");
const color_theme_trans = ref<string | null>("");
const color_theme_check = ref<string | null>("");

const handleColorTheme1Change = (value: string) => {
  if (value) {
    localStorage.setItem("color-theme-1", value);
    ElMessage({
      message: "主题色1设置成功。",
      type: "success",
    });
  }
};

const handleColorTheme2Change = (value: string) => {
  if (value) {
    localStorage.setItem("color-theme-2", value);
    ElMessage({
      message: "主题色2设置成功。",
      type: "success",
    });
  }
};

const handleColorThemeTransChange = (value: string) => {
  if (value) {
    localStorage.setItem("color-theme-trans", value);
    ElMessage({
      message: "主题色3设置成功。",
      type: "success",
    });
  }
};

const handleColorThemeCheckChange = (value: string) => {
  if (value) {
    localStorage.setItem("color-theme-check", value);
    ElMessage({
      message: "主题色3设置成功。",
      type: "success",
    });
  }
};

onMounted(async () => {
  color_theme_1.value = localStorage.getItem("color-theme-1");
  color_theme_2.value = localStorage.getItem("color-theme-2");
  color_theme_trans.value = localStorage.getItem("color-theme-trans");
  color_theme_check.value = localStorage.getItem("color-theme-check");
});
</script>

<style scope>
.card-body {
  display: flex;
  flex-direction: column;
  gap: 2vh;
}

.card-color {
  display: flex;
  align-items: center;
  gap: 10vw;
}
</style>
