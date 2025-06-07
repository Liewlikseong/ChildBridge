<template>
  <div class="py-16 bg-neutral-50">
    <div class="container-custom">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h1 class="text-3xl font-bold mb-8">Edit Event</h1>
          
          <form v-if="eventData" @submit.prevent="saveEvent" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="title" class="block text-sm font-medium text-neutral-700 mb-1">Event Title *</label>
                <input
                  id="title"
                  v-model="eventData.title"
                  type="text"
                  required
                  class="input"   
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label for="event_type" class="block text-sm font-medium text-neutral-700 mb-1">Event Type *</label>
                <select
                  id="event_type"
                  v-model="eventData.event_type"
                  required
                  class="input"
                >
                  <option value="">Select event type</option>
                  <option value="general">General</option>
                  <option value="donation">Donation</option>
                  <option value="fundraiser">Fundraiser</option>
                  <option value="selling">Selling</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>
            </div>

            <!-- Date and Location -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="event_startdate" class="block text-sm font-medium text-neutral-700 mb-1">Start Date *</label>
                <input
                  id="event_startdate"
                  v-model="eventData.event_startdate"
                  type="date"
                  required
                  class="input"
                  :min="today"
                />
              </div>

              <div>
                <label for="event_enddate" class="block text-sm font-medium text-neutral-700 mb-1">End Date *</label>
                <input
                  id="event_enddate"
                  v-model="eventData.event_enddate"
                  type="date"
                  required
                  class="input"
                  :min="eventData.event_startdate || today"
                />
              </div>

              <div>
                <label for="price" class="block text-sm font-medium text-neutral-700 mb-1">
                  Price {{ isDonationOrSelling ? '(Optional for donations)' : '' }}
                </label>
                <input
                  id="price"
                  v-model="eventData.price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="input"
                  placeholder="0.00"
                  :disabled="!isDonationOrSelling"
                />
              </div>
            </div>

            <div>
              <label for="location" class="block text-sm font-medium text-neutral-700 mb-1">Location</label>
              <input
                id="location"
                v-model="eventData.location"
                type="text"
                class="input"   
                placeholder="Enter event location"
              />
            </div>

            <div>
              <label for="content" class="block text-sm font-medium text-neutral-700 mb-1">Event Description *</label>
              <textarea
                id="content"
                v-model="eventData.content"
                rows="6"
                required
                class="input"
                placeholder="Describe your event in detail..."
              ></textarea>
            </div>

            <!-- Event Poster Upload -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Event Poster</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                <div class="space-y-1 text-center w-full">
                  <!-- Current Poster Preview -->
                  <div v-if="currentPosterUrl && !posterPreview" class="mb-4">
                    <h4 class="text-sm font-medium text-neutral-700 mb-2">Current Poster</h4>
                    <div class="relative inline-block">
                      <img 
                        :src="currentPosterUrl" 
                        alt="Current Poster" 
                        class="max-w-xs max-h-64 object-cover rounded-lg mx-auto" 
                      />
                      
                      <!-- Remove current poster button -->
                      <button
                        type="button"
                        @click="removeCurrentPoster"
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <!-- New Poster Preview -->
                  <div v-if="posterPreview" class="mb-4">
                    <h4 class="text-sm font-medium text-neutral-700 mb-2">New Poster</h4>
                    <div class="relative inline-block">
                      <img 
                        :src="posterPreview.url" 
                        alt="New Poster Preview" 
                        class="max-w-xs max-h-64 object-cover rounded-lg mx-auto" 
                      />
                      
                      <!-- Remove button -->
                      <button
                        type="button"
                        @click="removePoster"
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                      
                      <!-- Upload progress -->
                      <div 
                        v-if="posterPreview.uploading" 
                        class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
                      >
                        <div class="text-white text-sm">{{ posterPreview.progress }}%</div>
                      </div>
                    </div>
                  </div>

                  <!-- Upload Area -->
                  <div class="flex text-sm text-neutral-600">
                    <label for="poster-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>{{ currentPosterUrl && !posterPreview ? 'Replace poster' : 'Upload poster' }}</span>
                      <input 
                        id="poster-upload" 
                        type="file" 
                        class="sr-only" 
                        @change="handlePosterUpload"
                        accept="image/*"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-neutral-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <!-- Event Type Specific Fields -->
            <div v-if="eventData.event_type === 'volunteer'" class="bg-blue-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-blue-900 mb-2">Volunteer Event Information</h3>
              <p class="text-sm text-blue-700">
                This event will allow users to apply as volunteers. Make sure to include requirements and expectations in the description.
              </p>
            </div>

            <div v-else-if="isDonationOrSelling" class="bg-green-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-green-900 mb-2">
                {{ eventData.event_type === 'donation' || eventData.event_type === 'fundraiser' ? 'Donation' : 'Sales' }} Event Information
              </h3>
              <p class="text-sm text-green-700">
                {{ eventData.event_type === 'donation' || eventData.event_type === 'fundraiser' 
                   ? 'This event will allow users to make donations. Price is optional for donation events.' 
                   : 'This event will allow users to purchase items. Please set an appropriate price.' }}
              </p>
            </div>

            <!-- Publishing Options -->
            <div class="flex items-center">
              <input
                id="published"
                v-model="eventData.published"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label for="published" class="ml-2 block text-sm text-neutral-700">
                Published
              </label>
            </div>

            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>

            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="goBack"
                class="btn btn-outline"
                :disabled="loading"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="loading || !isFormValid || isUploading"
              >
                <span v-if="loading" class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </span>
                <span v-else-if="isUploading">Uploading...</span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useSupabaseClient, useSupabaseUser, useRoute, navigateTo } from '#imports';
