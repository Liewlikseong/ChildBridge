<!-- pages/volunteers.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <NuxtLink
            to="/profile"
            class="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Profile
          </NuxtLink>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">My Volunteer Applications</h1>
        <p class="text-gray-600">Track and manage your volunteer event applications</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading your volunteer applications...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="text-red-800">{{ error }}</div>
      </div>

      <!-- No Applications State -->
      <div v-else-if="volunteerApplications.length === 0" class="text-center py-16">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <h3 class="text-lg font-semibold text-gray-600 mb-2">No Volunteer Applications</h3>
        <p class="text-gray-500 mb-6">You haven't applied to volunteer for any events yet.</p>
        <NuxtLink 
          to="/events" 
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Browse Events
        </NuxtLink>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-primary-100 mr-4">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Total Applications</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalApplications }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 mr-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p class="text-2xl font-bold text-gray-900">{{ upcomingEvents }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-gray-100 mr-4">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Completed</p>
                <p class="text-2xl font-bold text-gray-900">{{ pastEvents }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="flex flex-wrap gap-2">
              <button 
                @click="activeFilter = 'all'"
                :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                         activeFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
              >
                All Applications
              </button>
              <button 
                @click="activeFilter = 'upcoming'"
                :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                         activeFilter === 'upcoming' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
              >
                Upcoming
              </button>
              <button 
                @click="activeFilter = 'ongoing'"
                :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                         activeFilter === 'ongoing' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
              >
                Ongoing
              </button>
              <button 
                @click="activeFilter = 'past'"
                :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                         activeFilter === 'past' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
              >
                Past Events
              </button>
            </div>
          </div>
        </div>

        <!-- Applications Grid -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div v-if="filteredApplications.length === 0" class="text-center py-12">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <h3 class="text-lg font-semibold text-gray-600 mb-2">No applications found</h3>
            <p class="text-gray-500">No volunteer applications match the current filter.</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            <div 
              v-for="application in filteredApplications" 
              :key="application.id"
              class="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <!-- Event Status Badge -->
              <div class="p-4 pb-2">
                <div class="flex items-center justify-between mb-3">
                  <span 
                    :class="[
                      'inline-block text-white text-xs font-medium px-2 py-1 rounded-full',
                      getEventStatus(application.events) === 'upcoming' ? 'bg-green-500' :
                      getEventStatus(application.events) === 'ongoing' ? 'bg-blue-500' : 'bg-gray-500'
                    ]"
                  >
                    {{ getEventStatus(application.events).toUpperCase() }}
                  </span>
                  <span class="text-xs text-gray-500">
                    Applied {{ formatDate(application.created_at) }}
                  </span>
                </div>
              </div>

              <!-- Event Media -->
              <div class="relative">
                <div v-if="getCurrentMedia(application.events)" class="aspect-w-16 aspect-h-9">
                  <img 
                    v-if="getCurrentMedia(application.events).type === 'image'"
                    :src="getCurrentMedia(application.events).url" 
                    :alt="application.events.title"
                    class="w-full h-48 object-cover"
                  />
                  <video 
                    v-else-if="getCurrentMedia(application.events).type === 'video'"
                    :src="getCurrentMedia(application.events).url"
                    class="w-full h-48 object-cover"
                    muted
                  ></video>
                </div>
                <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>

              <!-- Event Content -->
              <div class="p-4">
                <div class="mb-3">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ application.events.title }}</h3>
                  
                  <!-- Event Date -->
                  <div class="flex items-center text-sm text-gray-600 mb-2">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    {{ formatEventDate(application.events) }}
                  </div>

                  <!-- Location -->
                  <div v-if="application.events.location" class="flex items-center text-sm text-gray-600 mb-2">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                    </svg>
                    {{ application.events.location }}
                  </div>

                  <!-- Event Description -->
                  <p class="text-sm text-gray-600 line-clamp-2 mb-4">{{ application.events.content }}</p>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col space-y-2">
                  <NuxtLink 
                    :to="`/events/${application.events.id}`"
                    class="w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    View Event Details
                  </NuxtLink>
                  
                  <button
                    v-if="getEventStatus(application.events) === 'upcoming'"
                    @click="cancelApplication(application.id)"
                    class="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Cancel Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreApplications" class="text-center mt-8">
          <button
            @click="loadMoreApplications"
            :disabled="loadingMore"
            class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {{ loadingMore ? 'Loading...' : 'Load More Applications' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

definePageMeta({
  middleware: ['auth']
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Reactive data
const volunteerApplications = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const activeFilter = ref('all');
const hasMoreApplications = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed properties
const totalApplications = computed(() => volunteerApplications.value.length);

const upcomingEvents = computed(() => {
  return volunteerApplications.value.filter(app => 
    getEventStatus(app.events) === 'upcoming'
  ).length;
});

const pastEvents = computed(() => {
  return volunteerApplications.value.filter(app => 
    getEventStatus(app.events) === 'past'
  ).length;
});

const filteredApplications = computed(() => {
  let filtered = volunteerApplications.value;

  if (activeFilter.value === 'upcoming') {
    filtered = filtered.filter(app => getEventStatus(app.events) === 'upcoming');
  } else if (activeFilter.value === 'ongoing') {
    filtered = filtered.filter(app => getEventStatus(app.events) === 'ongoing');
  } else if (activeFilter.value === 'past') {
    filtered = filtered.filter(app => getEventStatus(app.events) === 'past');
  }

  return filtered;
});

// Helper functions
const getEventStatus = (event) => {
  if (!event) return 'unknown';
  
  const now = new Date();
  const startDate = new Date(event.event_startdate);
  const endDate = new Date(event.event_enddate);
  
  if (now < startDate) return 'upcoming';
  if (now > endDate) return 'past';
  return 'ongoing';
};

const getCurrentMedia = (event) => {
  if (!event) return null;
  
  if (event.media_files && event.media_files.length > 0) {
    return event.media_files[0];
  }
  if (event.poster_url) {
    return { type: 'image', url: event.poster_url };
  }
  return null;
};

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

// Fetch volunteer applications
const fetchVolunteerApplications = async () => {
  if (!user.value) {
    console.log('No user found');
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    console.log('Fetching applications for user:', user.value.id);

    const { data, error: fetchError } = await supabase
      .from('volunteer')
      .select(`
        *,
        events (
          id,
          title,
          content,
          location,
          event_startdate,
          event_enddate,
          event_type,
          poster_url,
          media_files,
          published
        )
      `)
      .eq('volunteer_id', user.value.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Supabase error:', fetchError);
      throw fetchError;
    }
    
    console.log('Applications fetched:', data);
    volunteerApplications.value = data || [];
    hasMoreApplications.value = false;
  } catch (err) {
    console.error('Error fetching volunteer applications:', err);
    error.value = err.message || 'Failed to load your volunteer applications';
  } finally {
    loading.value = false;
  }
};

// Load more applications (pagination)
const loadMoreApplications = async () => {
  if (!user.value || loadingMore.value) return;

  try {
    loadingMore.value = true;
    currentPage.value++;

    const { data, error: fetchError } = await supabase
      .from('volunteer')
      .select(`
        *,
        events (
          id,
          title,
          content,
          location,
          event_startdate,
          event_enddate,
          event_type,
          poster_url,
          media_files,
          published
        )
      `)
      .eq('volunteer_id', user.value.id)
      .order('created_at', { ascending: false })
      .range((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage - 1);

    if (fetchError) throw fetchError;
    
    if (data && data.length > 0) {
      volunteerApplications.value.push(...data);
      hasMoreApplications.value = data.length === itemsPerPage;
    } else {
      hasMoreApplications.value = false;
    }
  } catch (err) {
    console.error('Error loading more applications:', err);
    currentPage.value--; // Revert page increment on error
  } finally {
    loadingMore.value = false;
  }
};

// Cancel volunteer application
const cancelApplication = async (applicationId) => {
  if (!confirm('Are you sure you want to cancel your volunteer application?')) return;

  try {
    const { error } = await supabase
      .from('volunteer')
      .delete()
      .eq('id', applicationId);

    if (error) throw error;

    // Remove from local state
    volunteerApplications.value = volunteerApplications.value.filter(
      app => app.id !== applicationId
    );

    alert('Your volunteer application has been cancelled.');
  } catch (err) {
    console.error('Error cancelling application:', err);
    alert('Failed to cancel your volunteer application. Please try again.');
  }
};

// Watch for user changes
watch(user, (newUser) => {
  console.log('User changed:', newUser);
  if (newUser) {
    fetchVolunteerApplications();
  }
}, { immediate: true });

// Initialize
onMounted(() => {
  console.log('Component mounted, user:', user.value);
  if (user.value) {
    fetchVolunteerApplications();
  }
});
</script>

