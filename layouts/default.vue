<template>
  <div class="flex flex-col min-h-screen">
    <LayoutHeader />
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <LayoutFooter />
  </div>
</template>

<script setup>
// Default layout with header and footer
</script>