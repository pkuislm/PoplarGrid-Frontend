<template>
  <div
      class="split-pane"
      ref="root"
      :class="orientationClass"
      :style="{ '--gutter': gutter + 'px' }"
  >
    <div class="pane first" :style="firstPaneStyle">
      <slot name="first"/>
    </div>

    <div
        class="gutter"
        role="separator"
        :aria-orientation="orientation"
        tabindex="0"
        @pointerdown="onPointerDown"
        @keydown="onKeyDown"
    />

    <div class="pane second" :style="secondPaneStyle">
      <slot name="second"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: number
  defaultRatio?: number
  minFirst?: number
  maxFirst?: number
  gutter?: number
  persistKey?: string | null
  orientation?: 'horizontal' | 'vertical'
}>(), {
  modelValue: undefined,
  defaultRatio: 0.35,
  minFirst: 0.1,
  maxFirst: 0.9,
  gutter: 4,
  persistKey: null,
  orientation: 'horizontal'
})

const emit = defineEmits(['update:modelValue', 'change'])

const root = ref<HTMLDivElement | null>(null)
const containerSize = ref(0)
const ratio = ref<number>(props.defaultRatio)

onMounted(() => {
  const stored = props.persistKey ? localStorage.getItem(keyName()) : null
  if (stored != null) {
    const v = clamp(parseFloat(stored), props.minFirst, props.maxFirst)
    ratio.value = Number.isFinite(v) ? v : props.defaultRatio
  } else if (typeof props.modelValue === 'number') {
    ratio.value = clamp(props.modelValue, props.minFirst, props.maxFirst)
  } else {
    ratio.value = clamp(props.defaultRatio, props.minFirst, props.maxFirst)
  }

  updateContainerSize()
  ro = new ResizeObserver(updateContainerSize)
  root.value && ro.observe(root.value)
})

let ro: ResizeObserver | null = null
onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
  removeGlobalListeners()
})

watch(() => props.modelValue, (v) => {
  if (typeof v === 'number' && dragging.value === false) {
    ratio.value = clamp(v, props.minFirst, props.maxFirst)
  }
})

watch(ratio, (v) => {
  persist(v)
  emit('update:modelValue', v)
  emit('change', v)
})

function keyName() {
  return `split-pane:${props.persistKey}`
}

function persist(v: number) {
  if (!props.persistKey) return
  try {
    localStorage.setItem(keyName(), String(v))
  } catch {
  }
}

function updateContainerSize() {
  if (!root.value) return
  const rect = root.value.getBoundingClientRect()
  containerSize.value = props.orientation === 'horizontal' ? rect.width : rect.height
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

const dragging = ref(false)
let startPos = 0
let startFirstSize = 0

const firstPaneSize = computed(() => Math.round(containerSize.value * ratio.value))
const secondPaneSize = computed(() => Math.round(containerSize.value * (1 - ratio.value)))
const firstPaneStyle = computed(() => {
  return props.orientation === 'horizontal'
      ? {width: firstPaneSize.value + 'px'}
      : {height: firstPaneSize.value + 'px'}
})
const secondPaneStyle = computed(() => {
  return props.orientation === 'horizontal'
      ? {width: secondPaneSize.value + 'px'}
      : {height: secondPaneStyle.value + 'px'}
})

const orientationClass = computed(() => props.orientation === 'vertical' ? 'vertical' : 'horizontal')

function onPointerDown(e: PointerEvent) {
  if (!root.value) return
      ;
  (e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  dragging.value = true
  startPos = props.orientation === 'horizontal' ? e.clientX : e.clientY
  startFirstSize = firstPaneSize.value
  addGlobalListeners()
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  const currentPos = props.orientation === 'horizontal' ? e.clientX : e.clientY
  const delta = currentPos - startPos
  const newSize = startFirstSize + delta
  const usableSize = Math.max(1, containerSize.value)
  const newRatio = clamp(newSize / usableSize, props.minFirst, props.maxFirst)
  ratio.value = newRatio
}

function onPointerUp() {
  dragging.value = false
  removeGlobalListeners()
}

function onKeyDown(e: KeyboardEvent) {
  const step = e.shiftKey ? 0.05 : 0.01
  if (props.orientation === 'horizontal') {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      ratio.value = clamp(ratio.value - step, props.minFirst, props.maxFirst)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      ratio.value = clamp(ratio.value + step, props.minFirst, props.maxFirst)
    }
  } else {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      ratio.value = clamp(ratio.value - step, props.minFirst, props.maxFirst)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      ratio.value = clamp(ratio.value + step, props.minFirst, props.maxFirst)
    }
  }
}

function addGlobalListeners() {
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function removeGlobalListeners() {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}
</script>

<style scoped>
.split-pane {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.split-pane.horizontal {
  flex-direction: row;
}

.split-pane.vertical {
  flex-direction: column;
}

.pane {
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

.gutter {
  background-clip: padding-box;
  position: relative;
}

.horizontal .gutter {
  width: var(--gutter);
  cursor: col-resize;
}

.vertical .gutter {
  height: var(--gutter);
  cursor: row-resize;
  width: 100%; /* 占满宽度，让竖向分隔条更长 */
}

.gutter::before {
  content: '';
  position: absolute;
  background: currentColor;
  opacity: 0.5;
}

.horizontal .gutter::before {
  top: 0;
  bottom: 0;
  left: calc(50% - 1px);
  width: 2px;
}

.vertical .gutter::before {
  left: 0;
  right: 0;
  top: calc(50% - 1px);
  height: 2px;
}

.gutter {
  color: #c9c9c9;
}

.gutter:hover, .gutter:focus-visible {
  color: #7c7c7c;
  outline: none;
}
</style>
