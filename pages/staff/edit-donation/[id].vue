<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <button
            @click="goBack"
            class="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Donations
          </button>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Edit Donation</h1>
        <p class="text-gray-600">Update donation details and status</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-500">Loading donation details...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="text-red-800">{{ error }}</div>
        <button
          @click="goBack"
          class="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Return to donations list
        </button>
      </div>

      <!-- Edit Form -->
      <div v-else-if="donation" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="updateDonation" class="bg-white shadow rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-6">Donation Details</h2>

            <!-- Donation Type Display -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm font-medium text-gray-600">Donation Type:</span>
                  <span :class="getTypeColor(donation.type)" class="ml-2 px-3 py-1 text-sm font-semibold rounded-full">
                    {{ formatType(donation.type) }}
                  </span>
                </div>
                <div class="text-sm text-gray-500">
                  ID: {{ donation.id.substring(0, 8) }}...
                </div>
              </div>
            </div>

            <!-- Donor Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Donor Name *
                </label>
                <input
                  v-model="form.donorName"
                  type="text"
                  required
                  :disabled="!canEditDonorInfo"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter donor's full name"
                />
                <p v-if="!canEditDonorInfo" class="text-xs text-gray-500 mt-1">
                  Cannot edit for registered users
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Donor Email
                </label>
                <input
                  v-model="form.donorEmail"
                  type="email"
                  :disabled="!canEditDonorInfo"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="donor@example.com"
                />
              </div>
            </div>

            <!-- Category and Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  v-model="form.category"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="food">Food Items</option>
                  <option value="clothing">Clothing</option>
                  <option value="toys">Toys & Games</option>
                  <option value="books">Books</option>
                  <option value="medical">Medical Supplies</option>
                  <option value="education">Education</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  v-model="form.status"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  :class="getStatusSelectColor(form.status)"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="processing" v-if="donation.type !== 'physical'">Processing</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <!-- Amount (for monetary donations) -->
            <div v-if="donation.type !== 'physical'" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Amount (RM)
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">RM</span>
                <input
                  v-model.number="form.amount"
                  type="number"
                  min="0"
                  step="0.01"
                  disabled
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">Amount cannot be edited after creation</p>
            </div>

            <!-- Message/Items -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ donation.type === 'physical' ? 'Donation Items *' : 'Message' }}
              </label>
              <textarea
                v-model="form.message"
                :rows="donation.type === 'physical' ? 6 : 4"
                :required="donation.type === 'physical'"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                :placeholder="donation.type === 'physical' 
                  ? 'Describe the donated items in detail (e.g., 10 bags of rice, 5 children books, etc.)'
                  : 'Message from donor or additional notes...'"
              ></textarea>
            </div>

            <!-- Staff Notes -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Staff Notes
              </label>
              <textarea
                v-model="form.staffNotes"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add internal notes about this donation..."
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">These notes are for staff use only</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="goBack"
                class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Sidebar Info -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4">Donation Information</h3>
            
            <div class="space-y-3 text-sm">
              <div>
                <span class="font-medium text-gray-600">Created:</span>
                <p>{{ formatDate(donation.created_at) }}</p>
              </div>
              
              <div>
                <span class="font-medium text-gray-600">Last Updated:</span>
                <p>{{ formatDate(donation.updated_at) }}</p>
              </div>
              
              <div v-if="donation.stripe_payment_intent_id">
                <span class="font-medium text-gray-600">Payment ID:</span>
                <p class="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                  {{ donation.stripe_payment_intent_id }}
                </p>
              </div>
              
              <div v-if="donation.created_by_staff">
                <span class="font-medium text-gray-600">Added by Staff:</span>
                <p>{{ donation.created_by_staff }}</p>
              </div>
            </div>
          </div>

          <!-- Status Help -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-2">Status Guide</h4>
            <div class="text-sm text-blue-700 space-y-1">
              <div><strong>Pending:</strong> Awaiting completion</div>
              <div><strong>Completed:</strong> Successfully received/processed</div>
              <div v-if="donation.type !== 'physical'"><strong>Processing:</strong> Payment in progress</div>
              <div><strong>Failed:</strong> Could not complete</div>
              <div><strong>Cancelled:</strong> Donation cancelled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSupabaseClient } from '#imports';

definePageMeta({
  layout: 'staff',
  middleware: ['auth']
});

const route = useRoute();
const router = useRouter();
const supabase = useSupabaseClient();

// Get donation ID from route params
const donationId = route.params.id;

// Reactive data
const donation = ref(null);
const loading = ref(true);
const saving = ref(false);
const error = ref(null);

const form = ref({
  donorName: '',
  donorEmail: '',
  category: 'general',
  status: 'pending',
  amount: 0,
  message: '',
  staffNotes: ''
});

// Computed properties
const canEditDonorInfo = computed(() => {
  return !donation.value?.donor_id;
});

