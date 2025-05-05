<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md text-center">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="mt-4 text-center text-3xl font-bold text-neutral-900">Almost there!</h2>
      <p class="mt-2 text-center text-neutral-600 max-w-sm mx-auto">
        Your account has been created successfully. For this demo, you're already logged in and ready to go!
      </p>
      <div class="mt-6">
        <NuxtLink 
          to="/"
          class="w-full inline-block text-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Back to HomePage
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});
</script>