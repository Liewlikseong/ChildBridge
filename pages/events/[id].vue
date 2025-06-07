<template>
  <div>
    <div v-if="loading" class="py-16 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
    </div>

    <div v-else-if="event" class="bg-white min-h-screen">
      <!--style container -->
      <div class="max-w-xl mx-auto bg-white border-x border-neutral-200 min-h-screen">
        
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-neutral-200 px-4 py-3 z-10">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">
                  {{ author?.first_name?.charAt(0) || 'A' }}{{ author?.last_name?.charAt(0) || 'A' }}
                </span>
              </div>
              <div>
                <p class="font-semibold text-sm">{{ author?.first_name }} {{ author?.last_name }}</p>
                <p class="text-xs text-neutral-500">{{ new Date(event.created_at).toLocaleDateString() }}</p>
              </div>
            </div>
            <div v-if="isStaff" class="flex items-center space-x-2">
              <button @click="editEvent" class="p-2 hover:bg-neutral-100 rounded-full">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button @click="deleteEvent" class="p-2 hover:bg-red-50 text-red-600 rounded-full">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Media Section-->
        <div class="relative">
          <!-- Multiple Media Display -->
          <div v-if="event.media_files && event.media_files.length > 0" class="relative">
            <!-- Main Media Display - Slightly bigger -->
            <div class="relative bg-black">
              <img 
                v-if="currentMedia.type === 'image'"
                :src="currentMedia.url" 
                :alt="event.title"
                class="w-full max-h-[500px] object-contain"
              />
              <video
                v-else-if="currentMedia.type === 'video'"
                :src="currentMedia.url"
                controls
                class="w-full max-h-[500px] object-contain"
              ></video>
            </div>
            
            <!-- Dots indicator for multiple media -->
            <div v-if="event.media_files.length > 1" class="absolute bottom-3 left-1/2 transform -translate-x-1/2">
              <div class="flex space-x-1">
                <div
                  v-for="(media, index) in event.media_files"
                  :key="index"
                  class="w-2 h-2 rounded-full transition-all"
                  :class="currentMediaIndex === index ? 'bg-white' : 'bg-white/50'"
                ></div>
              </div>
            </div>
            
            <!-- Arrow Navigation-->
            <div v-if="event.media_files.length > 1" class="absolute inset-y-0 left-0 flex items-center">
              <button
                @click="previousMedia"
                class="ml-2 w-8 h-8 bg-black/30 text-white rounded-full hover:bg-black/50 transition-all flex items-center justify-center"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
            </div>
            <div v-if="event.media_files.length > 1" class="absolute inset-y-0 right-0 flex items-center">
              <button
                @click="nextMedia"
                class="mr-2 w-8 h-8 bg-black/30 text-white rounded-full hover:bg-black/50 transition-all flex items-center justify-center"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Fallback for old single media format or poster_url -->
          <div v-else-if="event.poster_url" class="relative bg-black">
            <img 
              :src="event.poster_url" 
              :alt="event.title"
              class="w-full max-h-[500px] object-contain"
            />
          </div>
          
          <!-- Default image -->
          <div v-else class="relative bg-black">
            <img 
              src="https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg" 
              :alt="event.title"
              class="w-full max-h-[500px] object-contain"
            />
          </div>
        </div>

        <!-- Content Section -->
        <div class="px-4 py-3">
          <!-- Event Status Badge -->
          <div class="mb-3">
            <span 
              :class="[
                'inline-block text-white text-xs font-medium px-2 py-1 rounded-full',
                getEventStatus(event) === 'upcoming' ? 'bg-green-500' :
                getEventStatus(event) === 'ongoing' ? 'bg-blue-500' : 'bg-gray-500'
              ]"
            >
              {{ getEventStatus(event).toUpperCase() }}
            </span>
            <span v-if="event.event_type" class="ml-2 text-xs font-medium bg-primary-100 text-primary-800 py-1 px-2 rounded-full">
              {{ event.event_type || 'General' }}
            </span>
          </div>

          <!-- Title and Content -->
          <div class="space-y-2">
            <h1 class="font-semibold text-lg leading-tight">{{ event.title }}</h1>
            
            <!-- Event Dates -->
            <div class="text-sm text-neutral-600 mb-2">
              <svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
              </svg>
              {{ formatEventDate(event) }}
            </div>

            <!-- Location -->
            <div v-if="event.location" class="flex items-center text-sm text-neutral-600 mb-2">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              {{ event.location }}
            </div>

            <!-- Price for donation/selling events -->
            <div v-if="isDonationOrSelling(event.event_type) && event.price" class="text-sm text-neutral-600 mb-2">
              <svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
              </svg>
              {{ event.price ? `RM${event.price}` : 'Any Amount' }}
            </div>

            <div class="text-sm leading-relaxed whitespace-pre-wrap text-neutral-800">{{ event.content }}</div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 space-y-3">
            <!-- Donation/Selling Events -->
            <div v-if="isDonationOrSelling(event.event_type)">
              <button
                @click="proceedToPayment(event)"
                :disabled="getEventStatus(event) === 'past'"
                :class="[
                  'w-full px-4 py-3 rounded-lg font-medium transition-colors',
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
                  'w-full px-4 py-3 rounded-lg font-medium transition-colors',
                  getEventStatus(event) === 'past' || isAlreadyVolunteered(event.id)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                ]"
              >
                {{ isAlreadyVolunteered(event.id) ? 'Already Applied' : 
                   getEventStatus(event) === 'past' ? 'Event Ended' : 'Apply to Volunteer' }}
              </button>
            </div>
          </div>

          <!-- Timestamp -->
          <div class="mt-4 text-xs text-neutral-500 uppercase tracking-wide">
            {{ formatDate(event.created_at) }}
          </div>
        </div>

        <!-- Media Carousel-->
        <div v-if="event.media_files && event.media_files.length > 1" class="px-4 pb-4">
          <div class="flex space-x-2 overflow-x-auto scrollbar-hide">
            <div
              v-for="(media, index) in event.media_files"
              :key="index"
              @click="currentMediaIndex = index"
              class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:opacity-75"
              :class="currentMediaIndex === index ? 'border-primary-500' : 'border-transparent'"
            >
              <img 
                v-if="media.type === 'image'"
                :src="media.url" 
                :alt="`Media ${index + 1}`"
                class="w-full h-full object-cover"
              />
              <div 
                v-else-if="media.type === 'video'"
                class="w-full h-full bg-gray-100 flex items-center justify-center relative"
              >
                <video :src="media.url" class="w-full h-full object-cover"></video>
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-16 text-center">
      <p class="text-neutral-600">Event not found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSupabaseClient, useSupabaseUser, useRoute, navigateTo } from '#imports';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();

