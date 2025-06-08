<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Donation History</h1>
      <p class="text-gray-600">Track your contributions and their impact</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Donated</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary.totalDonated }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">This Year</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary.thisYear }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Donations</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary.totalCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active Subscriptions</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary.activeSubscriptions }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
          <select v-model="filters.type" @change="fetchDonations" class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
            <option value="">All Types</option>
            <option value="onetime">One-time</option>
            <option value="subscription">Subscription</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select v-model="filters.status" @change="fetchDonations" class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select v-model="filters.dateRange" @change="fetchDonations" class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
            <option value="">All Time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
        
        <button 
          @click="resetFilters" 
          class="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Active Subscriptions -->
    <div v-if="subscriptions.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Active Subscriptions</h2>
      <div class="space-y-4">
        <div 
          v-for="subscription in subscriptions" 
          :key="subscription.id"
          class="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-500"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center mb-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ subscription.status }}
                </span>
                <span class="ml-2 text-sm text-gray-500">
                  Every {{ subscription.interval_count }} {{ subscription.interval_type }}{{ subscription.interval_count > 1 ? 's' : '' }}
                </span>
              </div>
              <h3 class="text-lg font-medium text-gray-900">{{ subscription.amount }} / {{ subscription.interval_type }}</h3>
              <p class="text-sm text-gray-600 capitalize">{{ subscription.category }}</p>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="cancelSubscription(subscription.id)"
                class="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Donation History Table -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Donation History</h2>
      </div>
      
      <div v-if="loading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-2 text-gray-500">Loading donations...</p>
      </div>
      
      <div v-else-if="donations.length === 0" class="p-6 text-center">
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
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="donation in donations" :key="donation.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(donation.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ donation.amount }}
                <span class="text-gray-500 text-xs ml-1 uppercase">{{ donation.currency }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {{ donation.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {{ donation.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(donation.status)"
                >
                  {{ donation.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {{ donation.message || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewDonationDetails(donation)"
                  class="text-primary-600 hover:text-primary-900 mr-3"
                >
                  View
                </button>
                <button 
                  v-if="donation.status === 'completed'"
                  @click="downloadReceipt(donation)"
                  class="text-green-600 hover:text-green-900"
                >
                  Receipt
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="changePage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            @click="changePage(pagination.currentPage + 1)"
            :disabled="pagination.currentPage === pagination.totalPages"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing {{ ((pagination.currentPage - 1) * pagination.perPage) + 1 }} to 
              {{ Math.min(pagination.currentPage * pagination.perPage, pagination.totalCount) }} of 
              {{ pagination.totalCount }} results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button 
                @click="changePage(pagination.currentPage - 1)"
                :disabled="pagination.currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="page === pagination.currentPage 
                  ? 'bg-primary-50 border-primary-500 text-primary-600 z-10' 
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                {{ page }}
              </button>
              <button 
                @click="changePage(pagination.currentPage + 1)"
                :disabled="pagination.currentPage === pagination.totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Donation Details Modal -->
    <div v-if="selectedDonation" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Donation Details</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Amount:</span>
              <span>{{ selectedDonation.amount }} {{ selectedDonation.currency.toUpperCase() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Date:</span>
              <span>{{ formatDate(selectedDonation.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Type:</span>
              <span class="capitalize">{{ selectedDonation.type }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Category:</span>
              <span class="capitalize">{{ selectedDonation.category }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Status:</span>
              <span 
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize"
                :class="getStatusClass(selectedDonation.status)"
              >
                {{ selectedDonation.status }}
              </span>
            </div>
            
            <div v-if="selectedDonation.message" class="pt-3 border-t">
              <span class="font-medium text-gray-700">Message:</span>
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
              @click="closeModal"
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
import { ref, onMounted, computed } from 'vue'

// Reactive data
const donations = ref([])
const subscriptions = ref([])
const summary = ref({
  totalDonated: 0,
  thisYear: 0,
  totalCount: 0,
  activeSubscriptions: 0
})
const loading = ref(false)
const selectedDonation = ref(null)

const filters = ref({
  type: '',
  status: '',
  dateRange: ''
})

const pagination = ref({
  currentPage: 1,
  perPage: 10,
  totalCount: 0,
  totalPages: 1
})

// Computed
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, pagination.value.currentPage - 2)
  const end = Math.min(pagination.value.totalPages, pagination.value.currentPage + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const fetchDonations = async () => {
  loading.value = true
  try {
    const query = new URLSearchParams({
      page: pagination.value.currentPage,
      limit: pagination.value.perPage,
      ...filters.value
    })
    
    const response = await $fetch(`/api/donations/history?${query}`)
    
    donations.value = response.donations
    pagination.value = {
      ...pagination.value,
      totalCount: response.totalCount,
      totalPages: Math.ceil(response.totalCount / pagination.value.perPage)
    }
  } catch (error) {
    console.error('Failed to fetch donations:', error)
  } finally {
    loading.value = false
  }
}

const fetchSummary = async () => {
  try {
    const response = await $fetch('/api/donations/summary')
    summary.value = response
  } catch (error) {
    console.error('Failed to fetch summary:', error)
  }
}

const fetchSubscriptions = async () => {
  try {
    const response = await $fetch('/api/subscriptions/active')
    subscriptions.value = response.subscriptions
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error)
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.currentPage = page
    fetchDonations()
  }
}

const resetFilters = () => {
  filters.value = {
    type: '',
    status: '',
    dateRange: ''
  }
  pagination.value.currentPage = 1
  fetchDonations()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    processing: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const viewDonationDetails = (donation) => {
  selectedDonation.value = donation
}

const closeModal = () => {
  selectedDonation.value = null
}

const downloadReceipt = async (donation) => {
  try {
    const response = await $fetch(`/api/donations/${donation.id}/receipt`, {
      method: 'GET'
    })
    
    // Create and download the receipt
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donation-receipt-${donation.id}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download receipt:', error)
    alert('Failed to download receipt. Please try again.')
  }
}


const cancelSubscription = async (subscriptionId) => {
  if (!confirm('Are you sure you want to cancel this subscription?')) {
    return
  }
  
  try {
    await $fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST'
    })
    
    // Refresh data
    await fetchSubscriptions()
    await fetchSummary()
    
    alert('Subscription cancelled successfully.')
  } catch (error) {
    console.error('Failed to cancel subscription:', error)
    alert('Failed to cancel subscription. Please try again.')
  }
}

// Lifecycle
onMounted(() => {
  fetchDonations()
  fetchSummary()
  fetchSubscriptions()
})
</script>