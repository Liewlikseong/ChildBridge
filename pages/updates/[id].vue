<template>
  <div>
    <div v-if="loading" class="py-16 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
    </div>

    <div v-else-if="update" class="bg-white min-h-screen">
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
                <p class="text-xs text-neutral-500">{{ new Date(update.created_at).toLocaleDateString() }}</p>
              </div>
            </div>
            <div v-if="isStaff" class="flex items-center space-x-2">
              <button @click="editUpdate" class="p-2 hover:bg-neutral-100 rounded-full">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button @click="deleteUpdate" class="p-2 hover:bg-red-50 text-red-600 rounded-full">
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
          <div v-if="update.media_files && update.media_files.length > 0" class="relative">
            <!-- Main Media Display - Slightly bigger -->
            <div class="relative bg-black">
              <img 
                v-if="currentMedia.type === 'image'"
                :src="currentMedia.url" 
                :alt="update.title"
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
            <div v-if="update.media_files.length > 1" class="absolute bottom-3 left-1/2 transform -translate-x-1/2">
              <div class="flex space-x-1">
                <div
                  v-for="(media, index) in update.media_files"
                  :key="index"
                  class="w-2 h-2 rounded-full transition-all"
                  :class="currentMediaIndex === index ? 'bg-white' : 'bg-white/50'"
                ></div>
              </div>
            </div>
            
            <!-- Arrow Navigation-->
            <div v-if="update.media_files.length > 1" class="absolute inset-y-0 left-0 flex items-center">
              <button
                @click="previousMedia"
                class="ml-2 w-8 h-8 bg-black/30 text-white rounded-full hover:bg-black/50 transition-all flex items-center justify-center"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
            </div>
            <div v-if="update.media_files.length > 1" class="absolute inset-y-0 right-0 flex items-center">
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
          
          <!-- Fallback for old single media format -->
          <div v-else-if="update.media_url" class="relative bg-black">
            <img 
              v-if="update.media_type === 'image'"
              :src="update.media_url" 
              :alt="update.title"
              class="w-full max-h-[500px] object-contain"
            />
            <video
              v-else-if="update.media_type === 'video'"
              :src="update.media_url"
              controls
              class="w-full max-h-[500px] object-contain"
            ></video>
          </div>
          
          <!-- Default image -->
          <div v-else class="relative bg-black">
            <img 
              src="https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg" 
              :alt="update.title"
              class="w-full max-h-[500px] object-contain"
            />
          </div>
        </div>

        <!-- Content Section -->
        <div class="px-4 py-3">
          <!-- Title and Content -->
          <div class="space-y-2">
            <h1 class="font-semibold text-lg leading-tight">{{ update.title }}</h1>
            <div class="text-sm leading-relaxed whitespace-pre-wrap text-neutral-800">{{ update.content }}</div>
          </div>

          <!-- Timestamp -->
          <div class="mt-4 text-xs text-neutral-500 uppercase tracking-wide">
            {{ formatDate(update.created_at) }}
          </div>
        </div>

        <!-- Media Carousel-->
        <div v-if="update.media_files && update.media_files.length > 1" class="px-4 pb-4">
          <div class="flex space-x-2 overflow-x-auto scrollbar-hide">
            <div
              v-for="(media, index) in update.media_files"
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

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>