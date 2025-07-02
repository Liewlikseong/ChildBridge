<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Staff Dashboard</h1>
    <p>Welcome to the staff dashboard. Here you can find tools and information relevant to your role.</p>
    <!-- Staff-specific content and links can be added here -->
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'staff',
  middleware: ['auth'] 
});
</script> 