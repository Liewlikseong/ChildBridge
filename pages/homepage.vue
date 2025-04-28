<template>
  <section class="py-12">
    <div class="container-custom">
      <h1 class="text-4xl font-bold text-center text-primary-600 mb-8">
        Welcome to ChildBridge {{ counter }}
      </h1>
      <p class="text-center text-neutral-600 max-w-2xl mx-auto">
        Bridging kind hearts with orphans in need through the Jing Sun Welfare Society.
      </p>
      <button type="button" class="justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" @click="handleClick">Test</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const counter = ref(0);

const handleClick = () => {
  counter.value++;
  console.log("Clicked!", counter.value);
  alert("It works!");
};

onMounted(() => {
  console.log("Component mounted!");
});
</script>

