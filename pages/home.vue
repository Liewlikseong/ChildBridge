<template>
  <div>
    <!-- Hero Section with Bigger Image -->
    <section class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <div class="absolute top-40 right-20 w-20 h-20 bg-purple-400 rounded-full opacity-10 animate-bounce"></div>
        <div class="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-400 rounded-full opacity-10 animate-ping"></div>
      </div>
      
      <div class="container mx-auto px-4 relative py-16 md:py-24 lg:py-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6 animate-fade-in">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Bridge the Gap to Brighter Futures
            </h1>
            <p class="text-xl text-blue-100 max-w-lg leading-relaxed">
              Connect with children at Jing Sun Welfare Society and make a lasting impact through transparent donations and direct communication.
            </p>
            <div class="flex flex-wrap gap-4 pt-4">
              <a @click="handleProtectedNavigation('/donate')" class="group cursor-pointer">
                <button class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <span class="flex items-center">
                    Donate Now
                    <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                </button>
              </a>
              
              <NuxtLink to="/about">
                <button class="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105">
                  Learn More
                </button>
              </NuxtLink>
            </div>
          </div>
          
          <!-- Enhanced Image Section - Rectangle with Same Height -->
          <div class="relative flex justify-center lg:justify-end">
            <div class="relative bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500 w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
              <img 
                src="https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg" 
                alt="Child smiling" 
                class="w-full h-64 md:h-80 lg:h-96 xl:h-[400px] object-cover rounded-xl shadow-inner" 
              />
              <div class="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300 max-w-[200px] md:max-w-[250px]">
                <p class="text-sm md:text-base font-medium text-white leading-tight">Your donations directly support their future</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Impact Stats - Now Connected to Real Supabase Data -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Our Impact Together</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">See the real difference we're making in the lives of children at Jing Sun Welfare Society.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <!-- Total Donations Card -->
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-500">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div v-if="loading" class="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                <div class="animate-pulse bg-blue-200 rounded h-10 w-24 mx-auto"></div>
              </div>
              <div v-else class="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                RM{{ totalDonations.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
              </div>
              <div class="text-gray-700 font-medium">Total Donations</div>
              <div v-if="!loading" class="text-xs text-gray-500 mt-1">
                From {{ totalMonetaryDonations }} monetary donations
              </div>
            </div>
          </div>
          
          <!-- Total Donors Card -->
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-purple-500">
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div v-if="loading" class="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                <div class="animate-pulse bg-purple-200 rounded h-10 w-20 mx-auto"></div>
              </div>
              <div v-else class="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                {{ uniqueDonors.toLocaleString() }}
              </div>
              <div class="text-gray-700 font-medium">Generous Donors</div>
              <div v-if="!loading" class="text-xs text-gray-500 mt-1">
                {{ totalDonors }} total donations made
              </div>
            </div>
          </div>
          
          <!-- Physical Donations Card -->
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-pink-500">
            <div class="text-center">
              <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-if="loading" class="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
                <div class="animate-pulse bg-pink-200 rounded h-10 w-16 mx-auto"></div>
              </div>
              <div v-else class="text-3xl md:text-4xl font-bold text-pink-600 mb-2">
                {{ totalPhysicalDonations.toLocaleString() }}
              </div>
              <div class="text-gray-700 font-medium">Physical Donations</div>
              <div v-if="!loading && averageDonation > 0" class="text-xs text-gray-500 mt-1">
                Avg. RM{{ averageDonation.toFixed(0) }} per donation
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="text-center mt-8">
          <div class="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <h3 class="text-sm font-medium text-red-800 mb-1">Error Loading Statistics</h3>
            <p class="text-xs text-red-600">{{ error }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- How It Works -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">How ChildBridge Works</h2>
          <p class="text-gray-600 max-w-2xl mx-auto text-lg">Our platform creates meaningful connections between donors and children while ensuring transparency and impact.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div class="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-4 border border-blue-200">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-800">1. Create an Account</h3>
            <p class="text-gray-600 leading-relaxed">Sign up for a free account to access the platform and view children's profiles and updates from Jing Sun Welfare Society.</p>
          </div>
          
          <div class="group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-4 border border-purple-200">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-800">2. Make a Donation</h3>
            <p class="text-gray-600 leading-relaxed">Contribute one-time or recurring donations. Choose specific programs to support education, healthcare, or general needs.</p>
          </div>
          
          <div class="group bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-4 border border-pink-200">
            <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-4 text-gray-800">3. Stay Connected</h3>
            <p class="text-gray-600 leading-relaxed">Receive updates about the impact of your donations, communicate directly with orphanage staff, and build meaningful connections.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Recent Updates -->
    <section class="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Recent Updates</h2>
            <p class="text-gray-600">Stay connected with the latest news from our community</p>
          </div>
          <a @click="handleProtectedNavigation('/updates')" class="group text-blue-600 hover:text-blue-700 font-semibold flex items-center transition-colors duration-300 cursor-pointer">
            View all updates
            <svg class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        <div v-if="updateError" class="text-center py-12">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-gray-600 mb-2">Error Loading Updates</h3>
          <p class="text-gray-500">{{ updateError }}</p>
        </div>
        
        <div v-else-if="loadingUpdates" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div class="bg-gray-300 h-48"></div>
            <div class="p-6">
              <div class="bg-gray-300 h-4 w-1/4 rounded mb-3"></div>
              <div class="bg-gray-300 h-6 w-3/4 rounded mb-2"></div>
              <div class="bg-gray-300 h-4 rounded mb-4"></div>
              <div class="bg-gray-300 h-4 w-1/2 rounded"></div>
            </div>
          </div>
        </div>
        
        <div v-else-if="recentUpdates.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="update in recentUpdates" 
            :key="update.id" 
            class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
          >
            <div class="relative overflow-hidden">
              <img 
                :src="getUpdateImage(update)" 
                :alt="update.title" 
                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div class="p-6">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-gray-500 font-medium">
                  {{ formatDate(update.created_at) }}
                </span>
                <span class="text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 py-1 px-3 rounded-full">
                  {{ update.category || 'General' }}
                </span>
              </div>
              
              <h3 class="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {{ update.title }}
              </h3>
              
              <p class="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                {{ truncateText(update.content, 120) }}
              </p>
              
              <a
                @click="handleProtectedNavigation(`/updates/${update.id}`)"
                class="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 group cursor-pointer"
              >
                Read more
                <svg class="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </article>
        </div>
        
        <div v-else class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path>
          </svg>
          <h3 class="text-lg font-semibold text-gray-600 mb-2">No Updates Yet</h3>
          <p class="text-gray-500">Check back soon for the latest news and updates.</p>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-5"></div>
        <div class="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full opacity-5"></div>
        <div class="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full opacity-10"></div>
      </div>
      
      <div class="container mx-auto px-4 text-center relative">
        <h2 class="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          Ready to Make a Difference?
        </h2>
        <p class="text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-blue-100">
          Join our community of donors and help provide a brighter future for children at Jing Sun Welfare Society.
        </p>
        
        <div class="flex flex-wrap justify-center gap-6">
          <a @click="handleProtectedNavigation('/donate')" class="group cursor-pointer">
            <button class="bg-white text-blue-600 hover:bg-gray-100 font-bold px-10 py-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <span class="flex items-center">
                Donate Now
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
            </button>
          </a>

          <NuxtLink to="/auth/register">
            <button class="border-2 border-white hover:bg-white hover:text-blue-600 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105">
              Create Account
            </button>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Function to handle navigation for protected routes
const handleProtectedNavigation = (path) => {
  if (!user.value) {
    // Redirect to login page if user is not authenticated
    navigateTo('/auth/login');
  } else {
    // User is logged in, navigate normally
    navigateTo(path);
  }
};

// Page meta
definePageMeta({
  layout: 'default'
});

// Reactive data for statistics
const loading = ref(true);
const error = ref(null);
const totalDonations = ref(0);
const totalDonors = ref(0);
const totalPhysicalDonations = ref(0);
const totalMonetaryDonations = ref(0);
const uniqueDonors = ref(0);
const averageDonation = ref(0);

// Reactive data for updates
const loadingUpdates = ref(true);
const recentUpdates = ref([]);
const updateError = ref(null);
const isStaff = ref(false);

// Check if user is staff
const checkUserRole = async () => {
  if (!user.value) return;
  
  try {
    const { data, error: roleError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single();

    if (roleError) throw roleError;
    isStaff.value = data.role === 'staff' || data.role === 'admin';
  } catch (err) {
    console.error('Error checking user role:', err);
  }
};

// Fetch real statistics from Supabase
const fetchRealStats = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Fetch all completed donations
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'completed');

    if (donationsError) throw donationsError;

    if (!donations || donations.length === 0) {
      // No donations yet
      totalDonations.value = 0;
      totalDonors.value = 0;
      totalPhysicalDonations.value = 0;
      totalMonetaryDonations.value = 0;
      uniqueDonors.value = 0;
      averageDonation.value = 0;
      return;
    }

    // Calculate monetary donations total
    const monetaryDonations = donations.filter(d => d.type !== 'physical');
    const monetaryTotal = monetaryDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    
    // Calculate physical donations count
    const physicalDonations = donations.filter(d => d.type === 'physical');
    
    // Count unique donors (using multiple identifiers)
    const donorSet = new Set();
    donations.forEach(donation => {
      if (donation.donor_id) {
        donorSet.add(donation.donor_id);
      } else if (donation.donor_email) {
        donorSet.add(donation.donor_email);
      } else if (donation.donor_name) {
        donorSet.add(donation.donor_name);
      } else {
        donorSet.add(`anonymous_${donation.id}`);
      }
    });

    // Update reactive values
    totalDonations.value = monetaryTotal;
    totalMonetaryDonations.value = monetaryDonations.length;
    totalPhysicalDonations.value = physicalDonations.length;
    totalDonors.value = donations.length; // Total number of donation transactions
    uniqueDonors.value = donorSet.size; // Unique individuals
    
    // Calculate average donation (only for monetary donations)
    if (monetaryDonations.length > 0) {
      averageDonation.value = monetaryTotal / monetaryDonations.length;
    } else {
      averageDonation.value = 0;
    }

    console.log('📊 Statistics calculated:', {
      totalDonations: totalDonations.value,
      totalMonetaryDonations: totalMonetaryDonations.value,
      totalPhysicalDonations: totalPhysicalDonations.value,
      totalDonors: totalDonors.value,
      uniqueDonors: uniqueDonors.value,
      averageDonation: averageDonation.value
    });

  } catch (err) {
    console.error('Error fetching statistics:', err);
    error.value = err.message || 'Failed to load statistics';
    
    // Set fallback values
    totalDonations.value = 0;
    totalDonors.value = 0;
    totalPhysicalDonations.value = 0;
    totalMonetaryDonations.value = 0;
    uniqueDonors.value = 0;
    averageDonation.value = 0;
  } finally {
    loading.value = false;
  }
};