const event = ref(null);
const author = ref(null);
const loading = ref(true);
const isStaff = ref(false);
const currentMediaIndex = ref(0);
const userVolunteeredEvents = ref([]);

// Computed property for current media
const currentMedia = computed(() => {
  if (event.value?.media_files && event.value.media_files.length > 0) {
    return event.value.media_files[currentMediaIndex.value] || event.value.media_files[0];
  }
  return null;
});

// Check if event type is donation or selling
const isDonationOrSelling = (eventType) => {
  return ['donation', 'selling', 'fundraiser', 'sale'].includes(eventType?.toLowerCase());
};

// Check if user already volunteered for this event
const isAlreadyVolunteered = (eventId) => {
  return userVolunteeredEvents.value.includes(eventId);
};

// Get event status
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

// Format date
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

// Proceed to payment page
const proceedToPayment = (event) => {
  const params = new URLSearchParams({
    eventId: event.id,
    eventTitle: event.title,
    amount: event.price || '',
    type: event.event_type,
    currency: 'myr'
  });
  
  navigateTo(`/payment?${params.toString()}`);
};

// Apply to volunteer
const applyToVolunteer = async (event) => {
  if (!user.value) {
    navigateTo('/login?redirect=' + encodeURIComponent(`/events/${event.id}`));
    return;
  }

  try {
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

    const { error: volunteerError } = await supabase
      .from('volunteer')
      .insert({
        volunteer_id: user.value.id,
        event_id: event.id
      });

    if (volunteerError) throw volunteerError;

    userVolunteeredEvents.value.push(event.id);
    alert('Successfully applied to volunteer! We will contact you with more details.');
  } catch (err) {
    console.error('Error applying to volunteer:', err);
    alert('Failed to submit volunteer application. Please try again.');
  }
};

// Check if user is staff
const checkUserRole = async () => {
  if (!user.value) return;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single();

    if (error) throw error;
    isStaff.value = data.role === 'staff' || data.role === 'admin';
  } catch (err) {
    console.error('Error checking user role:', err);
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

// Fetch event and author details
const fetchEvent = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', route.params.id)
      .single();

    if (error) throw error;
    event.value = data;

    // Fetch author details - check both old and new field names
    const authorId = data.staff_id || data.author_id || data.created_by;
    if (authorId) {
      const { data: authorData, error: authorError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', authorId)
        .single();

      if (!authorError) {
        author.value = authorData;
      }
    }
  } catch (err) {
    console.error('Error fetching event:', err);
  } finally {
    loading.value = false;
  }
};

// Media navigation functions
const nextMedia = () => {
  if (event.value?.media_files && event.value.media_files.length > 1) {
    currentMediaIndex.value = (currentMediaIndex.value + 1) % event.value.media_files.length;
  }
};

const previousMedia = () => {
  if (event.value?.media_files && event.value.media_files.length > 1) {
    currentMediaIndex.value = currentMediaIndex.value === 0 
      ? event.value.media_files.length - 1 
      : currentMediaIndex.value - 1;
  }
};

const editEvent = () => {
  navigateTo(`/events/edit/${route.params.id}`);
};

const deleteEvent = async () => {
  if (!confirm('Are you sure you want to delete this event?')) return;

  try {
    // Delete media files from storage
    const filesToDelete = [];
    
    // Handle poster_url
    if (event.value?.poster_url) {
      const posterPath = event.value.poster_url.split('/').pop();
      filesToDelete.push(`events/${posterPath}`);
    }
    
    // Handle multiple media format
    if (event.value?.media_files && Array.isArray(event.value.media_files)) {
      event.value.media_files.forEach(mediaFile => {
        if (mediaFile.url) {
          const mediaPath = mediaFile.url.split('/').pop();
          filesToDelete.push(`events/${mediaPath}`);
        }
      });
    }
    
    // Delete files from storage if any exist
    if (filesToDelete.length > 0) {
      await supabase.storage
        .from('media')
        .remove(filesToDelete);
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', route.params.id);

    if (error) throw error;
    navigateTo('/events');
  } catch (err) {
    console.error('Error deleting event:', err);
    alert('Failed to delete event. Please try again.');
  }
};

// Keyboard navigation for media
const handleKeydown = (event) => {
  if (event.value?.media_files && event.value.media_files.length > 1) {
    if (event.key === 'ArrowLeft') {
      previousMedia();
    } else if (event.key === 'ArrowRight') {
      nextMedia();
    }
  }
};

onMounted(async () => {
  await checkUserRole();
  await fetchUserVolunteerApplications();
  await fetchEvent();
  
  // Add keyboard event listener
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  // Remove keyboard event listener
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>