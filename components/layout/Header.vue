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
          <NuxtLink to="/events" class="navbar-link">Events</NuxtLink>
          <NuxtLink to="/leaderboard" class="navbar-link">Leader Board</NuxtLink>
          <template v-if="!user">
            <NuxtLink to="/auth/login" class="btn btn-outline ml-4">Login</NuxtLink>
            <NuxtLink to="/auth/register" class="btn btn-primary ml-2">Sign Up</NuxtLink>
          </template>
          <template v-else>
            <div class="relative ml-4" ref="userMenuContainer">
              <button 
                @click="userMenuOpen = !userMenuOpen" 
                class="flex items-center space-x-2 text-neutral-700 hover:text-neutral-900 p-1 rounded-lg hover:bg-neutral-50"
              >
                <!-- Profile Picture -->
                <div class="relative">
                  <img 
                    v-if="userAvatar" 
                    :src="userAvatar" 
                    :alt="userName"
                    class="w-8 h-8 rounded-full object-cover border-2 border-neutral-200"
                    @error="handleImageError"
                  />
                  <div 
                    v-else 
                    class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium"
                  >
                    {{ userInitials }}
                  </div>
                </div>
                
                <!-- User Name -->
                <span class="text-sm font-medium">{{ userName }}</span>
                
                <!-- Dropdown Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-neutral-200">
                <div class="px-4 py-2 border-b border-neutral-200">
                  <p class="text-sm font-medium text-neutral-900">{{ userName }}</p>
                  <p class="text-xs text-neutral-500">{{ user.email }}</p>
                </div>
                <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Profile</NuxtLink>
                <NuxtLink to="/donations" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">My Donations</NuxtLink>
                <NuxtLink to="/volunteers" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Volunteers Applied</NuxtLink>
                <NuxtLink to="/messages" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Messages</NuxtLink>
                <NuxtLink v-if="['admin', 'head_admin'].includes(profile?.role)" to="/admin/profile" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Admin</NuxtLink>
                <NuxtLink v-if="profile?.role === 'staff'" to="/staff/dashboard" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Staff</NuxtLink>
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
        <NuxtLink to="/events" class="block py-2 text-neutral-700">Events</NuxtLink>
        <NuxtLink to="/leaderboard" class="block py-2 text-neutral-700">Leader Board</NuxtLink>
        <template v-if="!user">
          <NuxtLink to="/auth/login" class="block py-2 text-neutral-700">Login</NuxtLink>
          <NuxtLink to="/auth/register" class="block py-2 text-primary-600 font-medium">Sign Up</NuxtLink>
        </template>
        <template v-else>
          <div class="border-t border-neutral-200 my-2 pt-2">
            <!-- Mobile User Info -->
            <div class="flex items-center space-x-3 px-2 py-3 mb-2">
              <div class="relative">
                <img 
                  v-if="userAvatar" 
                  :src="userAvatar" 
                  :alt="userName"
                  class="w-10 h-10 rounded-full object-cover border-2 border-neutral-200"
                  @error="handleImageError"
                />
                <div 
                  v-else 
                  class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium"
                >
                  {{ userInitials }}
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-neutral-900">{{ userName }}</p>
                <p class="text-xs text-neutral-500">{{ user.email }}</p>
              </div>
            </div>
            
            <NuxtLink to="/profile" class="block py-2 text-neutral-700">Profile</NuxtLink>
            <NuxtLink to="/donations" class="block py-2 text-neutral-700">My Donations</NuxtLink>
            <NuxtLink to="/volunteers" class="block py-2 text-neutral-700">Volunteers Applied</NuxtLink>
            <NuxtLink to="/messages" class="block py-2 text-neutral-700">Messages</NuxtLink>
            <NuxtLink v-if="['admin', 'head_admin'].includes(profile?.role)" to="/admin/profile" class="block py-2 text-neutral-700">Admin</NuxtLink>
            <NuxtLink v-if="profile?.role === 'staff'" to="/staff/dashboard" class="block py-2 text-neutral-700">Staff</NuxtLink>
            <button @click="logout" class="block py-2 text-neutral-700 w-full text-left">Logout</button>
          </div>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';
import { useProfile } from '~/composables/useProfile';

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const { profile, fetchProfile } = useProfile();
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const userMenuContainer = ref(null);
const imageError = ref(false);

// Computed properties for user display - now using the profile from useProfile composable
const userName = computed(() => {
  if (!user.value) return '';
  
  // Use the profile from useProfile composable first
  if (profile.value && profile.value.first_name && profile.value.last_name) {
    return `${profile.value.first_name} ${profile.value.last_name}`;
  } else if (profile.value && profile.value.first_name) {
    return profile.value.first_name;
  }
  
  // Fallback to user metadata
  const metadata = user.value.user_metadata || {};
  if (metadata.full_name) {
    return metadata.full_name;
  } else if (metadata.name) {
    return metadata.name;
  } else {
    return user.value.email?.split('@')[0] || 'User';
  }
});

const userAvatar = computed(() => {
  if (imageError.value) return null;
  if (!user.value) return null;
  
  // Use the profile from useProfile composable first
  if (profile.value && profile.value.avatar_url) {
    return profile.value.avatar_url;
  }
  
  // Fallback to user metadata
  const metadata = user.value.user_metadata || {};
  return metadata.avatar_url || metadata.picture || null;
});

const userInitials = computed(() => {
  if (!user.value) return 'U';
  
  const name = userName.value;
  const words = name.split(' ').filter(word => word.length > 0);
  
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  } else {
    return user.value.email?.[0]?.toUpperCase() || 'U';
  }
});

// Handle image loading errors
const handleImageError = () => {
  imageError.value = true;
};

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

// Watch for user changes and fetch profile
watch(user, async (newUser) => {
  if (newUser) {
    await fetchProfile();
    imageError.value = false; // Reset image error state
  }
}, { immediate: true });

// Watch for profile changes to reset image error
watch(profile, () => {
  imageError.value = false;
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  if (user.value) {
    fetchProfile();
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>