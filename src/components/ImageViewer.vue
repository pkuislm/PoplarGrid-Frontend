<template>
  <div ref="container" class="w-100vw h-100vh block bg-gray-500 fixed inset-0">
    <div class="translator-nav-back absolute top-[2vh] left-[2vh] z-50">
      <div class="flex bg-white/80 rounded overflow-hidden shadow-xl">
        <ToolTip content="返回">
          <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                  @click="() => {  }"
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
        <button class="px-[1vw] py-[0.8vw] text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                @click="() => { }"
        >
          <div>100/110</div>
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
    <MovableItem
        class="translator-nav-toolbar absolute z-50 bottom-[2vh] left-[2vh] justify-center items-center bg-white/80 rounded overflow-hidden shadow-xl"
    >
      <template #handle>
        <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
          <Rank/>
        </el-icon>
      </template>
      <ToolTip content="放大">
        <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                @click="() => { if(imageScale<5) imageScale+=0.1 }"
        >
          <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
            <ZoomIn/>
          </el-icon>
        </button>
      </ToolTip>
      <ToolTip content="缩小">
        <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                @click="() => { if(imageScale-0.1>0.1) imageScale-=0.1 }"
        >
          <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
            <ZoomOut/>
          </el-icon>
        </button>
      </ToolTip>
      <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            v-model.number="imageScale"
            class="accent-neutral-400 zoom-slider m-[1vw]"
        >
      <ToolTip content="重置图片位移">
        <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                @click="() => { imageX = imageY = 0 }"
        >
          <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
            <Refresh/>
          </el-icon>
        </button>
      </ToolTip>
      <ToolTip content="横向填充">
        <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                @click="() => { imageX = imageY = 0;imageScale=imageScaleByX }"
        >
          <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
            <ZoomIn/>
          </el-icon>
        </button>
      </ToolTip>
      <ToolTip content="纵向填充">
        <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                @click="() => { imageX = imageY = 0;imageScale=imageScaleByY }"
        >
          <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
            <ZoomIn/>
          </el-icon>
        </button>
      </ToolTip>
    </MovableItem>
    <div class="absolute inset-0 flex items-center justify-center">
      <MovableItem class="image-bg"
                   v-if="image"
                   @load="onLoad"
                   @click="processTagEvent($event)"
                   @contextmenu.prevent
                   v-model:scale="imageScale"
                   v-model:x="imageX"
                   v-model:y="imageY"
                   :zoom-enabled="true"
      >
        <template #handle>
          <img
              ref="imageElement"
              :src="props.imageUrl"
              class="inline max-w-none"
              alt="Image"
              @load="onImageLoad"
              draggable="false"
          />

        </template>
        <TranslationTag
            v-if="imageLoaded"
            :parent="imageElement"
            class="absolute"
            v-for="tag in props.initialMarks"
            :x="tag.x"
            :y="tag.y"
            :tag-type="tag.position_type"
            :text="tag.my_translation.content"
        ></TranslationTag>
      </MovableItem>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import MovableItem from "./MovableItem.vue"
import ToolTip from "./ToolTip.vue";
import {ArrowLeftBold, CaretLeft, CaretRight, Refresh, Tools, ZoomIn} from "@element-plus/icons-vue";
import TranslationTag from "@/components/TranslationTag.vue";

interface TranslationTag {
  id: string
  position_type: number

}

const props = defineProps({
  imageUrl: { type: String, required: true },
  initialMarks: { type: Array, default: () => [] } // 标记数组
})

const image = ref<string | null>(props.imageUrl)
const imageScale = ref(1)
const imageX = ref(0)
const imageY = ref(0)
const imageLoaded = ref(false)
let imageScaleByX = 1
let imageScaleByY = 1

// DOM 引用
const container = ref<HTMLDivElement>()
const imageElement = ref<HTMLImageElement>()
const onImageLoad = () => {
  nextTick(() => {
    const cont = container.value
    const image = imageElement.value

    if (!cont || !image) return
    const containerHeight = cont.offsetHeight
    const imageHeight = image.naturalHeight

    const containerWidth = cont.offsetWidth
    const imageWidth = image.naturalWidth

    imageScaleByY = containerHeight / imageHeight
    imageScaleByX = containerWidth / imageWidth
    imageScale.value = imageScaleByY
    imageLoaded.value = true
  })
}

const onLoad = () => {
}

const processTagEvent = (event: MouseEvent) =>{
  if (event.button === 0) {
    console.log(1)
  }
  else {
    console.log(2)
  }
}
</script>
<style>
</style>