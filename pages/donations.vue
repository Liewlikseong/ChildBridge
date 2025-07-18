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
};<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold mb-2">Donation Management</h1>
        <p class="text-gray-600">View and manage all user donations including event-specific donations</p>
      </div>
      <button
        @click="showAddPhysicalModal = true"
        class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Add Physical Donation
      </button>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-2xl font-bold text-gray-900">{{ stats.totalDonations }}</div>
        <div class="text-sm text-gray-600">Total Donations</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-2xl font-bold text-gray-900">RM{{ stats.totalAmount.toFixed(2) }}</div>
        <div class="text-sm text-gray-600">Total Amount</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-2xl font-bold text-gray-900">{{ stats.physicalDonations }}</div>
        <div class="text-sm text-gray-600">Physical Donations</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-2xl font-bold text-gray-900">{{ stats.eventDonations }}</div>
        <div class="text-sm text-gray-600">Event Donations</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-2xl font-bold text-gray-900">{{ stats.activeDonors }}</div>
        <div class="text-sm text-gray-600">Active Donors</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
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
        </select>
        <select v-model="filters.status" class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select v-model="filters.eventFilter" class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option value="">All Donations</option>
          <option value="general">General Donations</option>
          <option value="event">Event Donations</option>
        </select>
        <select v-model="filters.dateRange" class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <button
          @click="exportToCsv"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Export CSV
        </button>
      </div>
    </div>

    <!-- Donations Table -->
    <div v-if="pending" class="text-gray-500">Loading donations...</div>
    <div v-else-if="error" class="text-red-500">Failed to load donations: {{ error.message }}</div>
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 250px;">Donor</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 100px;">Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 120px;">Amount</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 200px;">Event/Category</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 120px;">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 180px;">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="min-width: 300px;">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="donation in paginatedDonations" :key="donation.id" class="hover:bg-gray-50">
              <td class="px-4 py-4" style="min-width: 250px;">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span class="text-sm font-medium text-primary-600">
                        {{ getDonorInitials(donation) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="text-sm font-medium text-gray-900">
                      {{ getDonorName(donation) }}
                    </div>
                    <div class="text-sm text-gray-500">{{ getDonorEmail(donation) }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4" style="min-width: 100px;">
                <span :class="getTypeColor(donation.type)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap">
                  {{ formatType(donation.type) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-900" style="min-width: 120px;">
                {{ donation.type === 'physical' ? 'N/A' : `RM${donation.amount.toFixed(2)}` }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-500" style="min-width: 200px;">
                <!-- Event Information -->
                <div v-if="donation.event_id && donation.events">
                  <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                      </svg>
                      Event
                    </span>
                  </div>
                  <div class="mt-1 font-medium text-gray-900 truncate" :title="donation.events.title">
                    {{ donation.events.title }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatEventDate(donation.events) }}
                  </div>
                </div>
                <!-- Regular Category -->
                <div v-else>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                    </svg>
                    General
                  </span>
                  <div class="mt-1 text-gray-900 capitalize">
                    {{ donation.category || 'General' }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-4" style="min-width: 120px;">
                <span :class="getStatusColor(donation.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap">
                  {{ donation.status }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500" style="min-width: 180px;">
                {{ formatDate(donation.created_at) }}
              </td>
              <td class="px-4 py-4 text-sm font-medium" style="min-width: 300px;">
                <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                  <!-- View Details Button -->
                  <button 
                    @click="viewDonationDetails(donation)" 
                    class="text-primary-600 hover:text-primary-900 whitespace-nowrap"
                  >
                    View
                  </button>
                  
                  <!-- View Event Button (for event donations) -->
                  <NuxtLink
                    v-if="donation.event_id"
                    :to="`/events/${donation.event_id}`"
                    class="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                    target="_blank"
                  >
                    View Event
                  </NuxtLink>
                  
                  <!-- Edit Button - only for physical donations -->
                  <NuxtLink
                    v-if="donation.type === 'physical'"
                    :to="`/staff/edit-donation/${donation.id}`"
                    class="text-green-600 hover:text-green-900 whitespace-nowrap"
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
                <div v-else-if="modalForm.searchQuery.length > 2 && !modalForm.isSearching && modalForm.searchResults.length === 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
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
              <span class="font-medium text-gray-700">Donor:</span>
              <span>{{ getDonorName(selectedDonation) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Email:</span>
              <span>{{ getDonorEmail(selectedDonation) || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Type:</span>
              <span class="capitalize">{{ selectedDonation.type }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Amount:</span>
              <span>{{ selectedDonation.type === 'physical' ? 'N/A' : `RM${selectedDonation.amount.toFixed(2)}` }}</span>
            </div>
            
            <!-- Event Information -->
            <div v-if="selectedDonation.event_id && selectedDonation.events" class="border-t pt-3">
              <div class="flex justify-between mb-2">
                <span class="font-medium text-gray-700">Event:</span>
                <span class="text-blue-600">{{ selectedDonation.events.title }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium text-gray-700">Event Date:</span>
                <span>{{ formatEventDate(selectedDonation.events) }}</span>
              </div>
              <div class="mt-2">
                <NuxtLink 
                  :to="`/events/${selectedDonation.event_id}`"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  → View Event Details
                </NuxtLink>
              </div>
            </div>
            <div v-else class="flex justify-between">
              <span class="font-medium text-gray-700">Category:</span>
              <span class="capitalize">{{ selectedDonation.category || 'General' }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Status:</span>
              <span :class="getStatusColor(selectedDonation.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ selectedDonation.status }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-700">Date:</span>
              <span>{{ formatDate(selectedDonation.created_at) }}</span>
            </div>
            
            <div v-if="selectedDonation.message" class="pt-3 border-t">
              <span class="font-medium text-gray-700">Message/Items:</span>
              <p class="mt-1 text-gray-600">{{ selectedDonation.message }}</p>
            </div>
          </div>
          
          <div class="mt-6">
            <button 
              @click="showDetailsModal = false"
              class="w-full px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
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

// Data
const currentPage = ref(1);
const itemsPerPage = 20;
const showAddPhysicalModal = ref(false);
const showDetailsModal = ref(false);
const selectedDonation = ref(null);
const availableEvents = ref([]);

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

// Filters
const filters = ref({
  search: '',
  type: '',
  status: '',
  eventFilter: '',
  dateRange: ''
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

// Computed properties
const stats = computed(() => {
  if (!donations.value) return { 
    totalDonations: 0, 
    totalAmount: 0, 
    physicalDonations: 0, 
    eventDonations: 0,
    activeDonors: 0 
  };
  
  const total = donations.value.length;
  const totalAmount = donations.value.filter(d => d.type !== 'physical').reduce((sum, d) => sum + (d.amount || 0), 0);
  const physical = donations.value.filter(d => d.type === 'physical').length;
  const eventDonations = donations.value.filter(d => d.event_id).length;
  const uniqueDonors = new Set(donations.value.map(d => getDonorEmail(d) || getDonorName(d))).size;

  return { 
    totalDonations: total, 
    totalAmount, 
    physicalDonations: physical, 
    eventDonations,
    activeDonors: uniqueDonors 
  };
});

const filteredDonations = computed(() => {
  if (!donations.value) return [];
  
  let filtered = [...donations.value];

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    filtered = filtered.filter(donation => 
      getDonorName(donation).toLowerCase().includes(search) ||
      getDonorEmail(donation).toLowerCase().includes(search) ||
      (donation.events?.title || '').toLowerCase().includes(search)
    );
  }

  if (filters.value.type) {
    filtered = filtered.filter(donation => donation.type === filters.value.type);
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

const formatType = (type) => ({ 
  onetime: 'One-time', 
  subscription: 'Monthly', 
  physical: 'Physical' 
}[type] || type);

const getTypeColor = (type) => ({
  onetime: 'bg-blue-100 text-blue-800',
  subscription: 'bg-green-100 text-green-800',
  physical: 'bg-purple-100 text-purple-800'
}[type] || 'bg-gray-100 text-gray-800');

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
    
    console.log('Submitting donation:', donationData);
    
    const response = await $fetch('/api/donations/add-physical', {
      method: 'POST',
      body: donationData
    });
    
    console.log('Donation added:', response);
    
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
  const donationType = formatType(donation.type);
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
};

const exportToCsv = () => {
  const csvData = filteredDonations.value.map(donation => ({
    'Donor': getDonorName(donation),
    'Email': getDonorEmail(donation),
    'Type': formatType(donation.type),
    'Amount': donation.type === 'physical' ? 'N/A' : donation.amount.toFixed(2),
    'Event': donation.events?.title || 'N/A',
    'Category': donation.category || 'General',
    'Status': donation.status,
    'Date': formatDate(donation.created_at),
    'Items': donation.message || ''
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

// Initialize
onMounted(() => {
  fetchAvailableEvents();
});
</script>