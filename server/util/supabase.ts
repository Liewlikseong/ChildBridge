import { createClient } from '@supabase/supabase-js'

// Use Nuxt's runtimeConfig for better handling
export const useSupabase = () => {
  const config = useRuntimeConfig()

  // Ensure the environment variables are available from Nuxt runtime config
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  // Initialize Supabase client
  return createClient(supabaseUrl, supabaseKey)
}





