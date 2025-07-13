<template>
  <div class="py-16 bg-neutral-50">
    <div class="container-custom">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-8">
          <h1 class="text-3xl font-bold mb-8">Create New Event</h1>
          
          <div class="space-y-6">
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
                <label for="location" class="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                <input
                  id="location"
                  v-model="eventData.location"
                  type="text"
                  class="input"   
                  placeholder="Enter event location"
                />
              </div>
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

            <!-- Multiple Media Upload -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">Event Media (Images & Videos)</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                <div class="space-y-1 text-center w-full">
                  <!-- Upload Area -->
                  <div class="flex text-sm text-neutral-600">
                    <label for="media-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload media files</span>
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
                    Images: PNG, JPG, GIF up to 10MB | Videos: MP4, MOV up to 50MB
                  </p>
                </div>
              </div>

              <!-- Media Preview Grid -->
              <div v-if="mediaFiles.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                <div v-for="(media, index) in mediaFiles" :key="index" class="relative group">
                  <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <!-- Image Preview -->
                    <img 
                      v-if="media.type === 'image'"
                      :src="media.preview_url" 
                      alt="Preview"
                      class="w-full h-full object-cover"
                    />
                    
                    <!-- Video Preview -->
                    <div v-else-if="media.type === 'video'" class="w-full h-full bg-gray-200 flex items-center justify-center relative">
                      <video 
                        :src="media.preview_url"
                        class="w-full h-full object-cover"
                        muted
                      ></video>
                      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                        </svg>
                      </div>
                    </div>
                    
                    <!-- Upload Progress -->
                    <div 
                      v-if="media.uploading" 
                      class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
                    >
                      <div class="text-white text-sm">{{ media.progress }}%</div>
                    </div>
                    
                    <!-- Remove Button -->
                    <button
                      type="button"
                      @click="removeMediaFile(index)"
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Products Section - Only for Selling Events -->
            <div v-if="eventData.event_type === 'selling'" class="bg-blue-50 p-6 rounded-lg">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-blue-900">Products for Sale</h3>
                <button
                  type="button"
                  @click="addProduct"
                  class="btn btn-primary"
                >
                  Add Product
                </button>
              </div>

              <div v-if="products.length === 0" class="text-center py-8">
                <p class="text-blue-700">No products added yet. Click "Add Product" to get started.</p>
              </div>

              <div v-else class="space-y-4">
                <div 
                  v-for="(product, index) in products" 
                  :key="product.id" 
                  class="bg-white p-4 rounded-lg border"
                >
                  <div class="flex justify-between items-start mb-4">
                    <h4 class="font-medium text-gray-900">Product {{ index + 1 }}</h4>
                    <button
                      type="button"
                      @click="removeProduct(product.id)"
                      class="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                      <input
                        v-model="product.name"
                        type="text"
                        required
                        class="input"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Price (RM) *</label>
                      <input
                        v-model="product.price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        class="input"
                        placeholder="0.00"
                      />
                    </div>

                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        v-model="product.description"
                        rows="2"
                        class="input"
                        placeholder="Product description..."
                      ></textarea>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <input
                        v-model="product.stock_quantity"
                        type="number"
                        min="0"
                        class="input"
                        placeholder="Leave empty for unlimited"
                      />
                    </div>

                    <div class="flex items-center">
                      <input
                        v-model="product.available"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mr-2"
                      />
                      <label class="text-sm text-gray-700">Available for purchase</label>
                    </div>

                    <!-- Product Image Upload -->
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                      <div class="flex items-center space-x-4">
                        <div v-if="product.image_url" class="relative">
                          <img :src="product.image_url" alt="Product" class="w-20 h-20 object-cover rounded-lg" />
                          <button
                            type="button"
                            @click="removeProductImage(product.id)"
                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                        <label class="cursor-pointer">
                          <span class="btn btn-outline text-sm">
                            {{ product.image_url ? 'Change Image' : 'Add Image' }}
                          </span>
                          <input 
                            type="file" 
                            class="sr-only" 
                            @change="(e) => handleProductImageUpload(e, product.id)"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Donation/Fundraiser Price (Optional) -->
            <div v-if="isDonationOrFundraiser" class="bg-green-50 p-4 rounded-lg">
              <label for="price" class="block text-sm font-medium text-green-800 mb-2">
                Suggested Donation Amount (Optional)
              </label>
              <input
                id="price"
                v-model="eventData.price"
                type="number"
                step="0.01"
                min="0"
                class="input max-w-xs"
                placeholder="0.00"
              />
              <p class="text-sm text-green-700 mt-1">
                Donors can choose their own amount if this is left empty.
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
                type="button"
                @click="saveEvent"
                class="btn btn-primary"
                :disabled="loading || !isFormValid || isUploading"
              >
                <span v-if="loading" class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Event...
                </span>
                <span v-else-if="isUploading">Uploading...</span>
                <span v-else>Create Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useSupabaseClient, useSupabaseUser, navigateTo } from '#imports';
import { v4 as uuidv4 } from 'uuid';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const loading = ref(false);
const mediaFiles = ref([]);
const products = ref([]);
const error = ref('');

// Get today's date for date input minimum
const today = new Date().toISOString().split('T')[0];

const eventData = ref({
  title: '',
  content: '',
  event_type: '',
  location: '',
  event_startdate: '',
  event_enddate: '',
  price: null,
  published: true
});

