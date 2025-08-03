<script setup lang="ts">
import MovableItem from "./MovableItem.vue";
import ToolTip from "./ToolTip.vue";
import {computed, inject, provide, ref, toRef, watch} from "vue";
import {Close, Watch} from "@element-plus/icons-vue";

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  tagType: { type: Number, required: true },
  text: { type: [String, null], default: '[无翻译]' },
  parent: { type: [HTMLElement, null], default: null }
})

const posX = ref(0)
const posY = ref(0)
const tipText = ref(props.text)
watch(() => props.text, (newVal)=>{
  tipText.value = newVal
})
</script>

<template>

  <MovableItem
      v-model:x="posX"
      v-model:y="posY"
      :constrain-to-parent="true"
      pivot="bottom-center"
      :parent="parent"
  >
    <template #handle>
        <ToolTip :content="tipText" placement="right">
        <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
          <Close/>
        </el-icon>
      </ToolTip>
    </template>

  </MovableItem>
</template>

<style scoped>

</style>