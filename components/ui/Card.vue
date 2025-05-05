<template>
  <div :class="['card', className]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: ''
  }
});
</script>