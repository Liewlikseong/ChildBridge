<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Staff Dashboard</h1>
    <p class="mb-8">Welcome to the staff dashboard. Here you can find tools and information relevant to your role.</p>

    <!-- Quick Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Today's Donations</p>
            <p class="text-2xl font-bold text-gray-900">{{ todayStats.count }}</p>
            <p class="text-sm text-gray-500">RM{{ todayStats.amount.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Physical Donations</p>
            <p class="text-2xl font-bold text-gray-900">{{ physicalStats.count }}</p>
            <p class="text-sm text-gray-500">This month</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 mr-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Pending Actions</p>
            <p class="text-2xl font-bold text-gray-900">{{ pendingStats.count }}</p>
            <p class="text-sm text-gray-500">Need review</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100 mr-4">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Active Volunteers</p>
            <p class="text-2xl font-bold text-gray-900">{{ volunteerStats.count }}</p>
            <p class="text-sm text-gray-500">This month</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          @click="showAddPhysicalModal = true"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg class="w-8 h-8 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <div class="text-left">
            <p class="font-medium">Add Physical Donation</p>
            <p class="text-sm text-gray-500">Record offline donations</p>
          </div>
        </button>

        <NuxtLink
          to="/staff/donations"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
          <div class="text-left">
            <p class="font-medium">Manage Donations</p>
            <p class="text-sm text-gray-500">View and manage all donations</p>
          </div>
        </NuxtLink>

        <NuxtLink
          to="/staff/volunteers"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg class="w-8 h-8 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <div class="text-left">
            <p class="font-medium">Manage Volunteers</p>
            <p class="text-sm text-gray-500">View and manage volunteers</p>
          </div>
        </NuxtLink>

        <button
          @click="exportReport"
          class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <div class="text-left">
            <p class="font-medium">Export Report</p>
            <p class="text-sm text-gray-500">Download donation report</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Two Column Layout for Recent Activities -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Donations -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">Recent Donations</h2>
            <NuxtLink
              to="/staff/donations"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </NuxtLink>
          </div>
        </div>

        <div v-if="recentDonationsLoading" class="p-6 text-gray-500">
          Loading recent donations...
        </div>
        <div v-else-if="recentDonationsError" class="p-6 text-red-500">
          Failed to load recent donations
        </div>
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="donation in recentDonations"
            :key="donation.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-600">
                      {{ getDonorInitials(donation) }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">{{ getDonorName(donation) }}</p>
                  <p class="text-sm text-gray-500">
                    {{ formatType(donation.type) }} - {{ donation.category || 'General' }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">
                  {{ donation.type === 'physical' ? 'Physical' : `RM${donation.amount.toFixed(2)}` }}
                </p>
                <p class="text-sm text-gray-500">{{ formatDate(donation.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Volunteers -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">Recent Volunteers</h2>
            <NuxtLink
              to="/staff/volunteers"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </NuxtLink>
          </div>
        </div>

        <div v-if="recentVolunteersLoading" class="p-6 text-gray-500">
          Loading recent volunteers...
        </div>
        <div v-else-if="recentVolunteersError" class="p-6 text-red-500">
          Failed to load recent volunteers
        </div>
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="volunteer in recentVolunteers"
            :key="`${volunteer.volunteer_id}-${volunteer.event_id}`"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-orange-600">
                      {{ getVolunteerInitials(volunteer) }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">{{ getVolunteerName(volunteer) }}</p>
                  <p class="text-sm text-gray-500">{{ volunteer.events?.title || 'Unknown Event' }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ formatDate(volunteer.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Physical Donation Modal -->
    <AddPhysicalDonationModal
      v-if="showAddPhysicalModal"
      @close="showAddPhysicalModal = false"
      @success="handlePhysicalDonationAdded"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSupabaseClient } from '#imports';

definePageMeta({
  layout: 'staff',
  middleware: ['auth'] 
});

const supabase = useSupabaseClient();
const showAddPhysicalModal = ref(false);

// Reactive data
const donations = ref([]);
const volunteers = ref([]);
const recentDonationsLoading = ref(true);
const recentDonationsError = ref(null);
const recentVolunteersLoading = ref(true);
const recentVolunteersError = ref(null);

// Fetch donations data
const fetchDonations = async () => {
  try {
    recentDonationsLoading.value = true;
    recentDonationsError.value = null;

    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        profiles:donor_id (
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    donations.value = data || [];
  } catch (err) {
    console.error('Error fetching donations:', err);
    recentDonationsError.value = err.message;
  } finally {
    recentDonationsLoading.value = false;
  }
};

// Fetch volunteers data
const fetchVolunteers = async () => {
  try {
    recentVolunteersLoading.value = true;
    recentVolunteersError.value = null;

    const { data, error } = await supabase
      .from('volunteer')
      .select(`
        *,
        profiles:volunteer_id (
          first_name,
          last_name,
          email
        ),
        events:event_id (
          title,
          event_startdate,
          event_enddate
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    volunteers.value = data || [];
  } catch (err) {
    console.error('Error fetching volunteers:', err);
    recentVolunteersError.value = err.message;
  } finally {
    recentVolunteersLoading.value = false;
  }
};

// Computed stats
const todayStats = computed(() => {
  if (!donations.value) return { count: 0, amount: 0 };
  
  const today = new Date().toDateString();
  const todayDonations = donations.value.filter(d => 
    new Date(d.created_at).toDateString() === today
  );
  
  return {
    count: todayDonations.length,
    amount: todayDonations
      .filter(d => d.type !== 'physical')
      .reduce((sum, d) => sum + (d.amount || 0), 0)
  };
});

const physicalStats = computed(() => {
  if (!donations.value) return { count: 0 };
  
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  
  const physicalDonations = donations.value.filter(d => 
    d.type === 'physical' && new Date(d.created_at) >= thisMonth
  );
  
  return { count: physicalDonations.length };
});

const pendingStats = computed(() => {
  if (!donations.value) return { count: 0 };
  
  const pending = donations.value.filter(d => d.status === 'pending');
  return { count: pending.length };
});

const volunteerStats = computed(() => {
  if (!volunteers.value) return { count: 0 };
  
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  
  const thisMonthVolunteers = volunteers.value.filter(v => 
    new Date(v.created_at) >= thisMonth
  );
  
  return { count: thisMonthVolunteers.length };
});

const recentDonations = computed(() => {
  if (!donations.value) return [];
  return donations.value
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
});

const recentVolunteers = computed(() => {
  if (!volunteers.value) return [];
  return volunteers.value
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
});

// Helper functions
const getDonorName = (donation) => {
  if (donation.profiles?.first_name && donation.profiles?.last_name) {
    return `${donation.profiles.first_name} ${donation.profiles.last_name}`;
  }
  return donation.donor_name || 'Anonymous Donor';
};

const getDonorInitials = (donation) => {
  const name = getDonorName(donation);
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getVolunteerName = (volunteer) => {
  if (volunteer.profiles?.first_name && volunteer.profiles?.last_name) {
    return `${volunteer.profiles.first_name} ${volunteer.profiles.last_name}`;
  }
  return volunteer.profiles?.email || 'Unknown Volunteer';
};

const getVolunteerInitials = (volunteer) => {
  const name = getVolunteerName(volunteer);
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatType = (type) => {
  const types = {
    onetime: 'One-time',
    subscription: 'Monthly',
    physical: 'Physical'
  };
  return types[type] || type;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Actions
const handlePhysicalDonationAdded = () => {
  showAddPhysicalModal.value = false;
  fetchDonations();
};

const exportReport = async () => {
  try {
    const response = await $fetch('/api/staff/export-donations');
    
    // Create and download CSV
    const blob = new Blob([response.csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    alert('Failed to export report');
  }
};

// Initialize data
onMounted(async () => {
  await Promise.all([
    fetchDonations(),
    fetchVolunteers()
  ]);
});
</script>
