<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold mb-2">Donation Management</h1>
        <p class="text-gray-600">View and manage all user donations including event-specific donations</p>
      </div>
      <button
        @click="showAddPhysicalModal = true"
        class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span>Add Physical Donation</span>
      </button>
    </div>

    <!-- Improved Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Donations -->
      <div class="relative bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm border border-emerald-200 p-6 overflow-hidden">
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-emerald-600 text-sm font-medium">Total Donations</p>
              <p class="text-2xl font-bold text-emerald-900 mt-1">{{ stats.totalDonations }}</p>
            </div>
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-emerald-600 font-medium">All time</span>
          </div>
        </div>
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-emerald-300 rounded-full opacity-20"></div>
      </div>

      <!-- Total Amount -->
      <div class="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 overflow-hidden">
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 text-sm font-medium">Total Amount</p>
              <p class="text-2xl font-bold text-blue-900 mt-1">RM{{ stats.totalAmount.toFixed(2) }}</p>
            </div>
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-blue-600 font-medium">Monetary donations</span>
          </div>
        </div>
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-blue-300 rounded-full opacity-20"></div>
      </div>

      <!-- Physical Donations -->
      <div class="relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 overflow-hidden">
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-600 text-sm font-medium">Physical Donations</p>
              <p class="text-2xl font-bold text-purple-900 mt-1">{{ stats.physicalDonations }}</p>
            </div>
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-purple-600 font-medium">Item donations</span>
          </div>
        </div>
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-purple-300 rounded-full opacity-20"></div>
      </div>

      <!-- Active Donors -->
      <div class="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6 overflow-hidden">
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-600 text-sm font-medium">Active Donors</p>
              <p class="text-2xl font-bold text-orange-900 mt-1">{{ stats.activeDonors }}</p>
            </div>
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-orange-600 font-medium">Unique contributors</span>
          </div>
        </div>
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-orange-300 rounded-full opacity-20"></div>
      </div>
    </div>

    <!-- Enhanced Filters Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
      <!-- Filter Header -->
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Filter Donations</h3>
              <p class="text-sm text-gray-500">Refine your search to find specific donations</p>
            </div>
          </div>
          <button
            @click="clearAllFilters"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Clear All
          </button>
        </div>
      </div>
      
      <!-- Filter Controls -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <!-- Enhanced Search Input -->
          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Donations</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Search by donor name, email, or message..."
                class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 sm:text-sm"
              />
              <div v-if="filters.search" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  @click="filters.search = ''"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Enhanced Select Inputs -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
            <div class="relative">
              <select
                v-model="filters.type"
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 sm:text-sm appearance-none"
              >
                <option value="">All Types</option>
                <option value="onetime">One-time</option>
                <option value="subscription">Monthly</option>
                <option value="physical">Physical</option>
                <option value="event">Event</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div class="relative">
              <select
                v-model="filters.status"
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 sm:text-sm appearance-none"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="processing">Processing</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div class="relative">
              <select
                v-model="filters.eventFilter"
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 sm:text-sm appearance-none"
              >
                <option value="">All Donations</option>
                <option value="general">General Donations</option>
                <option value="event">Event Donations</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div class="relative">
              <select
                v-model="filters.dateRange"
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 sm:text-sm appearance-none"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Summary and Export -->
        <div class="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
          <div class="flex items-center space-x-4">
            <!-- Results Summary -->
            <div class="text-sm text-gray-600">
              <span class="font-semibold text-gray-900">{{ filteredDonations.length }}</span> 
              donation{{ filteredDonations.length !== 1 ? 's' : '' }} found
              <span v-if="hasActiveFilters" class="text-primary-600 ml-2">
                (filtered from {{ donations?.length || 0 }} total)
              </span>
            </div>
            
            <!-- Active Filters Indicator -->
            <div v-if="hasActiveFilters" class="flex items-center space-x-2">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path>
                </svg>
                Filters Active
              </span>
            </div>
          </div>

          <!-- Export Button -->
          <button
            @click="exportToCsv"
            :disabled="filteredDonations.length === 0"
            class="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Donations Table -->
    <div v-if="pending" class="bg-white rounded-lg shadow p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading donations...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading donations</h3>
          <p class="mt-1 text-sm text-red-700">{{ error.message }}</p>
        </div>
      </div>
    </div>
    
    <div v-else-if="filteredDonations.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No donations found</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ hasActiveFilters ? 'No donations match your current filters.' : 'No donations have been made yet.' }}
      </p>
      <div v-if="hasActiveFilters" class="mt-4">
        <button
          @click="clearAllFilters"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
        >
          Clear all filters
        </button>
      </div>
    </div>
    
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 180px;">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 200px;">Donor</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 100px;">Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 120px;">Amount</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 150px;">Category/Event</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 120px;">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 250px;">Message</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 300px;">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="donation in paginatedDonations" :key="donation.id" class="hover:bg-gray-50">
              <td class="px-4 py-4 text-sm text-gray-900" style="min-width: 180px;">
                {{ formatDate(donation.created_at) }}
              </td>
              <td class="px-4 py-4" style="min-width: 200px;">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span class="text-xs font-medium text-primary-600">
                        {{ getDonorInitials(donation) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">
                      {{ getDonorName(donation) }}
                    </div>
                    <div class="text-sm text-gray-500">{{ getDonorEmail(donation) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4" style="min-width: 100px;">
                <span :class="getTypeColor(donation.type, donation.event_id)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap">
                  {{ formatType(donation.type, donation.event_id) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-900" style="min-width: 120px;">
                {{ (donation.type === 'physical' || !donation.amount) ? 'N/A' : `RM${donation.amount.toFixed(2)}` }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-500" style="min-width: 150px;">
                <div v-if="donation.event_id && donation.events" class="cursor-pointer" @click="goToEvent(donation.event_id)">
                  <div class="font-medium text-blue-600 hover:text-blue-800 truncate" :title="donation.events.title">
                    {{ donation.events.title }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatEventDate(donation.events) }}
                  </div>
                </div>
                <div v-else class="capitalize">
                  {{ donation.category || 'General' }}
                </div>
              </td>
              <td class="px-4 py-4" style="min-width: 120px;">
                <span :class="getStatusColor(donation.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap">
                  {{ donation.status }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500 max-w-xs" style="min-width: 250px;">
                <div class="truncate" :title="donation.message">
                  {{ donation.message || '-' }}
                </div>
              </td>
              <td class="px-4 py-4 text-sm font-medium" style="min-width: 300px;">
                <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                  <!-- View Details Button -->
                  <button 
                    @click="viewDonationDetails(donation)" 
                    class="text-primary-600 hover:text-primary-900 whitespace-nowrap text-xs font-medium"
                  >
                    View Details
                  </button>
                  
                  <!-- View Event Button (for event donations) -->
                  <button
                    v-if="donation.event_id"
                    @click="goToEvent(donation.event_id)"
                    class="text-blue-600 hover:text-blue-900 whitespace-nowrap text-xs"
                  >
                    View Event
                  </button>
                  
                  <!-- Edit Button - only for physical donations -->
                  <NuxtLink
                    v-if="donation.type === 'physical'"
                    :to="`/staff/edit-donation/${donation.id}`"
                    class="text-green-600 hover:text-green-900 whitespace-nowrap text-xs"
                  >
                    Edit
                  </NuxtLink>
                  
                  <!-- Status Update Dropdown -->
                  <div class="relative inline-block">
                    <select
                      :value="donation.status"
                      @change="updateDonationStatus(donation.id, $event.target.value)"
                      class="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500 min-w-[90px]"
                      :class="getStatusSelectColor(donation.status)"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="processing" v-if="donation.type !== 'physical'">Processing</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <!-- Quick Complete Button (for pending items) -->
                  <button
                    v-if="donation.status === 'pending'"
                    @click="updateDonationStatus(donation.id, 'completed')"
                    class="text-green-600 hover:text-green-900 text-xs font-medium whitespace-nowrap"
                  >
                    ✓ Complete
                  </button>
                  
                  <!-- Quick Fail Button (for pending items) -->
                  <button
                    v-if="donation.status === 'pending'"
                    @click="updateDonationStatus(donation.id, 'failed')"
                    class="text-red-600 hover:text-red-900 text-xs font-medium whitespace-nowrap"
                  >
                    ✗ Fail
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
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span class="px-3 py-1 text-sm text-gray-700">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="currentPage < totalPages && currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Add Physical Donation Modal -->
    <div v-if="showAddPhysicalModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showAddPhysicalModal = false">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Add Physical Donation</h3>
            <button @click="showAddPhysicalModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="submitPhysicalDonation" class="space-y-4">
            <!-- Donor Search/Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Donor</label>
              <div class="relative">
                <input
                  v-model="modalForm.searchQuery"
                  @input="searchDonors"
                  type="text"
                  placeholder="Search by name or email..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  :class="{ 'border-red-300': modalForm.errors.donor }"
                />
                
                <!-- Search Results Dropdown -->
                <div v-if="modalForm.searchResults.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div
                    v-for="user in modalForm.searchResults"
                    :key="user.id"
                    @click="selectDonor(user)"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div class="font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
                
                <!-- No Results -->
                <div v-if="modalForm.searchQuery.length > 2 && !modalForm.isSearching && modalForm.searchResults.length === 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  <div class="px-3 py-2 text-gray-500">
                    No users found. 
                    <button 
                      type="button"
                      @click="modalForm.useManualEntry = true"
                      class="text-primary-600 hover:text-primary-800 ml-1"
                    >
                      Enter manually
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Selected Donor Display -->
              <div v-if="modalForm.selectedDonor" class="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="font-medium text-green-900">{{ modalForm.selectedDonor.first_name }} {{ modalForm.selectedDonor.last_name }}</div>
                    <div class="text-sm text-green-700">{{ modalForm.selectedDonor.email }}</div>
                  </div>
                  <button 
                    type="button"
                    @click="clearDonorSelection"
                    class="text-green-600 hover:text-green-800"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Manual Entry Fields -->
              <div v-if="modalForm.useManualEntry && !modalForm.selectedDonor" class="mt-2 space-y-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700">Enter donor details manually:</span>
                  <button 
                    type="button"
                    @click="modalForm.useManualEntry = false"
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <input
                  v-model="modalForm.donor_name"
                  type="text"
                  placeholder="Full name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  v-model="modalForm.donor_email"
                  type="email"
                  placeholder="Email (optional)"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div v-if="modalForm.errors.donor" class="text-red-500 text-sm mt-1">{{ modalForm.errors.donor }}</div>
            </div>

            <!-- Event Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Associated Event (Optional)</label>
              <select
                v-model="modalForm.event_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">No specific event (General donation)</option>
                <option v-for="event in availableEvents" :key="event.id" :value="event.id">
                  {{ event.title }} - {{ formatEventDate(event) }}
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Select an event if this donation is specifically for that event</p>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                v-model="modalForm.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="general">General</option>
                <option value="food">Food</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="electronics">Electronics</option>
                <option value="toys">Toys</option>
                <option value="household">Household Items</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Items Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Items Description *</label>
              <textarea
                v-model="modalForm.message"
                rows="3"
                placeholder="Describe the physical items donated..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                :class="{ 'border-red-300': modalForm.errors.message }"
                required
              ></textarea>
              <div v-if="modalForm.errors.message" class="text-red-500 text-sm mt-1">{{ modalForm.errors.message }}</div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="modalForm.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <!-- Submit Buttons -->
            <div class="flex space-x-3 pt-4">
              <button
                type="submit"
                :disabled="modalForm.isSubmitting"
                class="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ modalForm.isSubmitting ? 'Adding...' : 'Add Donation' }}
              </button>
              <button
                type="button"
                @click="showAddPhysicalModal = false"
                class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Enhanced Donation Details Modal -->
    <div v-if="showDetailsModal && selectedDonation" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showDetailsModal = false">
      <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Donation Details</h3>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-4 text-sm max-h-96 overflow-y-auto">
            <!-- Basic Donor Information -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-800 mb-3">Donor Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">Name:</span>
                  <span>{{ getDonorName(selectedDonation) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">Email:</span>
                  <span>{{ getDonorEmail(selectedDonation) || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">Type:</span>
                  <span class="capitalize">{{ formatType(selectedDonation.type, selectedDonation.event_id) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">Status:</span>
                  <span :class="getStatusColor(selectedDonation.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ selectedDonation.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Amount Information -->
            <div v-if="selectedDonation.type !== 'physical'" class="bg-green-50 p-4 rounded-lg">
              <h4 class="font-semibold text-green-800 mb-3">Payment Information</h4>
              <div class="flex justify-between items-center">
                <span class="font-medium text-green-700">Total Amount:</span>
                <span class="text-xl font-bold text-green-800">RM{{ selectedDonation.amount?.toFixed(2) || '0.00' }}</span>
              </div>
              <div v-if="selectedDonation.stripe_payment_intent_id" class="mt-2">
                <span class="text-xs text-green-600">Payment ID: {{ selectedDonation.stripe_payment_intent_id }}</span>
              </div>
            </div>
            
            <!-- Event Information -->
            <div v-if="selectedDonation.event_id && selectedDonation.events" class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-blue-800 mb-3">Event Information</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="font-medium text-blue-700">Event:</span>
                  <span class="text-blue-800 font-medium">{{ selectedDonation.events.title }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-blue-700">Event Date:</span>
                  <span>{{ formatEventDate(selectedDonation.events) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-blue-700">Event Type:</span>
                  <span class="capitalize">{{ selectedDonation.events.event_type }}</span>
                </div>
                <div v-if="selectedDonation.events.location" class="flex justify-between">
                  <span class="font-medium text-blue-700">Location:</span>
                  <span>{{ selectedDonation.events.location }}</span>
                </div>
                <div class="mt-3">
                  <button 
                    @click="goToEvent(selectedDonation.event_id)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    → View Event Details
                  </button>
                </div>
              </div>
            </div>

            <!-- Enhanced Purchase Details Section -->
            <div v-if="selectedDonation.event_id && selectedDonation.events?.event_type === 'selling' && donationOrderItems.length > 0" 
                 class="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
              <h4 class="font-bold text-purple-800 mb-4 flex items-center text-lg">
                <svg class="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                🛍️ Items Purchased
              </h4>
              
              <!-- Detailed list of purchased items -->
              <div class="space-y-3">
                <div v-for="(item, index) in donationOrderItems" :key="item.id" 
                     class="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                      <div class="flex items-start">
                        <span class="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-800 text-xs font-medium rounded-full mr-3 mt-0.5">
                          {{ index + 1 }}
                        </span>
                        <div class="flex-1">
                          <h5 class="font-semibold text-gray-900 text-base">{{ item.product_name }}</h5>
                          <div v-if="item.products?.description" class="text-sm text-gray-600 mt-1 leading-relaxed">
                            {{ item.products.description }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="item.products?.image_url" class="ml-4 flex-shrink-0">
                      <img :src="item.products.image_url" :alt="item.product_name" 
                           class="w-16 h-16 object-cover rounded-lg border border-gray-200">
                    </div>
                  </div>
                  
                  <!-- Purchase details in a clean grid -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-100">
                    <div class="text-center">
                      <div class="text-xs text-gray-500 uppercase tracking-wide">Quantity</div>
                      <div class="text-lg font-bold text-purple-800">{{ item.quantity }}</div>
                    </div>
                    <div class="text-center">
                      <div class="text-xs text-gray-500 uppercase tracking-wide">Unit Price</div>
                      <div class="text-lg font-bold text-purple-800">RM{{ item.product_price.toFixed(2) }}</div>
                    </div>
                    <div class="text-center">
                      <div class="text-xs text-gray-500 uppercase tracking-wide">Subtotal</div>
                      <div class="text-lg font-bold text-purple-900">RM{{ item.total_amount.toFixed(2) }}</div>
                    </div>
                    <div class="text-center">
                      <div class="text-xs text-gray-500 uppercase tracking-wide">Ordered</div>
                      <div class="text-sm font-medium text-gray-700">{{ formatDate(item.created_at) }}</div>
                    </div>
                  </div>
                  
                  <!-- Product status indicator -->
                  <div class="mt-3 pt-2 border-t border-gray-100">
                    <div v-if="!item.products" class="flex items-center text-xs text-red-600">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                      Product no longer available in system
                    </div>
                    <div v-else-if="!item.products.available" class="flex items-center text-xs text-orange-600">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Product currently unavailable
                    </div>
                    <div v-else class="flex items-center text-xs text-green-600">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Product still available
                      <span v-if="item.products.price !== item.product_price" class="ml-2 text-orange-600">
                        (Price changed: RM{{ item.products.price.toFixed(2) }})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Enhanced Purchase Summary -->
              <div class="mt-4 p-4 bg-white rounded-lg border-2 border-purple-300">
                <h5 class="font-bold text-purple-900 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  Purchase Summary
                </h5>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="text-center p-3 bg-purple-50 rounded-lg">
                    <div class="text-sm text-purple-600 font-medium">Total Items</div>
                    <div class="text-2xl font-bold text-purple-900">
                      {{ donationOrderItems.reduce((sum, item) => sum + item.quantity, 0) }}
                    </div>
                  </div>
                  
                  <div class="text-center p-3 bg-purple-50 rounded-lg">
                    <div class="text-sm text-purple-600 font-medium">Purchase Total</div>
                    <div class="text-2xl font-bold text-purple-900">
                      RM{{ donationOrderItems.reduce((sum, item) => sum + parseFloat(item.total_amount), 0).toFixed(2) }}
                    </div>
                  </div>
                  
                  <div class="text-center p-3 bg-purple-50 rounded-lg">
                    <div class="text-sm text-purple-600 font-medium">
                      {{ selectedDonation.amount > donationOrderItems.reduce((sum, item) => sum + parseFloat(item.total_amount), 0) ? 'Extra Donation' : 'Payment Type' }}
                    </div>
                    <div class="text-lg font-bold text-purple-900">
                      <span v-if="selectedDonation.amount > donationOrderItems.reduce((sum, item) => sum + parseFloat(item.total_amount), 0)">
                        +RM{{ (selectedDonation.amount - donationOrderItems.reduce((sum, item) => sum + parseFloat(item.total_amount), 0)).toFixed(2) }}
                      </span>
                      <span v-else class="text-base">
                        Purchase Only
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Grand Total -->
                <div v-if="selectedDonation.amount" class="mt-4 pt-4 border-t border-purple-200">
                  <div class="flex justify-between items-center">
                    <span class="text-lg font-semibold text-purple-800">Grand Total Paid:</span>
                    <span class="text-2xl font-bold text-purple-900">RM{{ selectedDonation.amount.toFixed(2) }}</span>
                  </div>
                  <div class="text-sm text-purple-600 mt-1">
                    {{ selectedDonation.amount > donationOrderItems.reduce((sum, item) => sum + parseFloat(item.total_amount), 0) 
                       ? 'Purchase + Additional Donation' : 'Purchase Amount Only' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading state -->
            <div v-else-if="selectedDonation.event_id && selectedDonation.events?.event_type === 'selling' && loadingOrderItems" 
                 class="bg-blue-50 p-4 rounded-lg">
              <div class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-blue-700">Loading purchase details...</span>
              </div>
            </div>

            <!-- No purchases (pure donation) -->
            <div v-else-if="selectedDonation.event_id && selectedDonation.events?.event_type === 'selling' && donationOrderItems.length === 0 && !loadingOrderItems" 
                 class="bg-green-50 p-4 rounded-lg">
              <div class="text-center text-green-700">
                <svg class="mx-auto h-8 w-8 text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <p class="font-medium">Pure Donation</p>
                <p class="text-sm text-green-600 mt-1">No items purchased - this was a generous donation to support the event</p>
              </div>
            </div>

            <!-- Category for non-event donations -->
            <div v-else class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-800 mb-3">Category</h4>
              <div class="flex justify-between">
                <span class="font-medium text-gray-700">Category:</span>
                <span class="capitalize">{{ selectedDonation.category || 'General' }}</span>
              </div>
            </div>
            
            <!-- Date Information -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-800 mb-3">Timeline</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">Created:</span>
                  <span>{{ formatDate(selectedDonation.created_at) }}</span>
                </div>
                <div v-if="selectedDonation.updated_at && selectedDonation.updated_at !== selectedDonation.created_at" class="flex justify-between">
                  <span class="font-medium text-gray-700">Last Updated:</span>
                  <span>{{ formatDate(selectedDonation.updated_at) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Message/Items Description -->
            <div v-if="selectedDonation.message" class="bg-yellow-50 p-4 rounded-lg">
              <h4 class="font-semibold text-yellow-800 mb-3">
                {{ selectedDonation.type === 'physical' ? 'Items Description' : 'Message' }}
              </h4>
              <p class="text-yellow-900">{{ selectedDonation.message }}</p>
            </div>
          </div>
          
          <div class="mt-6 flex space-x-3">
            <!-- Edit button for physical donations -->
            <NuxtLink
              v-if="selectedDonation.type === 'physical'"
              :to="`/staff/edit-donation/${selectedDonation.id}`"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Edit Donation
            </NuxtLink>
            
            <!-- Close button -->
            <button 
              @click="showDetailsModal = false"
              class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 transition-colors"
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
import { ref, reactive, computed, watch, onMounted } from 'vue';

definePageMeta({
  layout: 'staff',
  middleware: ['auth'] 
});

// Filters
const filters = ref({
  search: '',
  type: '',
  status: '',
  eventFilter: '',
  dateRange: ''
});

// Data
const currentPage = ref(1);
const itemsPerPage = 20;
const showAddPhysicalModal = ref(false);
const showDetailsModal = ref(false);
const selectedDonation = ref(null);
const availableEvents = ref([]);

// Order items data for detailed view
const donationOrderItems = ref([]);
const loadingOrderItems = ref(false);

// Modal form data
const modalForm = reactive({
  searchQuery: '',
  searchResults: [],
  selectedDonor: null,
  useManualEntry: false,
  isSearching: false,
  isSubmitting: false,
  donor_name: '',
  donor_email: '',
  event_id: '',
  category: 'general',
  message: '',
  status: 'pending',
  errors: {
    donor: '',
    message: ''
  }
});

// Fetch donations with event information
const { data: donations, pending, error, refresh } = useFetch('/api/staff/donations', {
  lazy: true,
  server: false,
  transform: (data) => data.donations || []
});

// Fetch available events for the modal
const fetchAvailableEvents = async () => {
  try {
    const { data } = await $fetch('/api/events/list', {
      method: 'GET'
    });
    availableEvents.value = data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    availableEvents.value = [];
  }
};

// Fetch order items for donation details
const fetchDonationOrderItems = async (donationId) => {
  loadingOrderItems.value = true;
  donationOrderItems.value = [];
  
  try {
    const response = await $fetch('/api/staff/donation-purchases', {
      method: 'POST',
      body: {
        donation_id: donationId
      }
    });
    
    donationOrderItems.value = response.orderItems || [];
  } catch (error) {
    console.error('Error fetching donation order items:', error);
    donationOrderItems.value = [];
  } finally {
    loadingOrderItems.value = false;
  }
};

// Computed properties
const stats = computed(() => {
  if (!donations.value) return { 
    totalDonations: 0, 
    totalAmount: 0, 
    physicalDonations: 0,
    activeDonors: 0 
  };
  
  const total = donations.value.length;
  const totalAmount = donations.value.filter(d => d.type !== 'physical').reduce((sum, d) => sum + (d.amount || 0), 0);
  const physical = donations.value.filter(d => d.type === 'physical').length;
  const uniqueDonors = new Set(donations.value.map(d => getDonorEmail(d) || getDonorName(d))).size;

  return { 
    totalDonations: total, 
    totalAmount, 
    physicalDonations: physical,
    activeDonors: uniqueDonors 
  };
});

const hasActiveFilters = computed(() => {
  return filters.value.search || 
         filters.value.type || 
         filters.value.status || 
         filters.value.eventFilter || 
         filters.value.dateRange;
});

const filteredDonations = computed(() => {
  if (!donations.value) return [];
  
  let filtered = [...donations.value];

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(donation => 
      getDonorName(donation).toLowerCase().includes(search) ||
      getDonorEmail(donation).toLowerCase().includes(search) ||
      (donation.events?.title || '').toLowerCase().includes(search) ||
      (donation.message || '').toLowerCase().includes(search) ||
      (donation.category || '').toLowerCase().includes(search)
    );
  }

  if (filters.value.type) {
    if (filters.value.type === 'event') {
      // Filter for donations with event_id
      filtered = filtered.filter(donation => donation.event_id);
    } else {
      // Filter for donations without event_id and matching type
      filtered = filtered.filter(donation => !donation.event_id && donation.type === filters.value.type);
    }
  }

  if (filters.value.status) {
    filtered = filtered.filter(donation => donation.status === filters.value.status);
  }

  if (filters.value.eventFilter) {
    if (filters.value.eventFilter === 'event') {
      filtered = filtered.filter(donation => donation.event_id);
    } else if (filters.value.eventFilter === 'general') {
      filtered = filtered.filter(donation => !donation.event_id);
    }
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
        default: return true;
      }
    });
  }

  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const totalPages = computed(() => Math.ceil(filteredDonations.value.length / itemsPerPage));

const paginatedDonations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredDonations.value.slice(start, start + itemsPerPage);
});

// Helper functions
const getDonorName = (donation) => {
  if (donation.profiles?.first_name && donation.profiles?.last_name) {
    return `${donation.profiles.first_name} ${donation.profiles.last_name}`;
  }
  return donation.donor_name || 'Anonymous Donor';
};

const getDonorEmail = (donation) => donation.profiles?.email || donation.donor_email || '';

const getDonorInitials = (donation) => {
  const name = getDonorName(donation);
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

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

const formatEventDate = (event) => {
  if (!event) return 'Unknown Date';
  
  const startDate = new Date(event.event_startdate);
  const endDate = new Date(event.event_enddate);
  
  const formatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  if (startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString('en-US', formatOptions);
  } else {
    return `${startDate.toLocaleDateString('en-US', formatOptions)} - ${endDate.toLocaleDateString('en-US', formatOptions)}`;
  }
};

// Clear all filters function
const clearAllFilters = () => {
  filters.value = {
    search: '',
    type: '',
    status: '',
    eventFilter: '',
    dateRange: ''
  };
  currentPage.value = 1;
};

// Navigation function
const goToEvent = (eventId) => {
  navigateTo(`/events/${eventId}`);
};

// Modal functions
let searchTimeout;
const searchDonors = async () => {
  clearTimeout(searchTimeout);
  
  if (modalForm.searchQuery.length < 2) {
    modalForm.searchResults = [];
    return;
  }
  
  searchTimeout = setTimeout(async () => {
    modalForm.isSearching = true;
    
    try {
      const response = await $fetch('/api/staff/search-users', {
        method: 'POST',
        body: {
          query: modalForm.searchQuery
        }
      });
      
      modalForm.searchResults = response.users || [];
    } catch (error) {
      console.error('Search error:', error);
      modalForm.searchResults = [];
    } finally {
      modalForm.isSearching = false;
    }
  }, 300);
};

const selectDonor = (user) => {
  modalForm.selectedDonor = user;
  modalForm.searchQuery = `${user.first_name} ${user.last_name}`;
  modalForm.searchResults = [];
  modalForm.useManualEntry = false;
  modalForm.errors.donor = '';
};

const clearDonorSelection = () => {
  modalForm.selectedDonor = null;
  modalForm.searchQuery = '';
  modalForm.searchResults = [];
  modalForm.useManualEntry = false;
};

const validateModalForm = () => {
  modalForm.errors.donor = '';
  modalForm.errors.message = '';
  
  // Check if donor is selected or manual entry is provided
  if (!modalForm.selectedDonor && !modalForm.useManualEntry) {
    modalForm.errors.donor = 'Please select a donor or enter manually';
    return false;
  }
  
  if (modalForm.useManualEntry && !modalForm.donor_name.trim()) {
    modalForm.errors.donor = 'Donor name is required';
    return false;
  }
  
  if (!modalForm.message.trim()) {
    modalForm.errors.message = 'Items description is required';
    return false;
  }
  
  return true;
};

const submitPhysicalDonation = async () => {
  if (!validateModalForm()) {
    return;
  }
  
  modalForm.isSubmitting = true;
  
  try {
    const donationData = {
      // Use selected donor ID or null for manual entry
      donor_id: modalForm.selectedDonor?.id || null,
      donor_name: modalForm.selectedDonor ? 
        `${modalForm.selectedDonor.first_name} ${modalForm.selectedDonor.last_name}` : 
        modalForm.donor_name,
      donor_email: modalForm.selectedDonor?.email || modalForm.donor_email || null,
      event_id: modalForm.event_id || null,
      category: modalForm.category,
      message: modalForm.message,
      status: modalForm.status
    };
    
    const response = await $fetch('/api/donations/add-physical', {
      method: 'POST',
      body: donationData
    });
    
    // Reset form and close modal
    resetModalForm();
    showAddPhysicalModal.value = false;
    
    // Refresh donations list
    await refresh();
    
    alert(response.message || 'Physical donation added successfully!');
    
  } catch (error) {
    console.error('Error adding physical donation:', error);
    alert('Failed to add donation. Please try again.');
  } finally {
    modalForm.isSubmitting = false;
  }
};

const resetModalForm = () => {
  modalForm.selectedDonor = null;
  modalForm.searchQuery = '';
  modalForm.searchResults = [];
  modalForm.useManualEntry = false;
  modalForm.donor_name = '';
  modalForm.donor_email = '';
  modalForm.event_id = '';
  modalForm.category = 'general';
  modalForm.message = '';
  modalForm.status = 'pending';
  modalForm.errors.donor = '';
  modalForm.errors.message = '';
};

// Enhanced status update function with confirmation
const updateDonationStatus = async (donationId, newStatus) => {
  const donation = donations.value.find(d => d.id === donationId);
  const donorName = getDonorName(donation);
  const donationType = formatType(donation.type, donation.event_id);
  const isEventDonation = donation.event_id ? ` for ${donation.events?.title}` : '';
  
  // Confirmation message based on status change
  let confirmMessage = '';
  if (newStatus === 'completed') {
    confirmMessage = `Mark ${donationType}${isEventDonation} from ${donorName} as completed?`;
    if (donation.type === 'physical') {
      confirmMessage += '\n\nThis means the physical items have been received.';
    }
  } else if (newStatus === 'failed') {
    confirmMessage = `Mark ${donationType}${isEventDonation} from ${donorName} as failed?`;
    if (donation.type === 'physical') {
      confirmMessage += '\n\nThis means the promised items were not received.';
    }
  } else if (newStatus === 'cancelled') {
    confirmMessage = `Cancel ${donationType}${isEventDonation} from ${donorName}?`;
  } else {
    confirmMessage = `Change ${donationType}${isEventDonation} from ${donorName} to ${newStatus}?`;
  }
  
  if (!confirm(confirmMessage)) {
    return;
  }

  try {
    // Show loading state
    const originalStatus = donation.status;
    donation.status = 'updating...';
    
    await $fetch('/api/donations/update-status', {
      method: 'POST',
      body: { 
        donation_id: donationId, 
        status: newStatus,
        source: 'staff' // Tell API this is a staff update
      }
    });
    
    // Update local data
    donation.status = newStatus;
    donation.updated_at = new Date().toISOString();
    
    // Show success message based on donation type and status
    let successMessage = '';
    if (donation.type === 'physical' && newStatus === 'completed') {
      successMessage = 'Physical donation marked as received!';
    } else if (donation.type === 'physical' && newStatus === 'failed') {
      successMessage = 'Physical donation marked as not received.';
    } else {
      successMessage = `Donation status updated to ${newStatus}!`;
    }
    
    alert(successMessage);
    
  } catch (error) {
    console.error('Error updating donation status:', error);
    
    // Revert the status on error
    donation.status = originalStatus;
    
    alert('Failed to update donation status. Please try again.');
  }
};

// Function to get appropriate colors for status select dropdown
const getStatusSelectColor = (status) => {
  const colors = {
    pending: 'text-yellow-700 bg-yellow-50 border-yellow-300',
    completed: 'text-green-700 bg-green-50 border-green-300',
    processing: 'text-blue-700 bg-blue-50 border-blue-300',
    failed: 'text-red-700 bg-red-50 border-red-300',
    cancelled: 'text-gray-700 bg-gray-50 border-gray-300',
    'updating...': 'text-gray-500 bg-gray-100 border-gray-300'
  };
  return colors[status] || 'text-gray-700 bg-white border-gray-300';
};

// Actions
const viewDonationDetails = (donation) => {
  selectedDonation.value = donation;
  showDetailsModal.value = true;
  
  // Fetch order items if this is an event donation with selling type
  if (donation.event_id && donation.events?.event_type === 'selling') {
    fetchDonationOrderItems(donation.id);
  }
};

const exportToCsv = () => {
  const csvData = filteredDonations.value.map(donation => ({
    'Date': formatDate(donation.created_at),
    'Donor': getDonorName(donation),
    'Email': getDonorEmail(donation),
    'Type': formatType(donation.type, donation.event_id),
    'Amount': donation.type === 'physical' ? 'N/A' : donation.amount.toFixed(2),
    'Event': donation.events?.title || 'N/A',
    'Category': donation.category || 'General',
    'Status': donation.status,
    'Message': donation.message || ''
  }));

  const csv = Object.keys(csvData[0]).join(',') + '\n' + 
    csvData.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Reset pagination when filters change
watch([filters], () => currentPage.value = 1, { deep: true });

// Reset modal form when modal closes
watch(showAddPhysicalModal, (newValue) => {
  if (!newValue) {
    resetModalForm();
  }
});

// Reset order items when modal closes
watch(showDetailsModal, (newValue) => {
  if (!newValue) {
    donationOrderItems.value = [];
    loadingOrderItems.value = false;
  }
});

// Initialize
onMounted(() => {
  fetchAvailableEvents();
});
</script>