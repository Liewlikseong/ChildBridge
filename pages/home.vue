<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-primary-900 text-white">
      <!-- Hero background with overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800 opacity-90"></div>
      
      <div class="container-custom relative py-16 md:py-24 lg:py-32">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="animate-slide-up">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">Bridge the Gap to Brighter Futures</h1>
            <p class="text-xl opacity-90 mb-8 max-w-lg">Connect with children at Jing Sun Welfare Society and make a lasting impact through transparent donations and direct communication.</p>
            <div class="flex flex-wrap gap-4">
              <UiButton variant="accent" to="/donate" class="px-6 py-3 transform hover:scale-105">
                Donate Now
              </UiButton>
              <UiButton variant="outline" to="/about" class="px-6 py-3 border-2 border-white text-white hover:bg-white/10">
                Learn More
              </UiButton>
            </div>
          </div>
          
          <div class="relative animate-fade-in">
            <div class="bg-white rounded-xl p-4 shadow-xl transform rotate-2 mb-6 max-w-md mx-auto">
              <img src="" 
                   alt="Child smiling" class="w-full h-auto rounded-lg" />
            </div>
            <div class="absolute -bottom-4 -left-4 bg-accent-500 rounded-lg px-4 py-2 shadow-lg transform -rotate-3">
              <p class="text-sm font-medium">Your donations directly support their education</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Impact Stats -->
    <section class="py-12 bg-white">
      <div class="container-custom">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div class="p-6 bg-primary-50 rounded-lg transition-transform hover:scale-105">
            <div class="text-3xl md:text-4xl font-bold text-primary-600 mb-2">250+</div>
            <div class="text-neutral-700">Children Supported</div>
          </div>
          <div class="p-6 bg-secondary-50 rounded-lg transition-transform hover:scale-105">
            <div class="text-3xl md:text-4xl font-bold text-secondary-600 mb-2">$120K</div>
            <div class="text-neutral-700">Donations Raised</div>
          </div>
          <div class="p-6 bg-accent-50 rounded-lg transition-transform hover:scale-105">
            <div class="text-3xl md:text-4xl font-bold text-accent-600 mb-2">1,500+</div>
            <div class="text-neutral-700">Generous Donors</div>
          </div>
          <div class="p-6 bg-neutral-100 rounded-lg transition-transform hover:scale-105">
            <div class="text-3xl md:text-4xl font-bold text-neutral-700 mb-2">98%</div>
            <div class="text-neutral-700">Funds to Children</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- How It Works -->
    <section class="section bg-neutral-50">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">How ChildBridge Works</h2>
          <p class="text-neutral-600 max-w-2xl mx-auto">Our platform creates meaningful connections between donors and children while ensuring transparency and impact.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">1. Create an Account</h3>
            <p class="text-neutral-600">Sign up for a free account to access the platform and view children's profiles and updates from Jing Sun Welfare Society.</p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">2. Make a Donation</h3>
            <p class="text-neutral-600">Contribute one-time or recurring donations. Choose specific programs to support education, healthcare, or general needs.</p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-accent-100 text-accent-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">3. Stay Connected</h3>
            <p class="text-neutral-600">Receive updates about the impact of your donations, communicate directly with orphanage staff, and build meaningful connections.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Recent Updates -->
    <section class="section bg-white">
      <div class="container-custom">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold">Recent Updates</h2>
          <NuxtLink to="/updates" class="text-primary-600 hover:text-primary-700 font-medium flex items-center">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="card hover:shadow-lg transition-shadow">
            <div class="aspect-w-16 aspect-h-9 overflow-hidden">
              <img :src="`=${i}`" 
                   :alt="`Update ${i}`" class="w-full h-full object-cover" />
            </div>
            <div class="p-6">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-neutral-500">April {{ 5 + i }}, 2025</span>
                <span class="text-xs font-medium bg-primary-100 text-primary-800 py-1 px-2 rounded-full">Education</span>
              </div>
              <h3 class="text-xl font-semibold mb-2">New Learning Materials Arrived!</h3>
              <p class="text-neutral-600 mb-4">Thanks to generous donations, we received new textbooks and learning materials for our elementary education program.</p>
              <NuxtLink to="/updates/1" class="text-primary-600 hover:text-primary-700 font-medium">Read more</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials -->
    <section class="section bg-primary-900 text-white">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">What Our Donors Say</h2>
          <p class="text-primary-100 max-w-2xl mx-auto">Hear from our community of supporters about their experience with ChildBridge.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="bg-primary-800 p-6 rounded-lg">
            <div class="flex mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
              </svg>
            </div>
            <p class="mb-4 italic">"ChildBridge has transformed how I give. The transparency and direct connection with the orphanage makes me confident my donations are making a real difference."</p>
            <div class="flex items-center">
              <div class="w-10 h-10 bg-primary-700 rounded-full overflow-hidden mr-3">
                <img :src="`=${10 + i}`" alt="Donor" class="w-full h-full object-cover" />
              </div>
              <div>
                <div class="font-medium">{{ ['Sarah J.', 'Michael T.', 'Emma K.'][i-1] }}</div>
                <div class="text-sm text-primary-300">Monthly Donor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="section bg-accent-500 text-white">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">Join our community of donors and help provide a brighter future for children at Jing Sun Welfare Society.</p>
        <div class="flex flex-wrap justify-center gap-4">
          <!-- Primary Button (with NuxtLink) -->
          <NuxtLink to="/donate">
            <UiButton variant="primary" class="bg-white text-accent-600 hover:bg-neutral-100 px-8 py-3 transform hover:scale-105">
              Donate Now
            </UiButton>
          </NuxtLink>

          <!-- Outline Button (with NuxtLink) -->
          <NuxtLink to="/auth/register">
            <UiButton variant="outline" class="border-2 border-white hover:bg-white/10 text-white px-8 py-3">
              Create Account
            </UiButton>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
});
</script>