<script setup lang="ts">

import SplitView from "@/components/SplitView.vue";
</script>

<template>
  <div class="w-full h-full bg-white">
    <split-view orientation="vertical">
      <template #first>
        <div class="w-full h-full relative"></div>
      </template>
      <template #second>
        <div class="w-full h-full relative"></div>
      </template>
    </split-view>
  </div>

</template>

<style scoped>

</style>