// Helper functions
const formatType = (type) => {
  const types = {
    onetime: 'One-time',
    subscription: 'Monthly',
    physical: 'Physical'
  };
  return types[type] || type;
};

const getTypeColor = (type) => {
  const colors = {
    onetime: 'bg-blue-100 text-blue-800',
    subscription: 'bg-green-100 text-green-800',
    physical: 'bg-purple-100 text-purple-800'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

const getStatusSelectColor = (status) => {
  const colors = {
    pending: 'border-yellow-300 bg-yellow-50',
    completed: 'border-green-300 bg-green-50',
    processing: 'border-blue-300 bg-blue-50',
    failed: 'border-red-300 bg-red-50',
    cancelled: 'border-gray-300 bg-gray-50'
  };
  return colors[status] || 'border-gray-300 bg-white';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Actions
const goBack = () => {
  router.push('/staff/donations');
};

const fetchDonation = async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log('🔄 Fetching donation with ID:', donationId);

    // Fetch donation directly from Supabase
    const { data: donationData, error: donationError } = await supabase
      .from('donations')
      .select(`
        *,
        profiles:donor_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', donationId)
      .single();

    if (donationError) {
      console.error('❌ Database error:', donationError);
      throw donationError;
    }

    if (!donationData) {
      console.error('❌ No donation found');
      throw new Error('Donation not found');
    }

    console.log('✅ Donation fetched successfully:', donationData);
    donation.value = donationData;
    
    // Populate form
    const donorName = donationData.donor_name || 
      (donationData.profiles?.first_name && donationData.profiles?.last_name 
        ? `${donationData.profiles.first_name} ${donationData.profiles.last_name}`
        : 'Anonymous Donor');
    
    const donorEmail = donationData.donor_email || donationData.profiles?.email || '';
    
    // Parse message to extract items and staff notes
    const message = donationData.message || '';
    let originalMessage = message;
    let staffNotes = '';
    
    // Check if there are staff notes
    const staffNoteMatch = message.match(/\n\nStaff Note(?:\s*\([^)]+\))?: (.+)$/s);
    if (staffNoteMatch) {
      staffNotes = staffNoteMatch[1];
      originalMessage = message.replace(/\n\nStaff Note(?:\s*\([^)]+\))?: .+$/s, '');
    }
    
    // For physical donations, remove "Items: " prefix
    if (donationData.type === 'physical' && originalMessage.startsWith('Items: ')) {
      originalMessage = originalMessage.substring(7);
    }

    form.value = {
      donorName,
      donorEmail,
      category: donationData.category || 'general',
      status: donationData.status,
      amount: donationData.amount || 0,
      message: originalMessage,
      staffNotes
    };

    console.log('✅ Form populated with donation data');

  } catch (err) {
    console.error('❌ Error fetching donation:', err);
    
    // More specific error messages
    if (err.code === 'PGRST116') {
      error.value = 'Donation not found. It may have been deleted or the ID is incorrect.';
    } else if (err.message?.includes('permission')) {
      error.value = 'Access denied. You may not have permission to view this donation.';
    } else {
      error.value = err.message || 'Failed to load donation details';
    }
  } finally {
    loading.value = false;
  }
};

const updateDonation = async () => {
  if (!form.value.donorName || (donation.value.type === 'physical' && !form.value.message)) {
    alert('Please fill in all required fields');
    return;
  }

  saving.value = true;

  try {
    console.log('🔄 Updating donation...');

    // Prepare message with staff notes
    let finalMessage = form.value.message;
    if (donation.value.type === 'physical') {
      finalMessage = `Items: ${form.value.message}`;
    }
    
    if (form.value.staffNotes) {
      finalMessage += `\n\nStaff Note (${new Date().toLocaleDateString()}): ${form.value.staffNotes}`;
    }

    // Prepare update data
    const updateData = {
      status: form.value.status,
      category: form.value.category,
      message: finalMessage,
      updated_at: new Date().toISOString()
    };

    // Add donor info for physical donations or if we can edit donor info
    if (donation.value.type === 'physical' || canEditDonorInfo.value) {
      updateData.donor_name = form.value.donorName;
      updateData.donor_email = form.value.donorEmail || null;
    }

    console.log('📤 Update data:', updateData);

    // Update donation directly in Supabase
    const { error } = await supabase
      .from('donations')
      .update(updateData)
      .eq('id', donationId);

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('✅ Donation updated successfully');
    alert('Donation updated successfully!');
    goBack();

  } catch (err) {
    console.error('❌ Error updating donation:', err);
    alert('Failed to update donation. Please try again.');
  } finally {
    saving.value = false;
  }
};

// Initialize
onMounted(() => {
  if (!donationId) {
    error.value = 'No donation ID provided';
    return;
  }
  fetchDonation();
});
</script>