// Computed properties
const isFormValid = computed(() => {
  const basicValid = eventData.value.title.trim() && 
         eventData.value.content.trim() &&
         eventData.value.event_type &&
         eventData.value.event_startdate &&
         eventData.value.event_enddate &&
         new Date(eventData.value.event_startdate) <= new Date(eventData.value.event_enddate);

  if (eventData.value.event_type === 'selling') {
    return basicValid && products.value.length > 0 && products.value.every(p => 
      p.name.trim() && p.price && parseFloat(p.price) > 0
    );
  }

  return basicValid;
});

const isUploading = computed(() => {
  return mediaFiles.value.some(media => media.uploading);
});

const isDonationOrFundraiser = computed(() => {
  return ['donation', 'fundraiser'].includes(eventData.value.event_type);
});

// Media upload handler
const handleMediaUpload = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  error.value = '';

  for (const file of files) {
    // Validate file type and size
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      error.value = 'Please upload only image or video files.';
      continue;
    }

    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      error.value = `File ${file.name} is too large. Max size: ${file.type.startsWith('video/') ? '50MB' : '10MB'}`;
      continue;
    }

    const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
    const mediaItem = {
      file,
      type: mediaType,
      preview_url: URL.createObjectURL(file),
      uploading: true,
      progress: 0,
      uploaded_url: null
    };

    mediaFiles.value.push(mediaItem);

    try {
      // Upload file
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const index = mediaFiles.value.findIndex(m => m.file === file);
            if (index !== -1) {
              mediaFiles.value[index].progress = Math.round((progress.loaded / progress.total) * 100);
            }
          }
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Update media item
      const index = mediaFiles.value.findIndex(m => m.file === file);
      if (index !== -1) {
        mediaFiles.value[index].uploaded_url = publicUrl;
        mediaFiles.value[index].uploading = false;
        mediaFiles.value[index].progress = 100;
      }

    } catch (uploadError) {
      console.error('Error uploading file:', uploadError);
      error.value = `Failed to upload ${file.name}`;
      // Remove failed upload from the list
      const index = mediaFiles.value.findIndex(m => m.file === file);
      if (index !== -1) {
        URL.revokeObjectURL(mediaFiles.value[index].preview_url);
        mediaFiles.value.splice(index, 1);
      }
    }
  }

  // Clear the file input
  event.target.value = '';
};

// Remove media file
const removeMediaFile = (index) => {
  const media = mediaFiles.value[index];
  if (media.preview_url) {
    URL.revokeObjectURL(media.preview_url);
  }
  mediaFiles.value.splice(index, 1);
};

// Product management
const addProduct = () => {
  products.value.push({
    id: Date.now(),
    name: '',
    description: '',
    price: '',
    image_url: '',
    stock_quantity: '',
    available: true
  });
};

const removeProduct = (id) => {
  products.value = products.value.filter(product => product.id !== id);
};

// Product image upload
const handleProductImageUpload = async (event, productId) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file for the product.';
    return;
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit for product images
    error.value = 'Product image is too large. Maximum size is 5MB.';
    return;
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `product_${uuidv4()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // Update product image URL
    const productIndex = products.value.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      products.value[productIndex].image_url = publicUrl;
    }

  } catch (uploadError) {
    console.error('Error uploading product image:', uploadError);
    error.value = 'Failed to upload product image. Please try again.';
  }

  // Clear the file input
  event.target.value = '';
};

const removeProductImage = (productId) => {
  const productIndex = products.value.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    products.value[productIndex].image_url = '';
  }
};

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
    error.value = 'Unable to verify user permissions';
    await navigateTo('/events');
  }
};

const saveEvent = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields';
    return;
  }

  if (isUploading.value) {
    error.value = 'Please wait for all uploads to complete';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // Prepare media files data
    const uploadedMediaFiles = mediaFiles.value
      .filter(media => media.uploaded_url)
      .map(media => ({
        type: media.type,
        url: media.uploaded_url
      }));

    const insertData = {
      title: eventData.value.title.trim(),
      content: eventData.value.content.trim(),
      event_type: eventData.value.event_type,
      location: eventData.value.location?.trim() || null,
      event_startdate: eventData.value.event_startdate,
      event_enddate: eventData.value.event_enddate,
      price: eventData.value.price || null,
      poster_url: uploadedMediaFiles.length > 0 ? uploadedMediaFiles[0].url : null, // Backward compatibility
      media_files: uploadedMediaFiles,
      published: eventData.value.published,
      staff_id: user.value.id
    };

    const { data: eventResult, error: insertError } = await supabase
      .from('events')
      .insert(insertData)
      .select()
      .single();

    if (insertError) throw insertError;

    // Insert products if this is a selling event
    if (eventData.value.event_type === 'selling' && products.value.length > 0) {
      const productsData = products.value.map(product => ({
        event_id: eventResult.id,
        name: product.name.trim(),
        description: product.description?.trim() || null,
        price: parseFloat(product.price),
        image_url: product.image_url || null,
        stock_quantity: product.stock_quantity ? parseInt(product.stock_quantity) : null,
        available: product.available
      }));

      const { error: productsError } = await supabase
        .from('products')
        .insert(productsData);

      if (productsError) throw productsError;
    }

    // Success - redirect to events page
    await navigateTo('/events');

  } catch (err) {
    console.error('Error saving event:', err);
    error.value = err.message || 'Failed to create event. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  // Clean up preview URLs before navigating
  mediaFiles.value.forEach(media => {
    if (media.preview_url) {
      URL.revokeObjectURL(media.preview_url);
    }
  });
  navigateTo('/events');
};

onMounted(() => {
  checkUserRole();
});

// Cleanup preview URLs when component is unmounted
onUnmounted(() => {
  mediaFiles.value.forEach(media => {
    if (media.preview_url) {
      URL.revokeObjectURL(media.preview_url);
    }
  });
});
</script>