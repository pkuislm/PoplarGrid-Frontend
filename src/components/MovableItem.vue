<script setup lang="ts">
import {ref, reactive, watch, computed, nextTick, onMounted, inject, provide, toRef} from "vue";

interface Position {
  x: number
  y: number
}

type PivotType = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

const props = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  scale: { type: Number, default: 1 },
  zoomEnabled: { type: Boolean, default: false },
  constrainToParent: { type: Boolean, default: false },
  pivot: { type: String as () => PivotType, default: 'center' },
  parent: { type: [HTMLElement, null], default: null }
})
const emit = defineEmits(['update:scale', 'update:x', 'update:y', 'zoom', 'click'])

const pos = reactive<Position>({ x: props.x, y: props.y })
const isDragging = ref(false)
const isMoved = ref(false)
const container = ref(null)
const parentContainer = ref(props.parent)
const scale = ref(props.scale)

// 计算pivot偏移量
const pivotOffset = computed(() => {
  if (!container.value) return { x: 0, y: 0 }

  const rect = container.value.getBoundingClientRect()
  const width = rect.width
  const height = rect.height

  const offsets = {
    'top-left': { x: 0, y: 0 },
    'top-center': { x: width / 2, y: 0 },
    'top-right': { x: width, y: 0 },
    'center-left': { x: 0, y: height / 2 },
    'center': { x: width / 2, y: height / 2 },
    'center-right': { x: width, y: height / 2 },
    'bottom-left': { x: 0, y: height },
    'bottom-center': { x: width / 2, y: height },
    'bottom-right': { x: width, y: height }
  }

  return offsets[props.pivot] || offsets.center
})

// 获取约束边界
const getConstraints = computed(() => {
  if (!props.constrainToParent || !container.value || !parentContainer.value) {
    return null
  }

  const contentRect = container.value.getBoundingClientRect()
  const contentHeight = contentRect.height/2;
  const contentWidth = contentRect.width/2;

  const parentRect = parentContainer.value.getBoundingClientRect()
  console.log("ParentSize:", parentRect.width, parentRect.height)
  const offsetHeight = parentRect.height/2;
  const offsetWidth = parentRect.width/2;

  // 使用pivot计算最终的限制范围
  const pivot = pivotOffset.value

  const pivotX = pivot.x - contentWidth
  const pivotY = pivot.y - contentHeight

  return {
    minX: -offsetWidth - pivotX,
    maxX: offsetWidth - pivotX,
    minY: -offsetHeight - pivotY,
    maxY: offsetHeight - pivotY
  }
})

// 应用约束
const applyConstraints = (newPos: Position): Position => {
  const constraints = getConstraints.value
  if (!constraints) return newPos

  return {
    x: Math.max(constraints.minX, Math.min(constraints.maxX, newPos.x)),
    y: Math.max(constraints.minY, Math.min(constraints.maxY, newPos.y))
  }
}

function onTransformChanged() {
  // 缩放时重新应用约束
  if (props.constrainToParent) {
    const constrainedPos = applyConstraints(pos)
    pos.x = constrainedPos.x
    pos.y = constrainedPos.y
  }
  emit('update:x', pos.x)
  emit('update:y', pos.y)
}

watch(() => props.scale, (newVal) => {
  scale.value = newVal
})

watch(() => props.x, (newVal) => {
  pos.x = newVal
  nextTick(onTransformChanged)
})

watch(() => props.y, (newVal) => {
  pos.y = newVal
  nextTick(onTransformChanged)
})

function onMouseDown(e) {
  isDragging.value = true
  isMoved.value = false
  e.preventDefault()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e) {
  if (!isDragging.value) return
  isMoved.value = true
  pos.x += e.movementX
  pos.y += e.movementY
  onTransformChanged()
}

function onMouseUp(e: MouseEvent) {
  isDragging.value = false
  if(!isMoved.value) {
    emit('click', e)
  }
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

function onWheel(e: WheelEvent) {
  if (!props.zoomEnabled || !container.value) return
  e.preventDefault()

  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const newScale = Math.max(0.1, Math.min(5, scale.value + delta))

  if (newScale === scale.value) return

  const containerRect = container.value.getBoundingClientRect()
  const mouseX = e.clientX - containerRect.left
  const mouseY = e.clientY - containerRect.top

  const beforeX = (mouseX - containerRect.width / 2 - pos.x) / scale.value
  const beforeY = (mouseY - containerRect.height / 2 - pos.y) / scale.value

  const afterX = beforeX * scale.value
  const afterY = beforeY * scale.value

  pos.x = mouseX - containerRect.width / 2 - afterX
  pos.y = mouseY - containerRect.height / 2 - afterY

  scale.value = newScale
  emit('update:scale', scale.value)
  emit('zoom', newScale)
  onTransformChanged()
}

onMounted(() => {
  if(!parentContainer.value) {
  parentContainer.value = container.value.parentElement
    console.log(parentContainer.value)
}
  onTransformChanged()
})

const onLoad = () => {

}
</script>

<template>
  <div class="inline-flex"
    ref="container"
    :style="{
        transform: `matrix(${scale}, 0, 0, ${scale}, ${pos.x}, ${pos.y})`,
        transformOrigin: 'center center',
        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
      }"
    @wheel="onWheel"
    @load="onLoad"
    draggable="false"
  >
    <div
        :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        @mousedown="onMouseDown"
    >
      <slot name="handle"></slot>
    </div>
    <slot />
  </div>
</template>