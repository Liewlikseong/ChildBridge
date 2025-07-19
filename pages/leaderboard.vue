<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent mb-4">
        🏆 Donor Leaderboard
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Celebrating our generous supporters who make our mission possible
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-yellow-600 text-sm font-medium">Total Donors</p>
            <p class="text-3xl font-bold text-yellow-900">{{ leaderboardStats.totalDonors }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-600 text-sm font-medium">Total Raised</p>
            <p class="text-3xl font-bold text-green-900">RM{{ leaderboardStats.totalAmount.toFixed(2) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-600 text-sm font-medium">Avg. Donation</p>
            <p class="text-3xl font-bold text-purple-900">RM{{ leaderboardStats.averageDonation.toFixed(2) }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center space-x-4">
          <h3 class="text-lg font-semibold text-gray-900">Filter Options</h3>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Time Period:</label>
            <select 
              v-model="selectedPeriod" 
              class="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Show:</label>
            <select 
              v-model="selectedType" 
              class="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Donations</option>
              <option value="monetary">Monetary Only</option>
              <option value="physical">Physical Only</option>
            </select>
          </div>
        </div>
        
        <div class="text-sm text-gray-600">
          Showing top {{ Math.min(displayLimit, filteredLeaderboard.length) }} of {{ filteredLeaderboard.length }} donors
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading leaderboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6">
      <div class="flex items-center">
        <svg class="h-6 w-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 class="text-lg font-medium text-red-800">Error loading leaderboard</h3>
          <p class="text-red-700">{{ error.message || 'Please try again later.' }}</p>
        </div>
      </div>
    </div>

    <!-- Top 3 Podium -->
    <div v-else-if="topThree.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">🥇 Top Contributors</h2>
      
      <div class="flex justify-center items-end space-x-4 md:space-x-8 mb-8">
        <!-- Second Place -->
        <div v-if="topThree[1]" class="text-center">
          <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 border-2 border-gray-300 shadow-lg transform hover:scale-105 transition-transform duration-200 w-32 md:w-40">
            <div class="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl md:text-2xl font-bold shadow-lg">
              {{ getDisplayInitials(topThree[1]) }}
            </div>
            <div class="text-2xl mb-2">🥈</div>
            <h3 class="font-bold text-gray-900 text-sm md:text-base truncate" :title="getDisplayName(topThree[1])">
              {{ getDisplayName(topThree[1]) }}
            </h3>
            <p class="text-xs md:text-sm text-gray-600 mt-1">
              {{ topThree[1].donation_count }} donation{{ topThree[1].donation_count !== 1 ? 's' : '' }}
            </p>
            <p class="font-bold text-gray-800 text-sm md:text-lg mt-2">
              RM{{ topThree[1].total_amount.toFixed(2) }}
            </p>
          </div>
        </div>

        <!-- First Place -->
        <div v-if="topThree[0]" class="text-center">
          <div class="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-6 border-2 border-yellow-400 shadow-xl transform hover:scale-105 transition-transform duration-200 w-36 md:w-44 relative">
            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div class="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                👑 CHAMPION
              </div>
            </div>
            <div class="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl md:text-3xl font-bold shadow-lg">
              {{ getDisplayInitials(topThree[0]) }}
            </div>
            <div class="text-3xl mb-2">🥇</div>
            <h3 class="font-bold text-gray-900 text-base md:text-lg truncate" :title="getDisplayName(topThree[0])">
              {{ getDisplayName(topThree[0]) }}
            </h3>
            <p class="text-sm md:text-base text-gray-600 mt-1">
              {{ topThree[0].donation_count }} donation{{ topThree[0].donation_count !== 1 ? 's' : '' }}
            </p>
            <p class="font-bold text-gray-900 text-lg md:text-xl mt-2">
              RM{{ topThree[0].total_amount.toFixed(2) }}
            </p>
          </div>
        </div>

        <!-- Third Place -->
        <div v-if="topThree[2]" class="text-center">
          <div class="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-6 border-2 border-orange-300 shadow-lg transform hover:scale-105 transition-transform duration-200 w-32 md:w-40">
            <div class="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl md:text-2xl font-bold shadow-lg">
              {{ getDisplayInitials(topThree[2]) }}
            </div>
            <div class="text-2xl mb-2">🥉</div>
            <h3 class="font-bold text-gray-900 text-sm md:text-base truncate" :title="getDisplayName(topThree[2])">
              {{ getDisplayName(topThree[2]) }}
            </h3>
            <p class="text-xs md:text-sm text-gray-600 mt-1">
              {{ topThree[2].donation_count }} donation{{ topThree[2].donation_count !== 1 ? 's' : '' }}
            </p>
            <p class="font-bold text-gray-800 text-sm md:text-lg mt-2">
              RM{{ topThree[2].total_amount.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Leaderboard Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Complete Leaderboard</h3>
      </div>

      <div v-if="displayedLeaderboard.length === 0" class="p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
        <p class="text-gray-500">No donations match the selected criteria.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donations</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Donation</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(donor, index) in displayedLeaderboard" :key="donor.donor_key" 
                class="hover:bg-gray-50 transition-colors duration-150"
                :class="{ 'bg-yellow-50': index < 3 }">
              
              <!-- Rank Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span v-if="index === 0" class="text-2xl mr-2">🥇</span>
                  <span v-else-if="index === 1" class="text-2xl mr-2">🥈</span>
                  <span v-else-if="index === 2" class="text-2xl mr-2">🥉</span>
                  <span v-else class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-2">
                    {{ index + 1 }}
                  </span>
                </div>
              </td>

              <!-- Donor Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                         :class="getAvatarColor(index)">
                      {{ getDisplayInitials(donor) }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ getDisplayName(donor) }}
                    </div>
                    <div v-if="canViewFullDetails && donor.donor_email" class="text-sm text-gray-500">
                      {{ donor.donor_email }}
                    </div>
                    <div v-if="donor.has_physical" class="text-xs text-purple-600 font-medium mt-1">
                      📦 Includes physical donations
                    </div>
                  </div>
                </div>
              </td>

              <!-- Total Amount Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-gray-900">
                  RM{{ donor.total_amount.toFixed(2) }}
                </div>
                <div v-if="donor.monetary_amount !== donor.total_amount" class="text-xs text-gray-500">
                  RM{{ donor.monetary_amount.toFixed(2) }} monetary
                </div>
              </td>

              <!-- Donations Count Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ donor.donation_count }} donation{{ donor.donation_count !== 1 ? 's' : '' }}
                </div>
                <div v-if="donor.physical_count > 0" class="text-xs text-purple-600">
                  {{ donor.physical_count }} physical
                </div>
              </td>

              <!-- Average Donation Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  RM{{ (donor.monetary_amount / Math.max(donor.donation_count - donor.physical_count, 1)).toFixed(2) }}
                </div>
                <div class="text-xs text-gray-500">per monetary donation</div>
              </td>

              <!-- Latest Donation Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(donor.latest_donation) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ getTimeAgo(donor.latest_donation) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Show More Button -->
      <div v-if="filteredLeaderboard.length > displayLimit" class="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
        <button 
          @click="displayLimit += 20"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
          Show More ({{ filteredLeaderboard.length - displayLimit }} remaining)
        </button>
      </div>
    </div>

    <!-- Privacy Notice -->
    <div class="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div class="flex items-start">
        <svg class="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="text-sm text-blue-700">
          <p class="font-medium mb-1">Privacy Notice</p>
          <p>
            {{ canViewFullDetails 
              ? 'As a staff/admin member, you can view full donor details. Regular users see abbreviated names for privacy protection.' 
              : 'Donor names are abbreviated to protect privacy. Only titles and first names are displayed publicly.' 
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

definePageMeta({
  middleware: ['auth']
});

// Reactive data
const selectedPeriod = ref('all');
const selectedType = ref('all');
const displayLimit = ref(20);
const leaderboardData = ref(null);
const pending = ref(false);
const error = ref(null);

// Get user directly from Supabase
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const userRole = ref('user');

// Get user role directly
const getUserRole = async () => {
  if (!user.value) {
    userRole.value = 'user';
    return;
  }
  
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single();
    
    userRole.value = profile?.role || 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    userRole.value = 'user';
  }
};

// Fetch leaderboard data directly
const fetchLeaderboard = async () => {
  pending.value = true;
  error.value = null;
  
  try {
    console.log('🔍 Starting leaderboard fetch...');
    
    // Get donations and profiles separately to avoid relationship conflicts
    const { data: allDonations, error: fetchError } = await supabase
      .from('donations')
      .select('*');

    console.log('📊 Raw donations from database:', allDonations?.length || 0);
    console.log('🚨 Fetch error:', fetchError);
    
    if (fetchError) {
      throw fetchError;
    }

    if (!allDonations || allDonations.length === 0) {
      console.log('❌ No donations found in database');
      leaderboardData.value = { leaderboard: [], stats: { totalDonors: 0, totalAmount: 0, averageDonation: 0 } };
      return;
    }

    // Get unique donor IDs for profile lookup
    const donorIds = [...new Set(allDonations.filter(d => d.donor_id).map(d => d.donor_id))];
    console.log('👥 Unique donor IDs:', donorIds.length);
    
    // Fetch profiles for registered donors
    let profiles = [];
    if (donorIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', donorIds);
      profiles = profilesData || [];
      console.log('📇 Profiles fetched:', profiles.length);
    }

    // Create profiles lookup map
    const profilesMap = new Map();
    profiles.forEach(profile => {
      profilesMap.set(profile.id, profile);
    });

    // Attach profile data to donations
    const donationsWithProfiles = allDonations.map(donation => ({
      ...donation,
      profiles: donation.donor_id ? profilesMap.get(donation.donor_id) : null
    }));

    // Log sample donation structure
    console.log('📝 Sample donation:', donationsWithProfiles[0]);
    console.log('📊 Donation statuses:', [...new Set(donationsWithProfiles.map(d => d.status))]);
    console.log('📊 Donation types:', [...new Set(donationsWithProfiles.map(d => d.type))]);

    // Filter for completed donations only (TEMPORARILY REMOVE THIS TO TEST)
    let donations = donationsWithProfiles.filter(d => d.status === 'completed');
    console.log('✅ Completed donations:', donations.length);

    // TEMPORARY: If no completed donations, try with all statuses
    if (donations.length === 0) {
      console.log('⚠️ No completed donations, trying all statuses...');
      donations = donationsWithProfiles;
      console.log('📊 All donations regardless of status:', donations.length);
    }

    // Apply time period filter
    if (selectedPeriod.value !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (selectedPeriod.value) {
        case 'month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          cutoffDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'year':
          cutoffDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      donations = donations.filter(d => new Date(d.created_at) >= cutoffDate);
      console.log(`📅 After ${selectedPeriod.value} filter:`, donations.length);
    }

    // Apply type filter
    if (selectedType.value !== 'all') {
      if (selectedType.value === 'monetary') {
        donations = donations.filter(d => d.type !== 'physical');
      } else if (selectedType.value === 'physical') {
        donations = donations.filter(d => d.type === 'physical');
      }
      console.log(`🏷️ After ${selectedType.value} filter:`, donations.length);
    }

    if (donations.length === 0) {
      console.log('❌ No donations left after filtering');
      leaderboardData.value = { leaderboard: [], stats: { totalDonors: 0, totalAmount: 0, averageDonation: 0 } };
      return;
    }

    // Group by donor - Fixed to properly combine all donations per donor
    const donorMap = new Map();
    
    donations.forEach(donation => {
      // Create a consistent donor key
      let donorKey;
      let donorName;
      let donorEmail;
      
      if (donation.donor_id && donation.profiles) {
        // Registered user with profile
        donorKey = donation.donor_id.toString();
        donorName = `${donation.profiles.first_name || ''} ${donation.profiles.last_name || ''}`.trim() || 'Anonymous Donor';
        donorEmail = donation.profiles.email;
      } else if (donation.donor_email) {
        // Guest donor with email
        donorKey = donation.donor_email;
        donorName = donation.donor_name || 'Anonymous Donor';
        donorEmail = donation.donor_email;
      } else if (donation.donor_name) {
        // Guest donor with name only
        donorKey = donation.donor_name;
        donorName = donation.donor_name;
        donorEmail = null;
      } else {
        // Completely anonymous
        donorKey = `anonymous_${donation.id}`;
        donorName = 'Anonymous Donor';
        donorEmail = null;
      }
      
      // Get or create donor entry
      if (!donorMap.has(donorKey)) {
        donorMap.set(donorKey, {
          donor_key: donorKey,
          donor_name: donorName,
          donor_email: donorEmail,
          total_amount: 0,
          monetary_amount: 0,
          donation_count: 0,
          physical_count: 0,
          has_physical: false,
          latest_donation: donation.created_at
        });
      }
      
      const donorData = donorMap.get(donorKey);
      
      // Increment donation count
      donorData.donation_count++;
      
      // Handle different donation types
      if (donation.type === 'physical') {
        donorData.physical_count++;
        donorData.has_physical = true;
        // Physical donations don't add to monetary amount
      } else {
        // Monetary donations (onetime, subscription, etc.)
        donorData.monetary_amount += donation.amount || 0;
      }
      
      // Total amount is same as monetary amount (physical donations are separate)
      donorData.total_amount = donorData.monetary_amount;
      
      // Update latest donation date
      if (new Date(donation.created_at) > new Date(donorData.latest_donation)) {
        donorData.latest_donation = donation.created_at;
      }
    });

    console.log('👥 Unique donors found:', donorMap.size);
    console.log('🔍 Donor map sample:', Array.from(donorMap.entries()).slice(0, 3));

    // Convert to array and add abbreviated names
    const leaderboard = Array.from(donorMap.values())
      .filter(donor => donor.total_amount > 0 || donor.physical_count > 0)
      .map(donor => ({
        ...donor,
        abbreviated_name: donor.donor_name === 'Anonymous Donor' ? 
          'Anonymous Donor' : 
          `Mr/Ms ${donor.donor_name.split(' ')[0]}`
      }))
      .sort((a, b) => {
        if (b.total_amount !== a.total_amount) return b.total_amount - a.total_amount;
        if (b.donation_count !== a.donation_count) return b.donation_count - a.donation_count;
        return new Date(b.latest_donation) - new Date(a.latest_donation);
      });

    console.log('🏆 Final leaderboard entries:', leaderboard.length);
    console.log('📊 Top donor:', leaderboard[0]);

    // Calculate stats
    const stats = {
      totalDonors: leaderboard.length,
      totalAmount: leaderboard.reduce((sum, donor) => sum + donor.total_amount, 0),
      averageDonation: 0
    };

    if (stats.totalDonors > 0) {
      const totalDonations = leaderboard.reduce((sum, donor) => sum + donor.donation_count, 0);
      stats.averageDonation = stats.totalAmount / totalDonations;
    }

    console.log('📈 Final stats:', stats);

    leaderboardData.value = {
      leaderboard,
      stats
    };

  } catch (err) {
    console.error('💥 Error fetching leaderboard:', err);
    error.value = err;
    leaderboardData.value = { leaderboard: [], stats: { totalDonors: 0, totalAmount: 0, averageDonation: 0 } };
  } finally {
    pending.value = false;
  }
};

// Computed properties
const canViewFullDetails = computed(() => {
  return userRole.value === 'staff' || userRole.value === 'admin' || userRole.value === 'head_admin';
});

const filteredLeaderboard = computed(() => {
  if (!leaderboardData.value?.leaderboard) return [];
  return leaderboardData.value.leaderboard;
});

const displayedLeaderboard = computed(() => {
  return filteredLeaderboard.value.slice(0, displayLimit.value);
});

const topThree = computed(() => {
  return filteredLeaderboard.value.slice(0, 3);
});

const leaderboardStats = computed(() => {
  if (!leaderboardData.value?.stats) {
    return {
      totalDonors: 0,
      totalAmount: 0,
      averageDonation: 0
    };
  }
  return leaderboardData.value.stats;
});

// Helper functions
const getDisplayName = (donor) => {
  if (canViewFullDetails.value) {
    // Staff/Admin can see full names
    return donor.donor_name || 'Anonymous Donor';
  } else {
    // Regular users see abbreviated names
    return donor.abbreviated_name || donor.donor_name || 'Anonymous Donor';
  }
};

const getDisplayInitials = (donor) => {
  const displayName = getDisplayName(donor);
  if (displayName === 'Anonymous Donor') return 'AD';
  
  // Handle Mr/Ms prefix for abbreviated names
  if (displayName.startsWith('Mr/Ms ')) {
    const nameWithoutPrefix = displayName.replace('Mr/Ms ', '');
    return nameWithoutPrefix.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
  
  return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getAvatarColor = (index) => {
  const colors = [
    'bg-gradient-to-br from-blue-400 to-blue-500',
    'bg-gradient-to-br from-green-400 to-green-500',
    'bg-gradient-to-br from-purple-400 to-purple-500',
    'bg-gradient-to-br from-red-400 to-red-500',
    'bg-gradient-to-br from-yellow-400 to-yellow-500',
    'bg-gradient-to-br from-indigo-400 to-indigo-500',
    'bg-gradient-to-br from-pink-400 to-pink-500',
    'bg-gradient-to-br from-gray-400 to-gray-500'
  ];
  return colors[index % colors.length];
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

// Watch for changes
watch(user, async () => {
  await getUserRole();
}, { immediate: true });

watch([selectedPeriod, selectedType], () => {
  displayLimit.value = 20;
  fetchLeaderboard();
});

// Initialize
onMounted(async () => {
  await getUserRole();
  await fetchLeaderboard();
});
</script>