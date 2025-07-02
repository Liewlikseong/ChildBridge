<template>
  <div>
    <div v-if="isHeadAdmin">
      <h1 class="text-2xl font-bold mb-6">Administrator Accounts</h1>
      <p v-if="pending" class="text-gray-500">Loading administrators...</p>
      <p v-else-if="error" class="text-red-500">Failed to load administrators: {{ error.message }}</p>
      <div v-else class="bg-white shadow-md rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="admin in admins" :key="admin.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ admin.first_name }} {{ admin.last_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ admin.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="admin.role === 'head_admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                >
                  {{ admin.role }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <h2 class="text-lg font-medium text-gray-900">Welcome, Admin!</h2>
      <p class="mt-1 text-sm text-gray-600">This is your dashboard. You can manage users and other site settings here.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useProfile } from '~/composables/useProfile';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin-verification'] 
});

const { profile: currentUser } = useProfile();
const isHeadAdmin = computed(() => currentUser.value?.role === 'head_admin');

const { data: admins, pending, error } = useFetch('/api/admin/profiles', {
  params: { role: ['admin', 'head_admin'] },
  lazy: true,
  server: false,
  // Only run this fetch if the user is a head_admin
  watch: [isHeadAdmin],
  immediate: isHeadAdmin.value
});
</script> 