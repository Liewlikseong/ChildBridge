<template>
  <div>
    <!-- Render a loading state until the component is mounted on the client -->
    <div v-if="!isMounted" class="p-4">
      <p>Loading Profile Management...</p>
    </div>

    <!-- Main content, rendered only on the client -->
    <div v-else>
      <!-- Head Admin Tab Navigation -->
      <div v-if="isHeadAdmin" class="mb-4 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button @click="activeManagementTab = 'admins'" :class="[activeManagementTab === 'admins' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Admin Management
          </button>
          <button @click="activeManagementTab = 'users'" :class="[activeManagementTab === 'users' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            User Management
          </button>
        </nav>
      </div>

      <!-- Page Header -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-bold">
          {{ pageTitle }}
        </h1>
        <NuxtLink :to="addLinkTarget" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
          <i class="fas fa-plus mr-2"></i>
          {{ addLinkText }}
        </NuxtLink>
      </div>

      <!-- Filters -->
      <div v-if="(isHeadAdmin && activeManagementTab === 'users') || isAdmin" class="bg-white shadow-md rounded-lg p-4 mb-4">
        <div class="flex justify-between items-center gap-4">
          <!-- Role Filter Dropdown for All Admins -->
          <div v-if="isHeadAdmin || isAdmin">
            <label for="role-filter" class="sr-only">Filter by role</label>
            <select
              id="role-filter"
              name="role-filter"
              v-model="activeRoleFilter"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>Filter by role...</option>
              <option v-for="tab in filterTabs" :key="tab.role" :value="tab.role">{{ tab.name }}</option>
            </select>
          </div>

          <!-- Search Bar -->
          <div class="flex-grow">
            <label for="search" class="sr-only">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="search"
                name="search"
                id="search"
                v-model="searchQuery"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search users..."
              />
            </div>
          </div>
        </div>
      </div>

      <!-- User Table -->
      <p v-if="deleteError" class="text-red-500 mb-4 p-3 bg-red-50 rounded-md">{{ deleteError }}</p>
      <p v-if="pending">Loading profiles...</p>
      <p v-else-if="error">Failed to load profiles: {{ error.message }}</p>
      <div v-else class="bg-white shadow-md rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(user, index) in users" :key="user.id" class="hover:bg-gray-50 hover:shadow-sm">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.first_name }} {{ user.last_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getRoleClass(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  class="text-white bg-primary-500 hover:bg-primary-600 px-3 py-1 rounded-md text-xs"
                  @click="goToEdit(user)"
                >EDIT</button>
                <button
                  v-if="canDelete(user)"
                  @click="deleteUser(user.id, user.role)"
                  :disabled="deletingId === user.id"
                  class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
                >
                  {{ deletingId === user.id ? 'Deleting...' : 'DELETE' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useProfile } from '~/composables/useProfile';
import { useDebounceFn } from '@vueuse/core';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
});

// --- State and Refs ---
const { profile: currentUser } = useProfile();
const isMounted = ref(false);
const users = ref([]);
const pending = ref(true);
const error = ref(null);
const deletingId = ref(null);
const deleteError = ref('');
const activeRoleFilter = ref('');
const searchQuery = ref('');
const activeManagementTab = ref('');
const router = useRouter();

// --- Computed Properties ---
const isHeadAdmin = computed(() => currentUser.value?.role === 'head_admin');
const isAdmin = computed(() => currentUser.value?.role === 'admin');

const filterTabs = computed(() => {
  if (isHeadAdmin.value) {
    return [
      { name: 'All Roles', role: 'all' },
      { name: 'Admins', role: 'admin' },
      { name: 'Staff', role: 'staff' },
      { name: 'Donors', role: 'donor' },
    ];
  } else if (isAdmin.value) {
    return [
      { name: 'All Roles', role: 'all' },
      { name: 'Staff', role: 'staff' },
      { name: 'Donors', role: 'donor' },
    ];
  }
  return [];
});

const pageTitle = computed(() => {
  if (isHeadAdmin.value) {
    return activeManagementTab.value === 'admins' ? 'Admin Management' : 'User & Staff Management';
  }
  if (isAdmin.value) return 'User & Staff Management';
  return 'User Management';
});

const addLinkTarget = computed(() => {
  if (isHeadAdmin.value && activeManagementTab.value === 'admins') {
    return '/admin/add-profile';
  }
  return '/admin/add-user';
});

const addLinkText = computed(() => {
  if (isHeadAdmin.value && activeManagementTab.value === 'admins') {
    return 'Add Admin';
  }
  return 'Add User';
});

// --- Lifecycle Hook ---
onMounted(() => {
  isMounted.value = true;
  // Initial state is now set by the currentUser watcher
});

// Watch for the user profile to load, then set initial state
watch(currentUser, (newProfile, oldProfile) => {
  // Run only once when the profile is first loaded
  if (newProfile && !oldProfile) {
    console.log('User profile loaded:', newProfile.role);
    if (newProfile.role === 'head_admin') {
      activeManagementTab.value = 'admins'; // This will trigger the tab watcher
      console.log('Set initial tab to admins for head_admin');
    } else if (newProfile.role === 'admin') {
      activeRoleFilter.value = 'all'; // This will trigger the filter watcher
      console.log('Set initial filter to all for admin');
    }
    
    // Manually trigger the first data fetch after a short delay to ensure state is set
    setTimeout(() => {
      if (isMounted.value) {
        console.log('Triggering initial data fetch');
        fetchData();
      }
    }, 100);
  }
});

// --- Data Fetching ---
const fetchData = async () => {
  pending.value = true;
  error.value = null;

  const endpoint = isHeadAdmin.value ? '/api/admin/profiles' : '/api/users';
  
  const params = {
    search: searchQuery.value,
  };

  // Handle role filtering for different scenarios
  if (isHeadAdmin.value) {
    if (activeManagementTab.value === 'admins') {
      // Admin Management tab - show only admin users
      params.role = 'admin';
      console.log('Head admin requesting admin users');
    } else if (activeManagementTab.value === 'users') {
      // User Management tab - show staff and donors based on filter
      if (activeRoleFilter.value === 'all') {
        params.role = ['staff', 'donor'];
        console.log('Head admin requesting all staff and donors');
      } else if (activeRoleFilter.value && activeRoleFilter.value !== 'all') {
        params.role = activeRoleFilter.value;
        console.log('Head admin requesting specific role:', activeRoleFilter.value);
      }
    }
  } else if (isAdmin.value) {
    // Regular admin - show staff and donors based on filter
    if (activeRoleFilter.value && activeRoleFilter.value !== 'all') {
      params.role = activeRoleFilter.value;
      console.log('Admin requesting specific role:', activeRoleFilter.value);
    } else {
      params.role = ['staff', 'donor'];
      console.log('Admin requesting all staff and donors');
    }
  }

  console.log('Fetching data with params:', {
    endpoint,
    params,
    activeManagementTab: activeManagementTab.value,
    activeRoleFilter: activeRoleFilter.value,
    isHeadAdmin: isHeadAdmin.value
  });

  try {
    const data = await $fetch(endpoint, { params });
    users.value = data;
  } catch (e) {
    console.error('Error fetching data:', e);
    error.value = e.data || { message: e.message };
  } finally {
    pending.value = false;
  }
};

// Debounce the fetch function to avoid too many API calls while typing
const debouncedFetch = useDebounceFn(fetchData, 300);

watch(searchQuery, () => {
  debouncedFetch();
});

// Watch for head_admin tab changes
watch(activeManagementTab, (newTab) => {
  console.log('Tab changed to:', newTab);
  if (isHeadAdmin.value) {
    searchQuery.value = ''; // Clear search when changing tabs
    if (newTab === 'admins') {
      activeRoleFilter.value = 'admin';
    } else {
      activeRoleFilter.value = 'all';
    }
    // The activeRoleFilter watcher will trigger the data fetch
  }
});

// Watch for role filter changes and refetch data
watch(activeRoleFilter, (newFilter, oldFilter) => {
  console.log('Role filter changed:', { oldFilter, newFilter, isMounted: isMounted.value });
  // Only fetch if the component is mounted and the filter has actually changed.
  if (isMounted.value && newFilter !== oldFilter) {
    fetchData();
  }
});

// --- Methods ---
const getRoleClass = (role) => {
  const roles = {
    head_admin: 'bg-green-100 text-green-800',
    admin: 'bg-blue-100 text-blue-800',
    staff: 'bg-yellow-100 text-yellow-800',
    donor: 'bg-purple-100 text-purple-800',
  };
  return roles[role] || 'bg-gray-100 text-gray-800';
};

const canDelete = (user) => {
  if (!currentUser.value) return false;
  if (isHeadAdmin.value) {
    // In admin management tab, can delete admins; in user management, can delete staff and donors
    if (activeManagementTab.value === 'admins') {
      return user.role === 'admin';
    } else {
      return ['staff', 'donor'].includes(user.role);
    }
  }
  return ['staff', 'donor'].includes(user.role);
};

const deleteUser = async (userId, userRole) => {
  const deleteEndpoint = userRole === 'admin' ? '/api/admin/delete-user' : '/api/users/delete';

  if (!window.confirm(`Are you sure you want to delete this ${userRole}? This action cannot be undone.`)) {
    return;
  }
  deletingId.value = userId;
  deleteError.value = '';
  try {
    await $fetch(deleteEndpoint, {
      method: 'POST',
      body: { id: userId },
    });
    await fetchData(); // Refresh the list
  } catch (err) {
    deleteError.value = err.data?.statusMessage || err.message || 'An unexpected error occurred.';
  } finally {
    deletingId.value = null;
  }
};

const goToEdit = (user) => {
  if (user.role === 'admin') {
    router.push(`/admin/edit-admin/${user.id}`);
  } else {
    router.push(`/admin/edit-user/${user.id}`);
  }
};
</script> 