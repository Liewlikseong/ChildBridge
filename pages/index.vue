<template>
  <div>
    <NuxtLayout>
      <ClientOnly>
        <div class="min-h-screen flex items-center justify-center">
          <div class="text-center">
            <p class="text-lg text-neutral-600">Redirecting to homepage...</p>
          </div>
        </div>
      </ClientOnly>
    </NuxtLayout>
  </div>
</template>

<script setup>
onMounted(() => {
  navigateTo('/home');
});
</script>