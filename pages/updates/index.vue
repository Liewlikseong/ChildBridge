<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary-900 text-white py-16">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Latest Updates</h1>
          <p class="text-xl text-primary-100">Stay informed about the latest news and developments from Jing Sun Welfare Society.</p>
        </div>
      </div>
    </section>

    <!-- Updates List -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="mb-8 flex justify-between items-center">
          <h2 class="text-3xl font-bold">All Updates</h2>
          <div v-if="isStaff">
            <NuxtLink 
              to="/updates/new" 
              class="btn btn-primary"
            >
              Create New Update
            </NuxtLink>
          </div>
        </div>

        <!-- Updates Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="update in displayedUpdates" 
            :key="update.id" 
            class="card hover:shadow-lg transition-shadow relative"
          >
            <!-- Unpublished Badge (Staff Only) -->
            <div 
              v-if="isStaff && !update.published"
              class="absolute top-2 left-2 z-10 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full"
            >
              Draft
            </div>

            <!-- Media Display -->
            <div class="aspect-w-16 aspect-h-9 overflow-hidden relative">
              <!-- Multiple Media Display -->
              <div v-if="update.media_files && update.media_files.length > 0" class="relative">
                <!-- Main Media -->
                <img 
                  v-if="update.media_files[0].type === 'image'"
                  :src="update.media_files[0].url" 
                  :alt="update.title"
                  class="w-full h-64 object-cover"
                />
                <video
                  v-else-if="update.media_files[0].type === 'video'"
                  :src="update.media_files[0].url"
                  class="w-full h-64 object-cover"
                  muted
                ></video>
                
                <!-- Media Count Indicator -->
                <div 
                  v-if="update.media_files.length > 1"
                  class="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded-full flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                  </svg>
                  {{ update.media_files.length }}
                </div>
              </div>
              
              <!-- Fallback Media -->
              <div v-else-if="update.media_url" class="relative">
                <img 
                  v-if="update.media_type === 'image'"
                  :src="update.media_url" 
                  :alt="update.title"
                  class="w-full h-64 object-cover"
                />
                <video
                  v-else-if="update.media_type === 'video'"
                  :src="update.media_url"
                  class="w-full h-64 object-cover"
                  muted
                ></video>
              </div>
              
              <!-- Default Image -->
              <img 
                v-else
                src="https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg"
                :alt="update.title"
                class="w-full h-64 object-cover"
              />
            </div>
            
            <div class="p-6">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-neutral-500">
                  {{ new Date(update.created_at).toLocaleDateString() }}
                </span>
                <span class="text-xs font-medium bg-primary-100 text-primary-800 py-1 px-2 rounded-full">
                  {{ update.category || 'General' }}
                </span>
              </div>
              <h3 class="text-xl font-semibold mb-2">{{ update.title }}</h3>
              <p class="text-neutral-600 mb-4 line-clamp-3">{{ update.content }}</p>
              <div class="flex justify-between items-center">
                <NuxtLink 
                  :to="`/updates/${update.id}`" 
                  class="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read more
                </NuxtLink>
                <div v-if="isStaff" class="flex space-x-2">
                  <button 
                    @click="editUpdate(update.id)"
                    class="text-neutral-600 hover:text-primary-600"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteUpdate(update.id)"
                    class="text-neutral-600 hover:text-error-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
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

const updates = ref([]);
const loading = ref(true);
const error = ref(null);
const isStaff = ref(false);

// Computed property to handle guest vs authenticated user view and staff filter
const displayedUpdates = computed(() => {
  let filteredUpdates = updates.value;
  
  // If user is not staff, only show published updates
  if (!isStaff.value) {
    filteredUpdates = updates.value.filter(update => update.published === true);
  }
  
  // If user is not authenticated and there are more than 3 updates, limit to 3
  if (!user.value && filteredUpdates.length > 3) {
    return filteredUpdates.slice(0, 3);
  }
  
  return filteredUpdates;
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

// Fetch updates
const fetchUpdates = async () => {
  try {
    let query = supabase
      .from('updates')
      .select('*')
      .order('created_at', { ascending: false });

    // If user is not staff, only fetch published updates
    if (!isStaff.value) {
      query = query.eq('published', true);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) throw fetchError;
    updates.value = data;
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching updates:', err);
  } finally {
    loading.value = false;
  }
};

// Edit update
const editUpdate = (id) => {
  navigateTo(`/updates/edit/${id}`);
};

// Delete update
const deleteUpdate = async (id) => {
  if (!confirm('Are you sure you want to delete this update?')) return;

  try {
    // First, get the update to check for media
    const { data: update } = await supabase
      .from('updates')
      .select('media_url, media_files')
      .eq('id', id)
      .single();

    // Delete media files from storage
    const filesToDelete = [];
    
    // Handle old single media format
    if (update?.media_url) {
      const mediaPath = update.media_url.split('/').pop();
      filesToDelete.push(`updates/${mediaPath}`);
    }
    
    // Handle new multiple media format
    if (update?.media_files && Array.isArray(update.media_files)) {
      update.media_files.forEach(mediaFile => {
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

    // Delete the update record
    const { error: deleteError } = await supabase
      .from('updates')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
    
    updates.value = updates.value.filter(update => update.id !== id);
  } catch (err) {
    console.error('Error deleting update:', err);
    alert('Failed to delete update. Please try again.');
  }
};

onMounted(async () => {
  await checkUserRole();
  await fetchUpdates();
});
</script>