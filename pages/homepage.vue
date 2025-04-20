<template>
  
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
  