// Fetch recent updates from Supabase
const fetchRecentUpdates = async () => {
  try {
    loadingUpdates.value = true;
    updateError.value = null;

    let query = supabase
      .from('updates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    // If user is not staff, only fetch published updates
    if (!isStaff.value) {
      query = query.eq('published', true);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) throw fetchError;
    recentUpdates.value = data || [];
  } catch (err) {
    updateError.value = err.message;
    console.error('Error fetching recent updates:', err);
    recentUpdates.value = [];
  } finally {
    loadingUpdates.value = false;
  }
};

// Helper methods
const getUpdateImage = (update) => {
  // Check for new media_files format first
  if (update.media_files && Array.isArray(update.media_files) && update.media_files.length > 0) {
    return update.media_files[0].url;
  }
  
  // Fallback to old media_url format
  if (update.media_url) {
    return update.media_url;
  }
  
  // Default fallback image
  return "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg";
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Lifecycle
onMounted(async () => {
  try {
    // Check user role first
    await checkUserRole();
    
    // Fetch both statistics and updates in parallel
    await Promise.all([
      fetchRealStats(),
      fetchRecentUpdates()
    ]);
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced responsive image styles */
@media (max-width: 640px) {
  .container .grid .relative .relative {
    max-width: 300px;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .container .grid .relative .relative {
    max-width: 350px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .container .grid .relative .relative {
    max-width: 400px;
  }
}

@media (min-width: 1025px) {
  .container .grid .relative .relative {
    max-width: 500px;
  }
}
</style>