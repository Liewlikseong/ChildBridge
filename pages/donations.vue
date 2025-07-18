<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold mb-2">My Donation History</h1>
        <p class="text-gray-600">Track your contributions and their impact</p>
      </div>
      <NuxtLink 
        to="/donate" 
        class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Make a Donation
      </NuxtLink>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900">{{ summary.totalDonated }}</div>
            <div class="text-sm text-gray-600">Total Donated</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900">{{ summary.thisYear }}</div>
            <div class="text-sm text-gray-600">This Year</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900">{{ summary.totalCount }}</div>
            <div class="text-sm text-gray-600">Total Donations</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          <div class="ml-4">
            <div class="text-2xl font-bold text-gray-900">{{ summary.activeSubscriptions }}</div>
            <div class="text-sm text-gray-600">Active Subscriptions</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search donations..."
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <select v-model="filters.type" class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option value="">All Types</option>
          <option value="onetime">One-time</option>
          <option value="subscription">Monthly</option>
          <option value="physical">Physical</option>
          <option value="event">Event</option>
        </select>
        <select v-model="filters.status" class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="processing">Processing</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select v-model="filters.dateRange" class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <button
          @click="resetFilters"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Active Subscriptions -->
    <div v-if="subscriptions && subscriptions.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Subscriptions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="subscription in (subscriptions || [])" 
          :key="subscription.id"
          class="bg-white p-6 rounded-lg shadow border border-l-4"
          :class="subscription.status === 'cancelled' ? 'border-l-red-500' : 'border-l-green-500'"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="flex items-center mb-2">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                >
                  {{ subscription.status }}
                </span>
              </div>
              <h3 class="text-lg font-medium text-gray-900">
                RM{{ subscription.amount.toFixed(2) }} / {{ subscription.interval_type }}
              </h3>
              <p class="text-sm text-gray-600 capitalize">{{ subscription.category || 'General' }}</p>
              <p class="text-xs text-gray-500 mt-1">
                Every {{ subscription.interval_count }} {{ subscription.interval_type }}{{ subscription.interval_count > 1 ? 's' : '' }}
              </p>
              <p v-if="subscription.cancelled_at" class="text-xs text-red-500 mt-1">
                Cancelled on {{ formatDate(subscription.cancelled_at) }}
              </p>
              <p v-else-if="subscription.cancel_at_period_end && subscription.current_period_end" class="text-xs text-orange-500 mt-1">
                Will cancel on {{ formatDate(subscription.current_period_end) }}
              </p>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="viewSubscriptionDetails(subscription)"
              class="flex-1 px-3 py-1 text-sm text-primary-600 hover:text-primary-800 border border-primary-300 rounded hover:bg-primary-50"
            >
              View Details
            </button>
            <button 
              v-if="subscription.status === 'active'"
              @click="cancelSubscription(subscription.id)"
              class="flex-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
            >
              Cancel
            </button>
            <button 
              v-else-if="subscription.status === 'cancelled'"
              disabled
              class="flex-1 px-3 py-1 text-sm text-gray-400 border border-gray-300 rounded cursor-not-allowed"
            >
              Cancelled
            </button>
            <button 
              v-else-if="subscription.status === 'cancelling...'"
              disabled
              class="flex-1 px-3 py-1 text-sm text-gray-400 border border-gray-300 rounded cursor-not-allowed"
            >
              Cancelling...
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Donations Table -->
    <div v-if="pending" class="text-gray-500">Loading donations...</div>
    <div v-else-if="error" class="text-red-500">Failed to load donations: {{ error.message }}</div>
    <div v-else-if="filteredDonations.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No donations found</h3>
      <p class="mt-1 text-sm text-gray-500">Start making a difference today!</p>
      <div class="mt-6">
        <NuxtLink 
          to="/donate" 
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Make Your First Donation
        </NuxtLink>
      </div>
    </div>
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 180px;">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 100px;">Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 120px;">Amount</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 120px;">Category</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 120px;">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 300px;">Message</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 200px;">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="donation in paginatedDonations" :key="donation.id" class="hover:bg-gray-50">
              <td class="px-4 py-4 text-sm text-gray-900" style="min-width: 180px;">
                {{ formatDate(donation.created_at) }}
              </td>
              <td class="px-4 py-4" style="min-width: 100px;">
                <span :class="getTypeColor(donation.type, donation.event_id)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap">
                  {{ formatType(donation.type, donation.event_id) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-900" style="min-width: 120px;">
                {{ (donation.type === 'physical' || !donation.amount) ? 'N/A' : `RM${donation.amount.toFixed(2)}` }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-500" style="min-width: 120px;">
                {{ donation.category || 'General' }}
              </td>
              <td class="px-4 py-4" style="min-width: 120px;">
                <span :class="getStatusColor(donation.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap">
                  {{ donation.status }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500 max-w-xs" style="min-width: 300px;">
                <div class="truncate" :title="donation.message">
                  {{ donation.message || '-' }}
                </div>
              </td>
              <td class="px-4 py-4 text-sm font-medium" style="min-width: 200px;">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="viewDonationDetails(donation)"
                    class="text-primary-600 hover:text-primary-900 whitespace-nowrap"
                  >
                    View Details
                  </button>
                  <button 
                    v-if="donation.status === 'completed'"
                    @click="downloadReceipt(donation)"
                    class="text-green-600 hover:text-green-900 whitespace-nowrap"
                  >
                    Receipt
                  </button>
                  <button 
                    v-if="donation.status === 'pending' && donation.type === 'subscription'"
                    @click="cancelDonation(donation.id)"
                    class="text-red-600 hover:text-red-900 whitespace-nowrap text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredDonations.length) }} of {{ filteredDonations.length }} results
        </div>
        <div class="flex space-x-2">
          <button
            @click="currentPage > 1 && currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="currentPage < totalPages && currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Donation Details Modal -->
    <div v-if="showDetailsModal && selectedDonation" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showDetailsModal = false">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Donation Details</h3>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Date:</span>
              <span>{{ formatDate(selectedDonation.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Type:</span>
              <span class="capitalize">{{ formatType(selectedDonation.type, selectedDonation.event_id) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Amount:</span>
              <span>{{ selectedDonation.type === 'physical' ? 'N/A' : `RM${selectedDonation.amount.toFixed(2)}` }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Category:</span>
              <span class="capitalize">{{ selectedDonation.category || 'General' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Status:</span>
              <span :class="getStatusColor(selectedDonation.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ selectedDonation.status }}
              </span>
            </div>
            
            <div v-if="selectedDonation.message" class="pt-3 border-t">
              <span class="font-medium text-gray-700">Message/Items:</span>
              <p class="mt-1 text-gray-600">{{ selectedDonation.message }}</p>
            </div>
            
            <div v-if="selectedDonation.stripe_payment_intent_id" class="pt-3 border-t">
              <span class="font-medium text-gray-700">Transaction ID:</span>
              <p class="mt-1 text-gray-600 text-xs font-mono">{{ selectedDonation.stripe_payment_intent_id }}</p>
            </div>
          </div>
          
          <div class="mt-6 flex space-x-3">
            <button 
              v-if="selectedDonation.status === 'completed'"
              @click="downloadReceipt(selectedDonation)"
              class="flex-1 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
            >
              Download Receipt
            </button>
            <button 
              @click="showDetailsModal = false"
              class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Subscription Details Modal -->
    <div v-if="showSubscriptionModal && selectedSubscription" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showSubscriptionModal = false">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Subscription Details</h3>
            <button @click="showSubscriptionModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Amount:</span>
              <span>RM{{ (selectedSubscription.amount || 0).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Interval:</span>
              <span class="capitalize">{{ selectedSubscription.interval_type || 'month' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Category:</span>
              <span class="capitalize">{{ selectedSubscription.category || 'General' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Status:</span>
              <span :class="(selectedSubscription.status === 'cancelled') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ selectedSubscription.status || 'active' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Created:</span>
              <span>{{ selectedSubscription.created_at ? formatDate(selectedSubscription.created_at) : 'N/A' }}</span>
            </div>
            
            <div v-if="selectedSubscription.cancelled_at" class="pt-3 border-t">
              <span class="font-medium text-gray-700">Cancelled:</span>
              <p class="mt-1 text-gray-600">{{ formatDate(selectedSubscription.cancelled_at) }}</p>
            </div>
            
            <div v-if="selectedSubscription.cancel_at_period_end && selectedSubscription.current_period_end" class="pt-3 border-t">
              <span class="font-medium text-gray-700">Will cancel on:</span>
              <p class="mt-1 text-gray-600">{{ formatDate(selectedSubscription.current_period_end) }}</p>
            </div>
            
            <div v-if="selectedSubscription.stripe_subscription_id" class="pt-3 border-t">
              <span class="font-medium text-gray-700">Subscription ID:</span>
              <p class="mt-1 text-gray-600 text-xs font-mono">{{ selectedSubscription.stripe_subscription_id }}</p>
            </div>
          </div>
          
          <div class="mt-6 flex space-x-3">
            <button 
              v-if="selectedSubscription.status === 'active'"
              @click="cancelSubscription(selectedSubscription.id); showSubscriptionModal = false"
              class="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
            >
              Cancel Subscription
            </button>
            <button 
              @click="showSubscriptionModal = false"
              class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Define page metadata  
definePageMeta({
  middleware: ['auth']
});

// Data
const currentPage = ref(1);
const itemsPerPage = 20;
const showDetailsModal = ref(false);
const showSubscriptionModal = ref(false);
const selectedDonation = ref(null);
const selectedSubscription = ref(null);

// Filters
const filters = ref({
  search: '',
  type: '',
  status: '',
  dateRange: ''
});

// Fetch data
const { data: donations, pending, error, refresh } = useFetch('/api/donations/history', {
  lazy: true,
  server: false,
  transform: (data) => {
    console.log('Raw API response for donations:', data);
    return data?.donations || data || [];
  },
  default: () => []
});

const { data: subscriptions, refresh: refreshSubscriptions } = useFetch('/api/subscriptions/active', {
  lazy: true,
  server: false,
  transform: (data) => {
    console.log('Raw API response for subscriptions:', data);
    return data?.subscriptions || data || [];
  },
  default: () => []
});

const { data: summary, refresh: refreshSummary } = useFetch('/api/donations/summary', {
  lazy: true,
  server: false,
  transform: (data) => {
    console.log('Raw API response for summary:', data);
    return data || {
      totalDonated: 'RM0.00',
      thisYear: 'RM0.00',
      totalCount: 0,
      activeSubscriptions: 0
    };
  },
  default: () => ({
    totalDonated: 'RM0.00',
    thisYear: 'RM0.00',
    totalCount: 0,
    activeSubscriptions: 0
  })
});

// Computed properties
const filteredDonations = computed(() => {
  console.log('Computing filtered donations, raw data:', donations.value);
  
  if (!donations.value || !Array.isArray(donations.value)) {
    console.log('No donations data or not an array');
    return [];
  }
  
  let filtered = [...donations.value];
  console.log('Starting with donations:', filtered.length);

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(donation => 
      (donation.message || '').toLowerCase().includes(search) ||
      (donation.category || '').toLowerCase().includes(search)
    );
    console.log('After search filter:', filtered.length);
  }

  if (filters.value.type) {
    if (filters.value.type === 'event') {
      // Filter for donations with event_id
      filtered = filtered.filter(donation => donation.event_id);
    } else {
      // Filter for donations without event_id and matching type
      filtered = filtered.filter(donation => !donation.event_id && donation.type === filters.value.type);
    }
    console.log('After type filter:', filtered.length);
  }

  if (filters.value.status) {
    filtered = filtered.filter(donation => donation.status === filters.value.status);
    console.log('After status filter:', filtered.length);
  }

  if (filters.value.dateRange) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    filtered = filtered.filter(donation => {
      const donationDate = new Date(donation.created_at);
      
      switch (filters.value.dateRange) {
        case 'today': return donationDate >= today;
        case 'week': return donationDate >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month': return donationDate >= new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        case 'year': return donationDate >= new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        default: return true;
      }
    });
    console.log('After date filter:', filtered.length);
  }

  const result = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  console.log('Final filtered donations:', result.length);
  return result;
});

const totalPages = computed(() => Math.ceil(filteredDonations.value.length / itemsPerPage));

const paginatedDonations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredDonations.value.slice(start, start + itemsPerPage);
});

// Helper functions for subscription status
const getSubscriptionStatusColor = (status, cancelAtPeriodEnd) => {
  if (status === 'cancelled') return 'bg-red-100 text-red-800';
  if (status === 'active' && cancelAtPeriodEnd) return 'bg-orange-100 text-orange-800';
  if (status === 'active') return 'bg-green-100 text-green-800';
  if (status === 'cancelling...') return 'bg-gray-100 text-gray-800';
  return 'bg-gray-100 text-gray-800';
};

const getSubscriptionStatusText = (status, cancelAtPeriodEnd) => {
  if (status === 'cancelled') return 'Cancelled';
  if (status === 'active' && cancelAtPeriodEnd) return 'Ending Soon';
  if (status === 'active') return 'Active';
  if (status === 'cancelling...') return 'Cancelling...';
  return status;
};

// Helper functions
const formatType = (type, eventId) => {
  if (eventId) return 'Event';
  return { 
    onetime: 'One-time', 
    subscription: 'Monthly', 
    physical: 'Physical' 
  }[type] || type;
};

const getTypeColor = (type, eventId) => {
  if (eventId) return 'bg-indigo-100 text-indigo-800';
  return {
    onetime: 'bg-blue-100 text-blue-800',
    subscription: 'bg-green-100 text-green-800',
    physical: 'bg-purple-100 text-purple-800'
  }[type] || 'bg-gray-100 text-gray-800';
};

const getStatusColor = (status) => ({
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  processing: 'bg-blue-100 text-blue-800'
}[status] || 'bg-gray-100 text-gray-800');

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
});

// Actions
const viewDonationDetails = (donation) => {
  selectedDonation.value = donation;
  showDetailsModal.value = true;
};

const viewSubscriptionDetails = (subscription) => {
  console.log('Viewing subscription details:', subscription); // Debug log
  selectedSubscription.value = subscription;
  showSubscriptionModal.value = true;
  console.log('Modal state:', showSubscriptionModal.value); // Debug log
  console.log('Selected subscription:', selectedSubscription.value); // Debug log
};

const downloadReceipt = async (donation) => {
  try {
    console.log('Downloading receipt for donation:', donation.id);
    console.log('Donation details:', {
      id: donation.id,
      status: donation.status,
      type: donation.type,
      donor_id: donation.donor_id,
      amount: donation.amount
    });
    
    // Use fetch with proper headers
    const response = await fetch(`/api/donations/${donation.id}/receipt`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Receipt API error:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-receipt-${donation.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Failed to download receipt:', error);
    alert(`Failed to download receipt: ${error.message}`);
  }
};

const cancelSubscription = async (subscriptionId, immediate = false) => {
  const subscription = (subscriptions.value || []).find(s => s.id === subscriptionId);
  if (!subscription) return;

  // Show confirmation dialog with options
  const confirmMessage = immediate 
    ? 'Are you sure you want to cancel this subscription immediately? You will lose access right away and this cannot be undone.'
    : 'Are you sure you want to cancel this subscription? It will remain active until the end of your current billing period.';

  if (!confirm(confirmMessage)) {
    return;
  }
  
  try {
    // Show loading state
    const originalStatus = subscription.status;
    const originalCancelAtPeriodEnd = subscription.cancel_at_period_end;
    subscription.status = 'cancelling...';
    
    const response = await $fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      body: { immediate }
    });
    
    // Update the local subscription based on response
    if (response.success) {
      if (immediate || response.status === 'cancelled') {
        subscription.status = 'cancelled';
        subscription.cancelled_at = response.cancelled_at || new Date().toISOString();
        subscription.cancel_at_period_end = false;
      } else {
        subscription.status = 'active';
        subscription.cancel_at_period_end = true;
        subscription.current_period_end = response.current_period_end;
      }
    }
    
    // Refresh data to ensure consistency
    await refreshSubscriptions();
    await refreshSummary();
    
    alert(response.message || 'Subscription cancelled successfully.');
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    
    // Revert status on error
    subscription.status = originalStatus;
    subscription.cancel_at_period_end = originalCancelAtPeriodEnd;
    
    alert('Failed to cancel subscription. Please try again.');
  }
};

const cancelDonation = async (donationId) => {
  if (!confirm('Are you sure you want to cancel this donation?')) {
    return;
  }
  
  try {
    await $fetch(`/api/donations/${donationId}/cancel`, {
      method: 'POST'
    });
    
    // Refresh data
    await refresh();
    await refreshSummary();
    
    alert('Donation cancelled successfully.');
  } catch (error) {
    console.error('Failed to cancel donation:', error);
    alert('Failed to cancel donation. Please try again.');
  }
};

const resetFilters = () => {
  filters.value = {
    search: '',
    type: '',
    status: '',
    dateRange: ''
  };
  currentPage.value = 1;
};

// Reset pagination when filters change
watch([filters], () => currentPage.value = 1, { deep: true });
</script>
