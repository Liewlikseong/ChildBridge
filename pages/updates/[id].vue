<template>
  <div>
    <div v-if="loading" class="py-16 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
    </div>

    <div v-else-if="update" class="bg-white">
      <!-- Hero Image/Media -->
      <div class="w-full h-96 relative">
        <!-- Multiple Media Display -->
        <div v-if="update.media_files && update.media_files.length > 0" class="relative w-full h-full">
          <!-- Main Media Display -->
          <img 
            v-if="currentMedia.type === 'image'"
            :src="currentMedia.url" 
            :alt="update.title"
            class="w-full h-full object-cover"
          />
          <video
            v-else-if="currentMedia.type === 'video'"
            :src="currentMedia.url"
            controls
            class="w-full h-full object-cover"
          ></video>
          
          <!-- Navigation for multiple media -->
          <div v-if="update.media_files.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div class="flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2">
              <button
                v-for="(media, index) in update.media_files"
                :key="index"
                @click="currentMediaIndex = index"
                class="w-12 h-12 rounded-md overflow-hidden border-2 transition-all"
                :class="currentMediaIndex === index ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'"
              >
                <img 
                  v-if="media.type === 'image'"
                  :src="media.url" 
                  :alt="`Media ${index + 1}`"
                  class="w-full h-full object-cover"
                />
                <div 
                  v-else-if="media.type === 'video'"
                  class="w-full h-full bg-gray-600 flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
          
          <!-- Arrow Navigation -->
          <div v-if="update.media_files.length > 1" class="absolute inset-y-0 left-0 flex items-center">
            <button
              @click="previousMedia"
              class="ml-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>
          <div v-if="update.media_files.length > 1" class="absolute inset-y-0 right-0 flex items-center">
            <button
              @click="nextMedia"
              class="mr-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Fallback for old single media format -->
        <div v-else-if="update.media_url" class="w-full h-full">
          <img 
            v-if="update.media_type === 'image'"
            :src="update.media_url" 
            :alt="update.title"
            class="w-full h-full object-cover"
          />
          <video
            v-else-if="update.media_type === 'video'"
            :src="update.media_url"
            controls
            class="w-full h-full object-cover"
          ></video>
        </div>
        
        <!-- Default image -->
        <img 
          v-else
          src="https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg" 
          :alt="update.title"
          class="w-full h-full object-cover"
        />
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <!-- Content -->
      <div class="container-custom py-16">
        <div class="max-w-3xl mx-auto">
          <div class="mb-6">
            <span class="text-sm font-medium bg-primary-100 text-primary-800 py-1 px-2 rounded-full">
              {{ update.category || 'General' }}
            </span>
          </div>
          
          <h1 class="text-4xl font-bold mb-4">{{ update.title }}</h1>
          
          <div class="flex items-center text-neutral-600 mb-8">
            <span>{{ new Date(update.created_at).toLocaleDateString() }}</span>
            <span class="mx-2">•</span>
            <span>By {{ author?.first_name }} {{ author?.last_name }}</span>
          </div>

          <!-- Content -->
          <div class="prose max-w-none mb-8">
            <div class="whitespace-pre-wrap">{{ update.content }}</div>
          </div>

          <!-- Media Gallery (if multiple media files) -->
          <div v-if="update.media_files && update.media_files.length > 1" class="mb-8">
            <h3 class="text-lg font-semibold mb-4">Media Gallery</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="(media, index) in update.media_files"
                :key="index"
                @click="currentMediaIndex = index; scrollToTop()"
                class="cursor-pointer rounded-lg overflow-hidden hover:opacity-75 transition-opacity border-2"
                :class="currentMediaIndex === index ? 'border-primary-500' : 'border-transparent'"
              >
                <img 
                  v-if="media.type === 'image'"
                  :src="media.url" 
                  :alt="`Media ${index + 1}`"
                  class="w-full h-24 object-cover"
                />
                <div 
                  v-else-if="media.type === 'video'"
                  class="w-full h-24 bg-gray-100 flex items-center justify-center relative"
                >
                  <video :src="media.url" class="w-full h-full object-cover"></video>
                  <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Staff Actions -->
          <div v-if="isStaff" class="mt-12 flex justify-end space-x-4">
            <button
              @click="editUpdate"
              class="btn btn-outline"
            >
              Edit Update
            </button>
            <button
              @click="deleteUpdate"
              class="btn btn-error"
            >
              Delete Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-16 text-center">
      <p class="text-neutral-600">Update not found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSupabaseClient, useSupabaseUser, useRoute, navigateTo } from '#imports';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();

const update = ref(null);
const author = ref(null);
const loading = ref(true);
const isStaff = ref(false);
const currentMediaIndex = ref(0);

// Computed property for current media
const currentMedia = computed(() => {
  if (update.value?.media_files && update.value.media_files.length > 0) {
    return update.value.media_files[currentMediaIndex.value] || update.value.media_files[0];
  }
  return null;
});

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

// Fetch update and author details
const fetchUpdate = async () => {
  try {
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('id', route.params.id)
      .single();

    if (error) throw error;
    update.value = data;

    // Fetch author details - check both old and new field names
    const authorId = data.staff_id || data.author_id;
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
    console.error('Error fetching update:', err);
  } finally {
    loading.value = false;
  }
};

// Media navigation functions
const nextMedia = () => {
  if (update.value?.media_files && update.value.media_files.length > 1) {
    currentMediaIndex.value = (currentMediaIndex.value + 1) % update.value.media_files.length;
  }
};

const previousMedia = () => {
  if (update.value?.media_files && update.value.media_files.length > 1) {
    currentMediaIndex.value = currentMediaIndex.value === 0 
      ? update.value.media_files.length - 1 
      : currentMediaIndex.value - 1;
  }
};

// Scroll to top when changing media
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const editUpdate = () => {
  navigateTo(`/updates/edit/${route.params.id}`);
};

const deleteUpdate = async () => {
  if (!confirm('Are you sure you want to delete this update?')) return;

  try {
    // Delete media files from storage
    const filesToDelete = [];
    
    // Handle old single media format
    if (update.value?.media_url) {
      const mediaPath = update.value.media_url.split('/').pop();
      filesToDelete.push(`updates/${mediaPath}`);
    }
    
    // Handle new multiple media format
    if (update.value?.media_files && Array.isArray(update.value.media_files)) {
      update.value.media_files.forEach(mediaFile => {
        if (mediaFile.url) {
          const mediaPath = mediaFile.url.split('/').pop();
          filesToDelete.push(`updates/${mediaPath}`);
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
      .from('updates')
      .delete()
      .eq('id', route.params.id);

    if (error) throw error;
    navigateTo('/updates');
  } catch (err) {
    console.error('Error deleting update:', err);
    alert('Failed to delete update. Please try again.');
  }
};

// Keyboard navigation for media
const handleKeydown = (event) => {
  if (update.value?.media_files && update.value.media_files.length > 1) {
    if (event.key === 'ArrowLeft') {
      previousMedia();
    } else if (event.key === 'ArrowRight') {
      nextMedia();
    }
  }
};

onMounted(async () => {
  await checkUserRole();
  await fetchUpdate();
  
  // Add keyboard event listener
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  // Remove keyboard event listener
  window.removeEventListener('keydown', handleKeydown);
});
</script>