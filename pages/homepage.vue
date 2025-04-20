<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">Donations</h1>
      <ul>
        <li v-for="donation in donations" :key="donation.id">
          {{ donation.name }} donated ${{ donation.amount }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  const donations = ref([])
  const supabase = useSupabaseClient()
  
  onMounted(async () => {
    const { data, error } = await supabase.from('donations').select('*')
  
    if (error) {
      console.error('Error fetching donations:', error.message)
    } else {
      donations.value = data
    }
  })
  </script>
  