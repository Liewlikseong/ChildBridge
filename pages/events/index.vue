<template>
  <div>
    <!-- Enhanced Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-16 overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <div class="absolute top-40 right-20 w-20 h-20 bg-purple-400 rounded-full opacity-10 animate-bounce"></div>
        <div class="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-400 rounded-full opacity-10 animate-ping"></div>
      </div>

      <div class="container-custom relative">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in">
            Latest Events
          </h1>
          <p class="text-xl text-blue-100 leading-relaxed animate-fade-in">
            Stay informed about upcoming events and activities from Jing Sun Welfare Society.
          </p>
        </div>
      </div>
    </section>

    <!-- Enhanced Events List -->
    <section class="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="container-custom">
        <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">All Events</h2>
            <p class="text-gray-600">Discover meaningful ways to get involved and make a difference</p>
          </div>
          <div v-if="isStaff">
            <NuxtLink 
              to="/events/new" 
              class="group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create New Event
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Enhanced Filter Tabs -->
        <div class="mb-12 flex flex-wrap gap-3">
          <button 
            @click="activeFilter = 'all'"
            :class="[
              'px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105',
              activeFilter === 'all' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200'
            ]"
          >
            All Events
          </button>
          <button 
            @click="activeFilter = 'upcoming'"
            :class="[
              'px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105',
              activeFilter === 'upcoming' 
                ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200'
            ]"
          >
            Upcoming
          </button>
          <button 
            @click="activeFilter = 'past'"
            :class="[
              'px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105',
              activeFilter === 'past' 
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200'
            ]"
          >
            Past Events
          </button>
          <button 
            @click="activeFilter = 'selling'"
            :class="[
              'px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105',
              activeFilter === 'selling' 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200'
            ]"
          >
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            Shop
          </button>
        </div>

        <!-- Enhanced Events Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div 
            v-for="event in displayedEvents" 
            :key="event.id" 
            class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden border border-gray-100"
          >
            <!-- Enhanced Status Badges -->
            <div 
              v-if="isStaff && !event.published"
              class="absolute top-4 left-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg"
            >
              <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              Draft
            </div>

            <!-- Enhanced Event Status Badge -->
            <div 
              :class="[
                'absolute top-4 right-4 z-20 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg',
                getEventStatus(event) === 'upcoming' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                getEventStatus(event) === 'ongoing' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 
                'bg-gradient-to-r from-gray-400 to-gray-600'
              ]"
            >
              <span class="flex items-center">
                <div class="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                {{ getEventStatus(event).toUpperCase() }}
              </span>
            </div>

            <!-- Enhanced Media Display -->
            <div class="aspect-w-16 aspect-h-9 overflow-hidden relative">
              <div v-if="event.media_files && event.media_files.length > 0" class="relative">
                <div v-if="getCurrentMedia(event).type === 'image'">
                  <img 
                    :src="getCurrentMedia(event).url" 
                    :alt="event.title"
                    class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div v-else-if="getCurrentMedia(event).type === 'video'" class="relative">
                  <video 
                    :src="getCurrentMedia(event).url"
                    class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    muted
                    :poster="getVideoThumbnail(getCurrentMedia(event).url)"
                  ></video>
                  <!-- Enhanced Video Play Overlay -->
                  <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 to-transparent">
                    <div class="w-16 h-16 bg-white bg-opacity-95 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-110">
                      <svg class="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- Enhanced Media Count Indicator -->
                <div v-if="event.media_files.length > 1" class="absolute bottom-4 right-4 bg-gradient-to-r from-black/60 to-black/40 text-white text-xs font-bold px-3 py-2 rounded-full backdrop-blur-sm">
                  <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                  </svg>
                  {{ event.media_files.length }} Photos
                </div>
              </div>
              
              <!-- Fallback images with gradient overlay -->
              <div v-else-if="event.poster_url" class="relative">
                <img 
                  :src="event.poster_url" 
                  :alt="event.title"
                  class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div v-else class="relative">
                <img 
                  src="https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg"
                  :alt="event.title"
                  class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            <!-- Enhanced Card Content -->
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {{ formatEventDate(event) }}
                </span>
                <span class="text-xs font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 py-2 px-3 rounded-full border border-blue-200">
                  {{ event.event_type || 'General' }}
                </span>
              </div>

              <h3 class="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {{ event.title }}
              </h3>
              
              <!-- Enhanced Location -->
              <div v-if="event.location" class="flex items-center text-sm text-gray-600 mb-3 bg-gray-50 px-3 py-2 rounded-lg">
                <svg class="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
                {{ event.location }}
              </div>

              <p class="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{{ event.content }}</p>
              
              <!-- Enhanced Products Preview -->
              <div v-if="event.event_type === 'selling' && event.products && event.products.length > 0" class="mb-6">
                <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-bold text-gray-700 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                      Available Products
                    </span>
                    <span class="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {{ event.products.length }} items
                    </span>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <div 
                      v-for="(product, index) in event.products.slice(0, 3)" 
                      :key="product.id"
                      class="text-center group/product"
                    >
                      <div class="relative overflow-hidden rounded-lg mb-2">
                        <img 
                          v-if="product.image_url"
                          :src="product.image_url" 
                          :alt="product.name"
                          class="w-full h-16 object-cover group-hover/product:scale-110 transition-transform duration-300"
                        />
                        <div v-else class="w-full h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center group-hover/product:from-gray-300 group-hover/product:to-gray-400 transition-all duration-300">
                          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                          </svg>
                        </div>
                      </div>
                      <p class="text-xs text-gray-600 truncate font-medium">{{ product.name }}</p>
                      <p class="text-xs font-bold text-blue-600">RM{{ product.price.toFixed(2) }}</p>
                    </div>
                  </div>
                  <div v-if="event.products.length > 3" class="text-center mt-3">
                    <span class="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      +{{ event.products.length - 3 }} more items
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Enhanced Action Buttons -->
              <div class="flex flex-col space-y-3 mb-4">
                <!-- Selling Events -->
                <div v-if="event.event_type === 'selling'">
                  <button
                    @click="goToShop(event)"
                    :disabled="getEventStatus(event) === 'past'"
                    :class="[
                      'w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center transform hover:scale-105',
                      getEventStatus(event) === 'past' 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                    ]"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    {{ getEventStatus(event) === 'past' ? 'Event Ended' : 'Shop Now' }}
                  </button>
                </div>

                <!-- Enhanced Donation/Fundraising Events -->
                <div v-else-if="isDonationOrSelling(event.event_type)">
                  <div class="flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
                    <div class="text-sm text-gray-700">
                      <span class="text-xs font-medium text-gray-500 block">Suggested Amount</span>
                      <span v-if="event.price" class="font-bold text-2xl text-green-600">
                        RM{{ event.price }}
                      </span>
                      <span v-else class="font-bold text-2xl text-green-600">
                        Any Amount
                      </span>
                    </div>
                    <button
                      @click="proceedToPayment(event)"
                      :disabled="getEventStatus(event) === 'past'"
                      :class="[
                        'px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center',
                        getEventStatus(event) === 'past' 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
                      ]"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      {{ event.event_type === 'donation' ? 'Donate Now' : 'Support Now' }}
                    </button>
                  </div>
                </div>

                <!-- Enhanced Volunteer Events -->
                <div v-else-if="event.event_type === 'volunteer'">
                  <button
                    @click="applyToVolunteer(event)"
                    :disabled="getEventStatus(event) === 'past' || isAlreadyVolunteered(event.id)"
                    :class="[
                      'w-full px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center',
                      getEventStatus(event) === 'past' || isAlreadyVolunteered(event.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    ]"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    {{ isAlreadyVolunteered(event.id) ? 'Already Applied' : 
                       getEventStatus(event) === 'past' ? 'Event Ended' : 'Apply to Volunteer' }}
                  </button>
                </div>

                <!-- Enhanced General Events -->
                <div v-else>
                  <NuxtLink 
                    :to="`/events/${event.id}`" 
                    class="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 border border-blue-200"
                  >
                    View Details
                  </NuxtLink>
                </div>
              </div>

              <!-- Enhanced Bottom Section -->
              <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                <NuxtLink 
                  :to="`/events/${event.id}`" 
                  class="group text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center transition-colors duration-300"
                >
                  More Info
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </NuxtLink>
                <div v-if="isStaff" class="flex space-x-3">
                  <button 
                    @click="editEvent(event.id)"
                    class="text-gray-600 hover:text-blue-600 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteEvent(event.id)"
                    class="text-gray-600 hover:text-red-600 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced No Events Message -->
        <div v-if="displayedEvents.length === 0" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-700 mb-3">No Events Found</h3>
            <p class="text-gray-500 mb-6 leading-relaxed">
              {{ activeFilter === 'upcoming' ? 'No upcoming events at the moment. Check back soon!' : 
                 activeFilter === 'past' ? 'No past events to display.' : 
                 activeFilter === 'selling' ? 'No selling events available right now.' :
                 'No events available at this time.' }}
            </p>
            <div v-if="!isStaff" class="text-sm text-gray-400">
              <svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
              New events are added regularly
            </div>
          </div>
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