import { v4 as uuidv4 } from 'uuid';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();
const loading = ref(false);
const eventData = ref(null);
const posterPreview = ref(null);
const currentPosterUrl = ref('');
const error = ref('');

// Get today's date for date input minimum
const today = new Date().toISOString().split('T')[0];

// Computed properties
const isFormValid = computed(() => {
  return eventData.value && 
         eventData.value.title && 
         eventData.value.title.trim() && 
         eventData.value.content && 
         eventData.value.content.trim() &&
         eventData.value.event_type &&
         eventData.value.event_startdate &&
         eventData.value.event_enddate &&
         new Date(eventData.value.event_startdate) <= new Date(eventData.value.event_enddate);
});

const isUploading = computed(() => {
  return posterPreview.value && posterPreview.value.uploading;
});

const isDonationOrSelling = computed(() => {
  return eventData.value && ['donation', 'fundraiser', 'selling'].includes(eventData.value.event_type);
});

// Watch for event type changes to reset price
watch(() => eventData.value?.event_type, (newType) => {
  if (eventData.value && !['donation', 'fundraiser', 'selling'].includes(newType)) {
    eventData.value.price = null;
  }
});

// Check if user is staff
const checkUserRole = async () => {
  if (!user.value) {
    await navigateTo('/auth/login');
    return;
  }

  try {
    const { data, error: roleError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single();

    if (roleError) throw roleError;

    if (data.role !== 'staff' && data.role !== 'admin') {
      await navigateTo('/events');
    }
  } catch (err) {
    console.error('Error checking user role:', err);
    await navigateTo('/events');
  }
};

// Fetch event data
const fetchEvent = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('id', route.params.id)
      .single();

    if (fetchError) throw fetchError;
    
    eventData.value = data;
    
    // Store current poster URL
    if (data.poster_url) {
      currentPosterUrl.value = data.poster_url;
    }
  } catch (err) {
    console.error('Error fetching event:', err);
    await navigateTo('/events');
  }
};

const handlePosterUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file.';
    return;
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    error.value = 'Image file is too large. Maximum size is 10MB.';
    return;
  }

  error.value = '';

  // Create preview object
  posterPreview.value = {
    url: URL.createObjectURL(file),
    file: file,
    uploading: true,
    progress: 0,
    uploaded_url: null
  };

  // Upload file
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `events/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        onUploadProgress: (progress) => {
          if (posterPreview.value) {
            posterPreview.value.progress = Math.round((progress.loaded / progress.total) * 100);
          }
        }
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // Update preview object
    posterPreview.value.uploaded_url = publicUrl;
    posterPreview.value.uploading = false;
    posterPreview.value.progress = 100;

  } catch (uploadError) {
    console.error('Error uploading poster:', uploadError);
    error.value = 'Failed to upload poster. Please try again.';
    removePoster();
  }

  // Clear the file input
  event.target.value = '';
};

const removePoster = () => {
  if (posterPreview.value && posterPreview.value.url) {
    URL.revokeObjectURL(posterPreview.value.url);
  }
  
  posterPreview.value = null;
};

const removeCurrentPoster = () => {
  currentPosterUrl.value = '';
};

const saveEvent = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields and ensure end date is not before start date';
    return;
  }

  if (isUploading.value) {
    error.value = 'Please wait for the poster to finish uploading';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // Determine final poster URL
    let finalPosterUrl = null;
    if (posterPreview.value && posterPreview.value.uploaded_url) {
      // New poster uploaded
      finalPosterUrl = posterPreview.value.uploaded_url;
    } else if (currentPosterUrl.value) {
      // Keep existing poster
      finalPosterUrl = currentPosterUrl.value;
    }

    const updateData = {
      title: eventData.value.title.trim(),
      content: eventData.value.content.trim(),
      event_type: eventData.value.event_type,
      location: eventData.value.location?.trim() || null,
      event_startdate: eventData.value.event_startdate,
      event_enddate: eventData.value.event_enddate,
      price: eventData.value.price || null,
      poster_url: finalPosterUrl,
      published: eventData.value.published
    };

    const { error: updateError } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', route.params.id);

    if (updateError) throw updateError;

    // Success - redirect to events page
    await navigateTo('/events');

  } catch (err) {
    console.error('Error updating event:', err);
    error.value = err.message || 'Failed to update event. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  // Clean up preview URL before navigating
  if (posterPreview.value && posterPreview.value.url) {
    URL.revokeObjectURL(posterPreview.value.url);
  }
  navigateTo('/events');
};

onMounted(async () => {
  await checkUserRole();
  await fetchEvent();
});

// Cleanup preview URL when component is unmounted
onUnmounted(() => {
  if (posterPreview.value && posterPreview.value.url) {
    URL.revokeObjectURL(posterPreview.value.url);
  }
});
</script>