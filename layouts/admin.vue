<template>
  <div class="flex flex-col min-h-screen">
    <LayoutHeader />
    <main class="flex-grow bg-gray-50 py-8">
      <div class="container-custom">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <NuxtLink to="/admin/dashboard" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" :class="[$route.name === 'admin-dashboard' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                Dashboard
              </NuxtLink>
              <NuxtLink to="/admin/profile" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" :class="[$route.name.startsWith('admin-profile') || $route.name.startsWith('admin-add-profile') ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']">
                Profiles
              </NuxtLink>
            </nav>
          </div>
          <slot />
        </div>
      </div>
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup>
</script> 