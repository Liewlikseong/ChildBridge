<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-neutral-700 mb-1">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input"
      :class="[error && 'border-error-500 focus:ring-error-500']"
      v-bind="$attrs"
    />
    <p v-if="error" class="mt-1 text-sm text-error-600">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  error: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>