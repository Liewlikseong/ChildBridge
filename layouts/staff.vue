<template>
  <div class="flex flex-col min-h-screen">
    <LayoutHeader />
    <main class="flex-grow bg-gray-50 py-8">
      <div class="container-custom">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <slot />
        </div>
      </div>
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup>
</script> 