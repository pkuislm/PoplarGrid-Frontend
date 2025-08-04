<script lang="ts" setup>
import ToolTip from "@/components/ToolTip.vue";
import {computed, ref, watch} from "vue";
import {useMovable} from "@/utils/movable.ts";

const props = defineProps({
  x: {type: Number, required: true},
  y: {type: Number, required: true},
  w: {type: Number, required: true},
  h: {type: Number, required: true},
  id: {type: String, required: true},
  index: {type: Number, default: 0},
  scale: {type: Number, default: 1},
  status: {type: String, default: 'pending'},
  positionType: {type: Number, default: 0},
  allowMove: {type: Boolean, default: true},
  active: {type: Boolean, default: false},
  focus: {type: Boolean, default: false},
  content: String,
  styleTransition: {type: String, default: 'none'},
  direction: {type: String, default: 'ltr'},
  writingMode: {type: String, default: 'vertical-rl'},
  originDirection: {type: String, default: 'ltr'},
  originWritingMode: {type: String, default: 'vertical-rl'},
  className: String,
})
const emit = defineEmits(['click', 'drag'])
const tipText = ref(props.content)
watch(() => props.content, (newVal) => {
  tipText.value = newVal
})
const myScale = computed(() => 1 / props.scale)
const handleElem = ref()
const {transform, isDragging} = useMovable(handleElem, {
  initialX: props.x,
  initialY: props.y,
  accelerateFactor: myScale,
  transformOrigin: "bottom",
  click: (e: MouseEvent) => emit('click', props.id, e),
  drag: (e: MouseEvent, x: number, y: number) => emit('drag', props.id, e, x, y),
  constraints: {
    minX: 0,
    maxX: props.w,
    minY: 0,
    maxY: props.h
  }
})
const active = ref(false)
const isMobile = ref(false)
const backgroundRGB = computed(() => {
  if (props.positionType === 2) {
    return '255, 213, 131'; // 黄色
  }
  return '255, 150, 156'; // 粉色
})
// 计算小箭头指向点的偏移，使小箭头的尖角为指向点
const arrowWidth = computed(() => {
  if (active) {
    return 8 * 1.4;
  }
  return 8; // 等腰三角形的底边
})
const arrowHeight = computed(() => {
  if (active) {
    return 5 * 1.4;
  }
  return 5; // 等腰三角形的高
})
const numberSize = 29; // 数字圆圈的直径
const numberTop = computed(() => {
  if (isMobile) {
    return -32;// 手机版数字圆圈距离更远，以免小箭头被手挡住
  }
  return -16; // 数字圆圈的偏移
});
/*let numberLeft = 0;
let arrowTransform = 'translate(-50%, -100%)'; // 小箭头的偏移
if (writingMode === 'horizontal-tb') {
  if (direction === 'ltr') {
    arrowTransform = 'translate(-100%, -50%)';
    numberLeft = -arrowHeight / 2;
  } else if (direction === 'rtl') {
    arrowTransform = 'translate(0, -50%)';
    numberLeft = arrowHeight / 2;
  }
}*/
const numberBorderSize = 2;

const savingStatuses = ['saving', 'syncing', 'uploading'] // 对应原来的 labelSavingStatuses

const saving = computed(() => savingStatuses.includes(props.status))
// 样式类和动态 style
const rootClasses = computed(() => [
  'Label',
  {
    'Label--focus': props.focus,
    'Label--active': props.active,
    'Label--saving': saving.value,
  },
])

const rootStyle = computed(() => ({
  transform: `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${transform.x}, ${transform.y}`,
  transformOrigin: 'bottom',
  transition: props.styleTransition,
}))

// 箭头方向
const arrowClass = computed(() => {
  const base = 'Label__Arrow'
  if (props.writingMode.startsWith('vertical')) return [base, 'Label__Arrow--bottom']
  if (props.writingMode === 'horizontal-tb') {
    return [
      base,
      props.direction === 'ltr' ? 'Label__Arrow--right' : 'Label__Arrow--left',
    ]
  }
  return [base]
})
</script>

<template>
  <div :style="rootStyle"
       class="absolute flex top-0 left-0"
  >
    <div
        :class="rootClasses"
        :style="{
          transform:`scale(${myScale}) translateZ(0)`,
          transformOrigin: `bottom`,
          transition: 'none'
        }"
        @contextmenu.prevent
    >
      <div class="Label__FocusRing"/>
      <ToolTip :content="tipText" placement="right" :arrow="false" :offset="[-30, 25]">
        <div class="Label__Number" ref="handleElem" @contextmenu.prevent>
          {{ index }}
        </div>
      </ToolTip>
      <div :class="arrowClass"/>
      <div class="Label__Spin" v-if="saving">
        <div/>
      </div>
      <div class="Label__ContentWrapper">
      </div>
    </div>
  </div>
</template>

<style scoped>
.Label {
}

@keyframes focus-ring-animate {
  0% {
    opacity: 0;
    transform: scale(2.5);
    border-width: 1.8px;
  }
  10% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
    transform: scale(1);
    border-width: 2px;
  }
}

.Label__ContentWrapper {
  display: none;
  position: absolute;
  top: -60px;
  left: 36px;
  width: 220px;
}

.Label__Content {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  padding: 3px 5px;
  white-space: pre-wrap;
  word-break: break-word;
}

.Label__Content--empty {
  color: #999;
}

.Label__FocusRing {
  display: none;
  position: absolute;
  pointer-events: none;
  border: 1.8px solid rgb(v-bind('backgroundRGB'));
  width: 29px;
  height: 29px;
  top: -45px;
  left: -14.5px;
  border-radius: 50%;
  animation: focus-ring-animate 2s linear infinite normal;
}

.Label--focus .Label__Number {
  top: -16px;
  background-color: rgba(v-bind('backgroundRGB'), 1);
  border: 2px solid #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.Label--focus .Label__FocusRing {
  display: block;
}

.Label__Number {
  position: absolute;
  top: -16px;
  left: 0;
  transform: translate(-50%, -100%);
  width: 29px;
  height: 29px;
  line-height: 29px;
  border-radius: 50%;
  background-color: rgba(v-bind('backgroundRGB'), 0.7);
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  cursor: pointer;
}

.Label__Arrow {
  position: absolute;
  top: -4px;
  left: -4px;
}

.Label__Arrow--bottom {
  border-style: solid;
  border-width: 5px 4px 0 4px;
  border-color: #1890ff transparent transparent transparent;
}

.Label__Arrow--left {
  border-style: solid;
  border-width: 4px 5px 4px 0;
  border-color: transparent #1890ff transparent transparent;
}

.Label__Arrow--right {
  border-style: solid;
  border-width: 4px 0 4px 5px;
  border-color: transparent transparent transparent #1890ff;
}

.Label__Spin {
  display: none;
  position: absolute;
  left: -9px;
  top: -12px;
}

.Label--saving .Label__Spin {
  display: block;
}

@media (pointer: fine) {
  .Label:hover .Label__Number {
    top: -16px;
    background-color: rgba(v-bind('backgroundRGB'), 1);
    border: 2px solid #fff;
  }

  .Label:hover .Label__ContentWrapper {
    display: flex;
  }
}
</style>