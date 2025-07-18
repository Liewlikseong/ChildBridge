<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
      <div class="flex justify-between items-start mb-6">
        <h3 class="text-lg font-semibold">Donation Details</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-medium text-gray-600">Donor:</span>
          <p class="mt-1">{{ getDonorName(donation) }}</p>
        </div>
        <div>
          <span class="font-medium text-gray-600">Email:</span>
          <p class="mt-1">{{ getDonorEmail(donation) || 'N/A' }}</p>
        </div>
        <div>
          <span class="font-medium text-gray-600">Type:</span>
          <p class="mt-1">
            <span :class="getTypeColor(donation.type)" class="px-2 py-1 text-xs font-semibold rounded-full">
              {{ formatType(donation.type) }}
            </span>
          </p>
        </div>
        <div>
          <span class="font-medium text-gray-600">Amount:</span>
          <p class="mt-1 font-semibold">
            {{ donation.type === 'physical' ? 'N/A' : `RM${donation.amount.toFixed(2)}` }}
          </p>
        </div>
        <div>
          <span class="font-medium text-gray-600">Category:</span>
          <p class="mt-1">{{ donation.category || 'General' }}</p>
        </div>
        <div>
          <span class="font-medium text-gray-600">Status:</span>
          <p class="mt-1">
            <span :class="getStatusColor(donation.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
              {{ donation.status }}
            </span>
          </p>
        </div>
        <div>
          <span class="font-medium text-gray-600">Date:</span>
          <p class="mt-1">{{ formatDate(donation.created_at) }}</p>
        </div>
        <div v-if="donation.stripe_payment_intent_id">
          <span class="font-medium text-gray-600">Payment ID:</span>
          <p class="mt-1 text-xs break-all font-mono bg-gray-100 p-2 rounded">
            {{ donation.stripe_payment_intent_id }}
          </p>
        </div>
      </div>

      <div v-if="donation.message" class="mt-6">
        <span class="font-medium text-gray-600">Message/Items:</span>
        <div class="mt-2 p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">
          {{ donation.message }}
        </div>
      </div>

      <!-- Additional Actions -->
      <div v-if="donation.status === 'pending'" class="mt-6 pt-4 border-t border-gray-200">
        <div class="flex justify-end space-x-3">
          <button
            @click="updateStatus('failed')"
            class="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
          >
            Mark as Failed
          </button>
          <button
            @click="updateStatus('completed')"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Mark as Completed
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  donation: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'statusUpdated']);

// Helper functions
const getDonorName = (donation) => {
  if (donation.profiles?.first_name && donation.profiles?.last_name) {
    return `${donation.profiles.first_name} ${donation.profiles.last_name}`;
  }
  return donation.donor_name || 'Anonymous Donor';
};

const getDonorEmail = (donation) => donation.profiles?.email || donation.donor_email || '';

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

const getStatusColor = (status) => {
  const colors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const updateStatus = async (newStatus) => {
  try {
    await $fetch('/api/donations/update-status', {
      method: 'POST',
      body: { donation_id: props.donation.id, status: newStatus }
    });
    
    emit('statusUpdated', { donationId: props.donation.id, newStatus });
    emit('close');
    alert('Donation status updated successfully!');
  } catch (error) {
    console.error('Error updating donation status:', error);
    alert('Failed to update donation status');
  }
};
</script>