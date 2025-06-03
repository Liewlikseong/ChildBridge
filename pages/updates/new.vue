<template>
  <div class="py-16 bg-neutral-50">
    <div class="container-custom">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h1 class="text-3xl font-bold mb-8">Create New Update</h1>
          
          <form @submit.prevent="saveUpdate" class="space-y-6">
            <div>
              <label for="title" class="block text-sm font-medium text-neutral-700 mb-1">Title</label>
              <input
                id="title"
                v-model="updateData.title"
                type="text"
                required
                class="input"   
                placeholder="Enter update title"
              />
            </div>

            <div>
              <label for="content" class="block text-sm font-medium text-neutral-700 mb-1">Content</label>
              <textarea
                id="content"
                v-model="updateData.content"
                rows="6"
                required
                class="input"
                placeholder="Write your update content here..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Media Files</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                <div class="space-y-1 text-center w-full">
                  <!-- Media Previews -->
                  <div v-if="mediaPreviews.length > 0" class="mb-4">
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div 
                        v-for="(preview, index) in mediaPreviews" 
                        :key="index" 
                        class="relative group"
                      >
                        <img 
                          v-if="preview.type === 'image'" 
                          :src="preview.url" 
                          alt="Preview" 
                          class="w-full h-32 object-cover rounded-lg" 
                        />
                        <video 
                          v-else-if="preview.type === 'video'" 
                          :src="preview.url" 
                          class="w-full h-32 object-cover rounded-lg"
                          controls
                        ></video>
                        
                        <!-- Remove button -->
                        <button
                          type="button"
                          @click="removeMediaItem(index)"
                          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        
                        <!-- Upload progress for individual files -->
                        <div 
                          v-if="preview.uploading" 
                          class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
                        >
                          <div class="text-white text-sm">{{ preview.progress }}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Upload Area -->
                  <div class="flex text-sm text-neutral-600">
                    <label for="media-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload files</span>
                      <input 
                        id="media-upload" 
                        type="file" 
                        class="sr-only" 
                        @change="handleMediaUpload"
                        accept="image/*,video/*"
                        multiple
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-neutral-500">
                    PNG, JPG, GIF up to 10MB each (for images) or MP4, WebM up to 100MB each (for videos)
                  </p>
                  <p class="text-xs text-neutral-400">
                    Maximum 10 files total
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center">
              <input
                id="published"
                v-model="updateData.published"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label for="published" class="ml-2 block text-sm text-neutral-700">
                Publish immediately
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
                  Saving...
                </span>
                <span v-else-if="isUploading">Uploading...</span>
                <span v-else>Save Update</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSupabaseClient, useSupabaseUser, navigateTo } from '#imports';
import { v4 as uuidv4 } from 'uuid';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const loading = ref(false);
const mediaPreviews = ref([]);
const error = ref('');

const updateData = ref({
  title: '',
  content: '',
  media_files: [], // Array to store multiple media URLs and types
  published: true
});

// Computed properties
const isFormValid = computed(() => {
  return updateData.value.title.trim() && 
         updateData.value.content.trim();
});

const isUploading = computed(() => {
  return mediaPreviews.value.some(preview => preview.uploading);
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
      await navigateTo('/updates');
    }
  } catch (err) {
    console.error('Error checking user role:', err);
    error.value = 'Unable to verify user permissions';
    await navigateTo('/updates');
  }
};

const handleMediaUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  // Check total file limit
  if (mediaPreviews.value.length + files.length > 10) {
    error.value = 'Maximum 10 files allowed';
    return;
  }

  error.value = '';

  for (const file of files) {
    // Validate file type and size
    let isValidFile = false;
    let fileType = '';

    if (file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for images
        error.value = `Image file "${file.name}" is too large. Maximum size is 10MB.`;
        continue;
      }
      isValidFile = true;
      fileType = 'image';
    } else if (file.type.startsWith('video/')) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit for videos
        error.value = `Video file "${file.name}" is too large. Maximum size is 100MB.`;
        continue;
      }
      isValidFile = true;
      fileType = 'video';
    }

    if (!isValidFile) {
      error.value = `"${file.name}" is not a supported file type.`;
      continue;
    }

    // Create preview object
    const previewObj = {
      url: URL.createObjectURL(file),
      type: fileType,
      file: file,
      uploading: true,
      progress: 0,
      uploaded_url: null
    };

    mediaPreviews.value.push(previewObj);
    const currentIndex = mediaPreviews.value.length - 1;

    // Upload file
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `updates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            mediaPreviews.value[currentIndex].progress = Math.round((progress.loaded / progress.total) * 100);
          }
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Update preview object
      mediaPreviews.value[currentIndex].uploaded_url = publicUrl;
      mediaPreviews.value[currentIndex].uploading = false;
      mediaPreviews.value[currentIndex].progress = 100;

    } catch (uploadError) {
      console.error('Error uploading file:', uploadError);
      error.value = `Failed to upload "${file.name}". Please try again.`;
      removeMediaItem(currentIndex);
    }
  }

  // Clear the file input
  event.target.value = '';
};

const removeMediaItem = (index) => {
  const preview = mediaPreviews.value[index];
  if (preview.url) {
    URL.revokeObjectURL(preview.url);
  }
  
  // If file was uploaded, you might want to delete it from storage here
  // This is optional depending on your requirements
  
  mediaPreviews.value.splice(index, 1);
};

const saveUpdate = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields';
    return;
  }

  if (isUploading.value) {
    error.value = 'Please wait for all files to finish uploading';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // Prepare media files data
    const mediaFiles = mediaPreviews.value
      .filter(preview => preview.uploaded_url)
      .map(preview => ({
        url: preview.uploaded_url,
        type: preview.type
      }));

    const insertData = {
      title: updateData.value.title.trim(),
      content: updateData.value.content.trim(),
      published: updateData.value.published,
      staff_id: user.value.id,
      media_files: mediaFiles // Store as JSON array
    };

    const { data, error: insertError } = await supabase
      .from('updates')
      .insert(insertData)
      .select()
      .single();

    if (insertError) throw insertError;

    // Success - redirect to updates page
    await navigateTo('/updates');

  } catch (err) {
    console.error('Error saving update:', err);
    error.value = err.message || 'Failed to save update. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  // Clean up any preview URLs before navigating
  mediaPreviews.value.forEach(preview => {
    if (preview.url) {
      URL.revokeObjectURL(preview.url);
    }
  });
  navigateTo('/updates');
};

onMounted(() => {
  checkUserRole();
});

// Cleanup preview URLs when component is unmounted
onUnmounted(() => {
  mediaPreviews.value.forEach(preview => {
    if (preview.url) {
      URL.revokeObjectURL(preview.url);
    }
  });
});
</script>
