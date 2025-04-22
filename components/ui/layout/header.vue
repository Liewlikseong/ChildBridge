<template>
  <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-3xl font-bold text-primary-600 tracking-tight">ChildBridge</span>
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
          <NuxtLink to="/about" class="text-neutral-700 hover:text-primary-600 transition duration-200 ease-in-out px-3 py-2 rounded-md text-sm font-medium">About</NuxtLink>
          <NuxtLink to="/donate" class="text-neutral-700 hover:text-primary-600 transition duration-200 ease-in-out px-3 py-2 rounded-md text-sm font-medium">Donate</NuxtLink>
          <NuxtLink to="/updates" class="text-neutral-700 hover:text-primary-600 transition duration-200 ease-in-out px-3 py-2 rounded-md text-sm font-medium">Updates</NuxtLink>

          <template v-if="!user">
            <button @click="navigateTo('/auth/login')" class="ml-4 rounded-full text-sm px-4 py-2 border border-neutral-300 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-600">Login</button>
            <button @click="navigateTo('/auth/register')" class="ml-2 rounded-full text-sm px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">Sign Up</button>
          </template>

          <template v-else>
            <div class="relative ml-4" ref="userMenuContainer">
              <button @click="userMenuOpen = !userMenuOpen" class="flex items-center space-x-1 text-neutral-700 hover:text-neutral-900 transition">
                <span>{{ user.email }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border border-gray-100 py-2 z-50">
                <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Profile</NuxtLink>
                <NuxtLink to="/donations" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">My Donations</NuxtLink>
                <NuxtLink to="/messages" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Messages</NuxtLink>
                <button @click="logout" class="block px-4 py-2 text-sm text-left text-neutral-700 hover:bg-neutral-100 w-full">Logout</button>
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
        <NuxtLink to="/leaderboard" class="block py-2 text-neutral-700">Leaderboard</NuxtLink>
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
import { ref } from 'vue';
import { useSupabaseUser } from '#imports';
import { useAuth } from '~/composables/useAuth';

const user = useSupabaseUser();
const { signOut } = useAuth();

// Very simple toggle state
const isMenuOpen = ref(false);
const userMenuOpen = ref(false);

const logout = async () => {
  try {
    await signOut();
    navigateTo('/');
    userMenuOpen.value = false;
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
</script>