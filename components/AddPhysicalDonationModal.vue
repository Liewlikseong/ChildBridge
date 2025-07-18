<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">Add Physical Donation</h3>
      
      <form @submit.prevent="submitPhysicalDonation" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Donor Name *
          </label>
          <input
            v-model="form.donorName"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter donor's full name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Donor Email
          </label>
          <input
            v-model="form.donorEmail"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="donor@example.com (optional)"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            v-model="form.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="general">General</option>
            <option value="food">Food Items</option>
            <option value="clothing">Clothing</option>
            <option value="toys">Toys & Games</option>
            <option value="books">Books</option>
            <option value="medical">Medical Supplies</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Donation Items *
          </label>
          <textarea
            v-model="form.items"
            rows="4"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe the donated items in detail (e.g., 10 bags of rice, 5 children's books, etc.)"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            v-model="form.notes"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Additional notes or special instructions..."
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {{ submitting ? 'Adding...' : 'Add Donation' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close', 'success']);

const user = useSupabaseUser();
const submitting = ref(false);

const form = ref({
  donorName: '',
  donorEmail: '',
  category: 'general',
  items: '',
  notes: ''
});

const submitPhysicalDonation = async () => {
  if (!form.value.donorName || !form.value.items) {
    alert('Please fill in all required fields');
    return;
  }

  submitting.value = true;

  try {
    const donationData = {
      donor_name: form.value.donorName,
      donor_email: form.value.donorEmail || null,
      category: form.value.category,
      type: 'physical',
      amount: 0,
      currency: 'myr',
      status: 'completed',
      message: `Items: ${form.value.items}${form.value.notes ? `\n\nNotes: ${form.value.notes}` : ''}`,
      created_by_staff: user.value?.id
    };

    await $fetch('/api/donations/add-physical', {
      method: 'POST',
      body: donationData
    });

    alert('Physical donation added successfully!');
    emit('success');
  } catch (error) {
    console.error('Error adding physical donation:', error);
    alert('Failed to add physical donation');
  } finally {
    submitting.value = false;
  }
};
</script>