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
            Latest Updates
          </h1>
          <p class="text-xl text-blue-100 leading-relaxed animate-fade-in">
            Stay informed about the latest news and developments from Jing Sun Welfare Society.
          </p>
        </div>
      </div>
    </section>

    <!-- Enhanced Updates List -->
    <section class="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="container-custom">
        <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">All Updates</h2>
            <p class="text-gray-600">Stay connected with our latest news and community stories</p>
          </div>
          <div v-if="isStaff">
            <NuxtLink 
              to="/updates/new" 
              class="group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create New Update
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Enhanced Updates Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <article 
            v-for="update in displayedUpdates" 
            :key="update.id" 
            class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden border border-gray-100"
          >
            <!-- Enhanced Unpublished Badge -->
            <div 
              v-if="isStaff && !update.published"
              class="absolute top-4 left-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg"
            >
              <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              Draft
            </div>

            <!-- Enhanced Media Display -->
            <div class="aspect-w-16 aspect-h-9 overflow-hidden relative">
              <!-- Multiple Media Display -->
              <div v-if="update.media_files && update.media_files.length > 0" class="relative">
                <!-- Main Media -->
                <img 
                  v-if="update.media_files[0].type === 'image'"
                  :src="update.media_files[0].url" 
                  :alt="update.title"
                  class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div v-else-if="update.media_files[0].type === 'video'" class="relative">
                  <video
                    :src="update.media_files[0].url"
                    class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    muted
                  ></video>
                  <!-- Video Play Overlay -->
                  <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 to-transparent">
                    <div class="w-16 h-16 bg-white bg-opacity-95 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-110">
                      <svg class="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- Enhanced Media Count Indicator -->
                <div 
                  v-if="update.media_files.length > 1"
                  class="absolute top-4 right-4 bg-gradient-to-r from-black/60 to-black/40 text-white text-xs font-bold px-3 py-2 rounded-full backdrop-blur-sm shadow-lg"
                >
                  <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                  </svg>
                  {{ update.media_files.length }} Photos
                </div>
              </div>
              
              <!-- Fallback Media with gradient overlay -->
              <div v-else-if="update.media_url" class="relative">
                <img 
                  v-if="update.media_type === 'image'"
                  :src="update.media_url" 
                  :alt="update.title"
                  class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div v-else-if="update.media_type === 'video'" class="relative">
                  <video
                    :src="update.media_url"
                    class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    muted
                  ></video>
                  <!-- Video Play Overlay -->
                  <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 to-transparent">
                    <div class="w-16 h-16 bg-white bg-opacity-95 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-110">
                      <svg class="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <!-- Enhanced Default Image -->
              <div v-else class="relative">
                <img 
                  src="https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg"
                  :alt="update.title"
                  class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            <!-- Enhanced Card Content -->
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center">
                  <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ new Date(update.created_at).toLocaleDateString() }}
                </span>
              </div>

              <h3 class="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                {{ update.title }}
              </h3>

              <p class="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{{ update.content }}</p>

              <!-- Enhanced Bottom Section -->
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100 gap-3 sm:gap-0">
                <NuxtLink 
                  :to="`/updates/${update.id}`" 
                  class="group text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center transition-colors duration-300"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  </svg>
                  Read more
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </NuxtLink>

                <div v-if="isStaff" class="flex flex-wrap gap-2 sm:gap-3">
                  <button 
                    @click="editUpdate(update.id)"
                    class="text-gray-600 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center min-w-0 flex-shrink-0"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Edit
                  </button>
                  <button 
                    @click="deleteUpdate(update.id)"
                    class="text-gray-600 hover:text-red-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center min-w-0 flex-shrink-0"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Enhanced No Updates Message -->
        <div v-if="displayedUpdates.length === 0" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-700 mb-3">No Updates Yet</h3>
            <p class="text-gray-500 mb-6 leading-relaxed">
              Check back soon for the latest news and updates from our community.
            </p>
            <div v-if="!isStaff" class="text-sm text-gray-400">
              <svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
              New updates are published regularly
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