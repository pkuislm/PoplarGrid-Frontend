<template>
  <span ref="tooltipRef">
    <slot />
  </span>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale-subtle.css';

const props = defineProps({
  content: { type: [String, Object], required: true },
  arrow: { type:[String, Boolean], default:true },
  placement: { type: String, default: 'auto' },
  animation: { type: String, default: 'scale-subtle' },
  theme: { type: String, default: 'translucent' },
  trigger: { type: String, default: 'mouseenter focus' },
  allowHTML: { type: Boolean, default: true }
})

const tooltipRef = ref(null)
let instance = null

onMounted(() => {
  createTooltip()
})

onBeforeUnmount(() => {
  if (instance) instance.destroy()
})

watch(() => props.content, (newVal) => {
  if (instance) {
    instance.setContent(newVal)
  }
})

function createTooltip() {
  if (tooltipRef.value) {
    instance = tippy(tooltipRef.value, {
      content: props.content,
      placement: props.placement,
      animation: props.animation,
      theme: props.theme,
      trigger: props.trigger,
      allowHTML: props.allowHTML,
      offset:[0, 20],
      duration:[0, 100]
    })
  }
}
</script>
