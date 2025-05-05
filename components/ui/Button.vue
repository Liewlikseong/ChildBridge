<template>
  <component
    :is="to ? 'NuxtLink' : 'button'"
    :to="to"
    :type="type"
    :class="[
      'btn',
      variant === 'primary' && 'btn-primary',
      variant === 'secondary' && 'btn-secondary',
      variant === 'accent' && 'btn-accent',
      variant === 'outline' && 'btn-outline',
      className
    ]"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent', 'outline'].includes(value)
  },
  className: {
    type: String,
    default: ''
  },
  to: {
    type: [String, Object],
    default: null
  },
  type: {
    type: String,
    default: 'button'
  }
});

defineEmits(['click']);
</script>