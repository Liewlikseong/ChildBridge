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
          <button 
            @click="activeFilter = 'selling'"
            :class="['px-4 py-2 rounded-lg font-medium transition-colors', 
                     activeFilter === 'selling' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
          >
            Shop
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

            <!-- Media Display with Multiple Files Support -->
            <div class="aspect-w-16 aspect-h-9 overflow-hidden relative">
              <!-- Multiple Media Display -->
              <div v-if="event.media_files && event.media_files.length > 0" class="relative">
                <div v-if="getCurrentMedia(event).type === 'image'">
                  <img 
                    :src="getCurrentMedia(event).url" 
                    :alt="event.title"
                    class="w-full h-64 object-cover"
                  />
                </div>
                <div v-else-if="getCurrentMedia(event).type === 'video'" class="relative">
                  <video 
                    :src="getCurrentMedia(event).url"
                    class="w-full h-64 object-cover"
                    muted
                    :poster="getVideoThumbnail(getCurrentMedia(event).url)"
                  ></video>
                  <!-- Video Play Overlay -->
                  <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div class="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- Media Count Indicator -->
                <div v-if="event.media_files.length > 1" class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                  </svg>
                  {{ event.media_files.length }}
                </div>
              </div>
              
              <!-- Fallback for poster_url -->
              <div v-else-if="event.poster_url">
                <img 
                  :src="event.poster_url" 
                  :alt="event.title"
                  class="w-full h-64 object-cover"
                />
              </div>
              
              <!-- Default image -->
              <div v-else>
                <img 
                  src="https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg"
                  :alt="event.title"
                  class="w-full h-64 object-cover"
                />
              </div>
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
              
              <!-- Products Preview for Selling Events -->
              <div v-if="event.event_type === 'selling' && event.products && event.products.length > 0" class="mb-4">
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">Available Products</span>
                    <span class="text-xs text-gray-500">{{ event.products.length }} items</span>
                  </div>
                  <div class="grid grid-cols-3 gap-2">
                    <div 
                      v-for="(product, index) in event.products.slice(0, 3)" 
                      :key="product.id"
                      class="text-center"
                    >
                      <img 
                        v-if="product.image_url"
                        :src="product.image_url" 
                        :alt="product.name"
                        class="w-full h-12 object-cover rounded mb-1"
                      />
                      <div v-else class="w-full h-12 bg-gray-200 rounded mb-1 flex items-center justify-center">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-600 truncate">{{ product.name }}</p>
                      <p class="text-xs font-semibold text-primary-600">RM{{ product.price.toFixed(2) }}</p>
                    </div>
                  </div>
                  <div v-if="event.products.length > 3" class="text-center mt-2">
                    <span class="text-xs text-gray-500">+{{ event.products.length - 3 }} more items</span>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex flex-col space-y-3 mb-4">
                <!-- Selling Events -->
                <div v-if="event.event_type === 'selling'">
                  <button
                    @click="goToShop(event)"
                    :disabled="getEventStatus(event) === 'past'"
                    :class="[
                      'w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center',
                      getEventStatus(event) === 'past' 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    ]"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    {{ getEventStatus(event) === 'past' ? 'Event Ended' : 'Shop Now' }}
                  </button>
                </div>

                <!-- Donation/Fundraising Events -->
                <div v-else-if="isDonationOrSelling(event.event_type)">
                  <div class="flex items-center justify-between">
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
                      {{ event.event_type === 'donation' ? 'Donate Now' : 'Support Now' }}
                    </button>
                  </div>
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
               activeFilter === 'past' ? 'No past events to display.' : 
               activeFilter === 'selling' ? 'No selling events available.' :
               'No events available.' }}
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

// Get current media for display (first item)
const getCurrentMedia = (event) => {
  if (event.media_files && event.media_files.length > 0) {
    return event.media_files[0];
  }
  return { type: 'image', url: event.poster_url };
};

// Get video thumbnail (placeholder)
const getVideoThumbnail = (videoUrl) => {
  // In a real app, you might generate thumbnails or use a service
  return null;
};

// Navigate to shop/payment
const goToShop = (event) => {
  const params = new URLSearchParams({
    eventId: event.id,
    eventTitle: event.title,
    type: event.event_type
  });
  
  navigateTo(`/events/payment?${params.toString()}`);
};

// Proceed to payment page for donations
const proceedToPayment = (event) => {
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
  
  // Apply filter
  if (activeFilter.value === 'upcoming') {
    filteredEvents = filteredEvents.filter(event => getEventStatus(event) === 'upcoming');
  } else if (activeFilter.value === 'past') {
    filteredEvents = filteredEvents.filter(event => getEventStatus(event) === 'past');
  } else if (activeFilter.value === 'selling') {
    filteredEvents = filteredEvents.filter(event => event.event_type === 'selling');
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

// Fetch events with products
const fetchEvents = async () => {
  try {
    let query = supabase
      .from('events')
      .select(`
        *,
        products (
          id,
          name,
          description,
          price,
          image_url,
          stock_quantity,
          available
        )
      `)
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
    // Get the event to check for media files
    const event = events.value.find(e => e.id === id);
    const filesToDelete = [];
    
    // Handle poster_url
    if (event?.poster_url) {
      const posterPath = event.poster_url.split('/').pop();
      filesToDelete.push(`events/${posterPath}`);
    }
    
    // Handle multiple media files
    if (event?.media_files && Array.isArray(event.media_files)) {
      event.media_files.forEach(mediaFile => {
        if (mediaFile.url) {
          const mediaPath = mediaFile.url.split('/').pop();
          filesToDelete.push(`events/${mediaPath}`);
        }
      });
    }

    // Delete products first (due to foreign key constraint)
    const { error: productsDeleteError } = await supabase
      .from('products')
      .delete()
      .eq('event_id', id);

    if (productsDeleteError) throw productsDeleteError;
    
    // Delete files from storage if any exist
    if (filesToDelete.length > 0) {
      await supabase.storage
        .from('media')
        .remove(filesToDelete);
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
