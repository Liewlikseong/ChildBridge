<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary-900 text-white py-16">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Latest Events</h1>
          <p class="text-xl text-primary-100">Stay informed about upcoming events and activities from Jing Sun Welfare Society.</p>
        </div>
      </div>
    </section>

    <!-- Events List -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="mb-8 flex justify-between items-center">
          <h2 class="text-3xl font-bold">All Events</h2>
          <div v-if="isStaff">
            <NuxtLink 
              to="/events/new" 
              class="btn btn-primary"
            >
              Create New Event
            </NuxtLink>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="mb-8 flex flex-wrap gap-2">
          <button 
            @click="activeFilter = 'all'"
            :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                     activeFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
          >
            All Events
          </button>
          <button 
            @click="activeFilter = 'upcoming'"
            :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                     activeFilter === 'upcoming' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
          >
            Upcoming
          </button>
          <button 
            @click="activeFilter = 'past'"
            :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                     activeFilter === 'past' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
          >
            Past Events
          </button>
        </div>

        <!-- Events Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="event in displayedEvents" 
            :key="event.id" 
            class="card hover:shadow-lg transition-shadow relative"
          >
            <!-- Unpublished Badge (Staff Only) -->
            <div 
              v-if="isStaff && !event.published"
              class="absolute top-2 left-2 z-10 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full"
            >
              Draft
            </div>

            <!-- Event Status Badge -->
            <div 
              :class="[
                'absolute top-2 right-2 z-10 text-white text-xs font-medium px-2 py-1 rounded-full',
                getEventStatus(event) === 'upcoming' ? 'bg-green-500' :
                getEventStatus(event) === 'ongoing' ? 'bg-blue-500' : 'bg-gray-500'
              ]"
            >
              {{ getEventStatus(event).toUpperCase() }}
            </div>

            <!-- Poster Display -->
            <div class="aspect-w-16 aspect-h-9 overflow-hidden relative">
              <img 
                v-if="event.poster_url"
                :src="event.poster_url" 
                :alt="event.title"
                class="w-full h-64 object-cover"
              />
              <img 
                v-else
                src="https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg"
                :alt="event.title"
                class="w-full h-64 object-cover"
              />
            </div>
            
            <div class="p-6">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-neutral-500">
                  {{ formatEventDate(event) }}
                </span>
                <span class="text-xs font-medium bg-primary-100 text-primary-800 py-1 px-2 rounded-full">
                  {{ event.event_type || 'General' }}
                </span>
              </div>

              <h3 class="text-xl font-semibold mb-2">{{ event.title }}</h3>
              
              <!-- Location -->
              <div v-if="event.location" class="flex items-center text-sm text-neutral-600 mb-2">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                {{ event.location }}
              </div>

              <p class="text-neutral-600 mb-4 line-clamp-3">{{ event.content }}</p>
              
              <!-- Action Buttons -->
              <div class="flex flex-col space-y-3 mb-4">
                <!-- Donation/Selling Events -->
                <div v-if="isDonationOrSelling(event.event_type)" class="flex items-center justify-between">
                  <div class="text-sm text-gray-600">
                    <span v-if="event.price" class="font-semibold text-lg text-primary-600">
                      RM{{ event.price }}
                    </span>
                    <span v-else class="font-semibold text-lg text-primary-600">
                      Any Amount
                    </span>
                  </div>
                  <button
                    @click="proceedToPayment(event)"
                    :disabled="getEventStatus(event) === 'past'"
                    :class="[
                      'px-4 py-2 rounded-lg font-medium transition-colors',
                      getEventStatus(event) === 'past' 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    ]"
                  >
                    {{ event.event_type === 'donation' ? 'Donate Now' : 'Buy Now' }}
                  </button>
                </div>

                <!-- Volunteer Events -->
                <div v-else-if="event.event_type === 'volunteer'">
                  <button
                    @click="applyToVolunteer(event)"
                    :disabled="getEventStatus(event) === 'past' || isAlreadyVolunteered(event.id)"
                    :class="[
                      'w-full px-4 py-2 rounded-lg font-medium transition-colors',
                      getEventStatus(event) === 'past' || isAlreadyVolunteered(event.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    ]"
                  >
                    {{ isAlreadyVolunteered(event.id) ? 'Already Applied' : 
                       getEventStatus(event) === 'past' ? 'Event Ended' : 'Apply to Volunteer' }}
                  </button>
                </div>

                <!-- General Events -->
                <div v-else>
                  <NuxtLink 
                    :to="`/events/${event.id}`" 
                    class="block w-full text-center px-4 py-2 bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg font-medium transition-colors"
                  >
                    View Details
                  </NuxtLink>
                </div>
              </div>

              <!-- Bottom Section -->
              <div class="flex justify-between items-center">
                <NuxtLink 
                  :to="`/events/${event.id}`" 
                  class="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  More Info
                </NuxtLink>
                <div v-if="isStaff" class="flex space-x-2">
                  <button 
                    @click="editEvent(event.id)"
                    class="text-neutral-600 hover:text-primary-600 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteEvent(event.id)"
                    class="text-neutral-600 hover:text-error-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Events Message -->
        <div v-if="displayedEvents.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-600 mb-2">No Events Found</h3>
          <p class="text-gray-500">
            {{ activeFilter === 'upcoming' ? 'No upcoming events at the moment.' : 
               activeFilter === 'past' ? 'No past events to display.' : 'No events available.' }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const events = ref([]);
const loading = ref(true);
const error = ref(null);
const isStaff = ref(false);
const activeFilter = ref('all');
const userVolunteeredEvents = ref([]);

// Check if event type is donation or selling
const isDonationOrSelling = (eventType) => {
  return ['donation', 'selling', 'fundraiser', 'sale'].includes(eventType?.toLowerCase());
};

// Check if user already volunteered for this event
const isAlreadyVolunteered = (eventId) => {
  return userVolunteeredEvents.value.includes(eventId);
};

// Proceed to payment page
const proceedToPayment = (event) => {
  // Create query parameters for the payment page
  const params = new URLSearchParams({
    eventId: event.id,
    eventTitle: event.title,
    amount: event.price || '',
    type: event.event_type,
    currency: 'myr'
  });
  
  navigateTo(`/events/payment?${params.toString()}`);
};

// Apply to volunteer
const applyToVolunteer = async (event) => {
  if (!user.value) {
    // Redirect to login if not authenticated
    navigateTo('/login?redirect=' + encodeURIComponent(`/events/${event.id}`));
    return;
  }

  try {
    // Check if already applied
    const { data: existingApplication } = await supabase
      .from('volunteer')
      .select('id')
      .eq('volunteer_id', user.value.id)
      .eq('event_id', event.id)
      .single();

    if (existingApplication) {
      alert('You have already applied to volunteer for this event.');
      return;
    }

    // Create volunteer application
    const { error: volunteerError } = await supabase
      .from('volunteer')
      .insert({
        volunteer_id: user.value.id,
        event_id: event.id
      });

    if (volunteerError) throw volunteerError;

    // Update local state
    userVolunteeredEvents.value.push(event.id);
    
    alert('Successfully applied to volunteer! We will contact you with more details.');
  } catch (err) {
    console.error('Error applying to volunteer:', err);
    alert('Failed to submit volunteer application. Please try again.');
  }
};

// Fetch user's volunteer applications
const fetchUserVolunteerApplications = async () => {
  if (!user.value) return;
  
  try {
    const { data, error } = await supabase
      .from('volunteer')
      .select('event_id')
      .eq('volunteer_id', user.value.id);

    if (error) throw error;
    
    userVolunteeredEvents.value = data.map(v => v.event_id);
  } catch (err) {
    console.error('Error fetching volunteer applications:', err);
  }
};
const getEventStatus = (event) => {
  const now = new Date();
  const startDate = new Date(event.event_startdate);
  const endDate = new Date(event.event_enddate);
  
  if (now < startDate) return 'upcoming';
  if (now > endDate) return 'past';
  return 'ongoing';
};

// Format event date
const formatEventDate = (event) => {
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

// Computed property to handle guest vs authenticated user view and staff filter
const displayedEvents = computed(() => {
  let filteredEvents = events.value;
  
  // If user is not staff, only show published events
  if (!isStaff.value) {
    filteredEvents = events.value.filter(event => event.published === true);
  }
  
  // Apply date filter
  if (activeFilter.value === 'upcoming') {
    filteredEvents = filteredEvents.filter(event => getEventStatus(event) === 'upcoming');
  } else if (activeFilter.value === 'past') {
    filteredEvents = filteredEvents.filter(event => getEventStatus(event) === 'past');
  }
  
  // If user is not authenticated and there are more than 3 events, limit to 3
  if (!user.value && filteredEvents.length > 3) {
    return filteredEvents.slice(0, 3);
  }
  
  return filteredEvents;
});

// Check if user is staff
const checkUserRole = async () => {
  if (!user.value) return;
  
  try {
    const { data, error: roleError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single();

    if (roleError) throw roleError;
    isStaff.value = data.role === 'staff' || data.role === 'admin';
  } catch (err) {
    console.error('Error checking user role:', err);
  }
};

// Fetch events
const fetchEvents = async () => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('event_startdate', { ascending: true });

    // If user is not staff, only fetch published events
    if (!isStaff.value) {
      query = query.eq('published', true);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) throw fetchError;
    events.value = data;
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching events:', err);
  } finally {
    loading.value = false;
  }
};

// Edit event
const editEvent = (id) => {
  navigateTo(`/events/edit/${id}`);
};

// Delete event
const deleteEvent = async (id) => {
  if (!confirm('Are you sure you want to delete this event?')) return;

  try {
    // First, get the event to check for poster
    const { data: event } = await supabase
      .from('events')
      .select('poster_url')
      .eq('id', id)
      .single();

    // Delete poster file from storage if it exists
    if (event?.poster_url) {
      const posterPath = event.poster_url.split('/').pop();
      await supabase.storage
        .from('media')
        .remove([`events/${posterPath}`]);
    }

    // Delete the event record
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
    
    events.value = events.value.filter(event => event.id !== id);
  } catch (err) {
    console.error('Error deleting event:', err);
    alert('Failed to delete event. Please try again.');
  }
};

onMounted(async () => {
  await checkUserRole();
  await fetchUserVolunteerApplications();
  await fetchEvents();
});
</script>