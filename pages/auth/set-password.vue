<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set Your Password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Complete your account setup by creating a password
        </p>
      </div>
      
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-red-800 text-sm">{{ error }}</p>
      </div>

      <div v-if="loading" class="text-center">
        <p class="text-gray-600">Setting up your account...</p>
      </div>

      <form v-else @submit.prevent="setPassword" class="mt-8 space-y-6">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            v-model="password"
            required
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Enter your password"
          />
        </div>
        
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            v-model="confirmPassword"
            required
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Confirm your password"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="submitting"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {{ submitting ? 'Setting Password...' : 'Set Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const supabase = useSupabaseClient()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    console.log('=== DEBUGGING INVITATION FLOW ===')
    console.log('Route query params:', route.query)
    console.log('Hash:', window.location.hash)
    console.log('Search params:', window.location.search)
    console.log('Full URL:', window.location.href)
    
    // Show detailed debugging info
    const debugInfo = {
      hash: window.location.hash,
      search: window.location.search,
      pathname: window.location.pathname,
      href: window.location.href
    }
    console.log('Debug info:', debugInfo)
    
    // First, try to parse hash parameters (this is where Supabase puts the tokens)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const access_token = hashParams.get('access_token')
    const refresh_token = hashParams.get('refresh_token')
    const type = hashParams.get('type')
    
    console.log('Hash params extracted:', { 
      access_token: access_token ? `${access_token.substring(0, 10)}...` : 'missing', 
      refresh_token: refresh_token ? `${refresh_token.substring(0, 10)}...` : 'missing', 
      type 
    })
    
    // If we have tokens in the hash, use them to establish the session
    if (access_token && refresh_token) {
      console.log('Found tokens in hash, setting session...')
      
      const { data, error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token
      })
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        error.value = `Failed to validate invitation: ${sessionError.message}`
        loading.value = false
        return
      }
      
      console.log('Session established successfully from hash')
      loading.value = false
      return
    }
    
    // If no tokens in hash, check URL query parameters (fallback)
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token') || urlParams.get('access_token')
    const refresh = urlParams.get('refresh_token')
    
    console.log('Query params extracted:', {
      token: token ? `${token.substring(0, 10)}...` : 'missing',
      refresh: refresh ? `${refresh.substring(0, 10)}...` : 'missing'
    })
    
    if (token && refresh) {
      console.log('Found tokens in query params, setting session...')
      
      const { data, error: sessionError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: refresh
      })
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        error.value = `Failed to validate invitation: ${sessionError.message}`
        loading.value = false
        return
      }
      
      console.log('Session established successfully from query params')
      loading.value = false
      return
    }
    
    // If no tokens found, check if user is already authenticated
    const { data: sessionData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('Auth error:', authError)
      error.value = `Authentication error: ${authError.message}`
      loading.value = false
      return
    }

    if (sessionData.session) {
      console.log('Existing session found:', sessionData.session.user.email)
      loading.value = false
      return
    }
    
    // No valid session or tokens found - show debugging info
    console.log('No valid session or tokens found')
    console.log('Final debug - Hash length:', window.location.hash.length)
    console.log('Final debug - Search length:', window.location.search.length)
    
    error.value = `No valid session found. Please click the invitation link from your email.
    
    Debug Info:
    - URL: ${window.location.href}
    - Hash: ${window.location.hash || 'none'}
    - Search: ${window.location.search || 'none'}
    - Tokens in hash: ${access_token ? 'found' : 'missing'}
    - Tokens in query: ${token ? 'found' : 'missing'}`
    
    loading.value = false
    
  } catch (err) {
    console.error('Mounted error:', err)
    error.value = `An unexpected error occurred: ${err.message}`
    loading.value = false
  }
})

const setPassword = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.value
    })

    if (updateError) {
      error.value = updateError.message
      return
    }

    // Get the current user to create/update their profile
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Create or update the user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: user.user_metadata.first_name,
          last_name: user.user_metadata.last_name,
          role: user.user_metadata.role,
          created_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't block the user, just log the error
      }
    }

    // Redirect to appropriate dashboard based on role
    const userRole = user?.user_metadata?.role
    if (userRole === 'staff') {
      router.push('/home')
    } else if (userRole === 'donor') {
      router.push('/home')
    } else {
      router.push('/home')
    }

  } catch (err) {
    console.error('Set password error:', err)
    error.value = 'An unexpected error occurred. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>