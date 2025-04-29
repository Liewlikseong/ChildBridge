<template>
  <header class="bg-white border-b border-neutral-200 sticky top-0 z-50">
    <div class="container-custom py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-primary-600">ChildBridge</span>
        </NuxtLink>

        <!-- Mobile menu button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden">
          <span v-if="!mobileMenuOpen" class="block w-6 h-6 text-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </span>
          <span v-else class="block w-6 h-6 text-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </span>
        </button>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-2">
          <NuxtLink to="/about" class="navbar-link">About</NuxtLink>
          <NuxtLink to="/donate" class="navbar-link">Donate</NuxtLink>
          <NuxtLink to="/updates" class="navbar-link">Updates</NuxtLink>
          <template v-if="!user">
            <NuxtLink to="/auth/login" class="btn btn-outline ml-4">Login</NuxtLink>
            <NuxtLink to="/auth/register" class="btn btn-primary ml-2">Sign Up</NuxtLink>
          </template>
          <template v-else>
            <div class="relative ml-4" ref="userMenuContainer">
              <button 
                @click="userMenuOpen = !userMenuOpen" 
                class="flex items-center space-x-1 text-neutral-700 hover:text-neutral-900"
              >
                <span>{{ user.email }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Profile</NuxtLink>
                <NuxtLink to="/donations" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">My Donations</NuxtLink>
                <NuxtLink to="/messages" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Messages</NuxtLink>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Logout</button>
              </div>
            </div>
          </template>
        </nav>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <nav class="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-neutral-200">
        <NuxtLink to="/about" class="block py-2 text-neutral-700">About</NuxtLink>
        <NuxtLink to="/donate" class="block py-2 text-neutral-700">Donate</NuxtLink>
        <NuxtLink to="/updates" class="block py-2 text-neutral-700">Updates</NuxtLink>
        <template v-if="!user">
          <NuxtLink to="/auth/login" class="block py-2 text-neutral-700">Login</NuxtLink>
          <NuxtLink to="/auth/register" class="block py-2 text-primary-600 font-medium">Sign Up</NuxtLink>
        </template>
        <template v-else>
          <div class="border-t border-neutral-200 my-2 pt-2">
            <NuxtLink to="/profile" class="block py-2 text-neutral-700">Profile</NuxtLink>
            <NuxtLink to="/donations" class="block py-2 text-neutral-700">My Donations</NuxtLink>
            <NuxtLink to="/messages" class="block py-2 text-neutral-700">Messages</NuxtLink>
            <button @click="logout" class="block py-2 text-neutral-700 w-full text-left">Logout</button>
          </div>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const userMenuContainer = ref(null);

const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    userMenuOpen.value = false;
    navigateTo('/');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

const handleClickOutside = (event) => {
  if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    userMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>