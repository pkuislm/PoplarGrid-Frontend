<template>
  <div ref="container" class="w-100vw h-100vh block bg-gray-500 fixed inset-0">
    <div class="absolute inset-0 flex top-0 left-0 items-stretch"
         :style="{ width:`${viewerRect.width}px`, height:`${viewerRect.height}px` }"
    >
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
      <div class="translator-nav-toolbar absolute z-50 bottom-[2vh] left-[2vh] flex bg-white/80 rounded shadow-xl"
           :style="transformStyle"
           @mouseenter="toolbarMouseEnter"
           @mouseleave="toolbarMouseLeave"
      >
        <div
            ref="floatBarHandle"
            :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        >
          <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
            <Rank/>
          </el-icon>
        </div>
        <div class="translator-nav-toolbar-scalable flex" :class="{expanded:isToolbarActive}">
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
                    @click="imageElement.resetPosition"
            >
              <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
                <Refresh/>
              </el-icon>
            </button>
          </ToolTip>
          <ToolTip content="横向填充">
            <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                    @click="imageElement.resetScaleByX"
            >
              <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
                <ZoomIn/>
              </el-icon>
            </button>
          </ToolTip>
          <ToolTip content="纵向填充">
            <button class="text-gray-800 hover:bg-gray-600/50 active:text-gray-300 transition-colors"
                    @click="imageElement.resetScaleByY"
            >
              <el-icon class="text-gray-600 align-middle flex m-[1vw]" size="2vw">
                <ZoomIn/>
              </el-icon>
            </button>
          </ToolTip>
        </div>
      </div>
      <TranslatorImage ref="imageElement"
                       :src="props.imageUrl"
                       v-model:scale="imageScale"
                       @imageLoaded="(w: number, h: number) => { imageWidth = w; imageHeight = h; imageLoaded = true }"
      >
        <template #default="{ scale, imageWidth, imageHeight }">
          <TranslationTag v-if="imageLoaded"
                          class="absolute"
                          v-for="tag in props.initialMarks"
                          :id="tag.id"
                          :x="tag.x"
                          :y="tag.y"
                          :w="imageWidth"
                          :h="imageHeight"
                          :scale="scale"
                          :position-type="tag.positionType"
                          :content="tag.myTranslation.content"
          ></TranslationTag>
        </template>
      </TranslatorImage>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import ToolTip from "./ToolTip.vue"
import {ArrowLeftBold, CaretLeft, CaretRight, Refresh, Tools, ZoomIn} from "@element-plus/icons-vue"
import TranslationTag from "./TranslationTag.vue";
import TranslatorImage from "@/components/TranslatorImage.vue";
import {useMovable} from "@/utils/movable.ts";
import {Source} from "@/types";

function debounce(fn: any, delay: number) {
  let timer: any
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)
const imageWidth = ref(0)
const imageHeight = ref(0)
const imageScale = ref(1)

const sourceListWidth = 400;
const sourceListHeightMobile = 200;

const updateSize = debounce(() => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}, 100)

const floatBarHandle = ref(null)
const {transformStyle, isDragging} = useMovable(floatBarHandle)

onMounted(() => {
  window.addEventListener('resize', updateSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize)
})

const viewerRect = computed(() => ({
  width: windowWidth.value - sourceListWidth,
  height: windowHeight.value
}))

const isToolbarActive = ref(false)
let toolbarTimer: any = null
const toolbarMouseEnter = () => {
  isToolbarActive.value = true
  if(toolbarTimer) {
    clearTimeout(toolbarTimer)
    toolbarTimer = null
  }
}

const toolbarMouseLeave = () => {
  toolbarTimer = setTimeout(() => {
    isToolbarActive.value = false
    toolbarTimer = null
  }, 200)
}

const props = defineProps({
  imageUrl: {type: String, required: true},
  initialMarks: {type: Array<Source>, default: () => []} // 标记数组
})

const imageLoaded = ref(false)

// DOM 引用
const container = ref<HTMLDivElement>()
const imageElement = ref()

const processTagEvent = (event: MouseEvent) => {
  if (event.button === 0) {
    console.log(1)
  } else {
    console.log(2)
  }
}
</script>
<style scoped>
.translator-nav-toolbar-scalable {
  overflow: hidden;
  max-width: 0;
  transition: max-width 0.5s ease-in-out;
}

.translator-nav-toolbar-scalable.expanded {
  max-width: 1000px;
  transition: max-width 0.5s ease-in-out;
}
</style>