<template>
  <div>
    <!-- Enhanced Hero Section with Gradient and Animation -->
    <section class="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-20 md:py-32 overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <div class="absolute top-40 right-20 w-20 h-20 bg-purple-400 rounded-full opacity-10 animate-bounce"></div>
        <div class="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-400 rounded-full opacity-10 animate-ping"></div>
        <div class="absolute top-1/2 right-1/3 w-24 h-24 bg-indigo-400 rounded-full opacity-5 animate-pulse delay-1000"></div>
      </div>
      
      <div class="container mx-auto px-4 relative">
        <div class="max-w-4xl mx-auto text-center">
          <div class="animate-fade-in-up">
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              About ChildBridge
            </h1>
            <p class="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Connecting compassionate donors with children at Jing Sun Welfare Society through 
              <span class="text-yellow-300 font-semibold">transparency</span> and 
              <span class="text-pink-300 font-semibold">direct engagement</span>.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Decorative wave -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" class="w-full h-12 md:h-20 text-white">
          <path d="M0,120 L1200,120 L1200,60 C1000,20 800,80 600,60 C400,40 200,80 0,40 Z" fill="currentColor"/>
        </svg>
      </div>
    </section>
    
    <!-- Enhanced Mission Section -->
    <section class="py-20 bg-white relative">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <div>
              <div class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                🎯 Our Mission
              </div>
              <h2 class="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
                Creating Meaningful
                <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Connections</span>
              </h2>
            </div>
            
            <div class="space-y-6">
              <p class="text-lg text-gray-700 leading-relaxed">
                ChildBridge exists to create meaningful connections between donors and children at the Jing Sun Welfare Society orphanage. We believe in the power of transparency, direct communication, and sustainable support.
              </p>
              <p class="text-lg text-gray-700 leading-relaxed">
                Our platform enables donors to see exactly how their contributions make a difference, communicate directly with orphanage staff, and build lasting relationships that transform lives.
              </p>
            </div>
            
            <div class="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <p class="text-blue-700 font-semibold text-lg">Making a difference since 2025</p>
                <p class="text-blue-600">Transforming lives through transparency and connection</p>
              </div>
            </div>
          </div>
          
          <div class="relative group">
            <div class="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            <div class="relative">
              <img 
                src="https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Children smiling" 
                class="rounded-2xl shadow-2xl w-full h-auto transform group-hover:scale-105 transition-transform duration-500" 
              />
              <div class="absolute -bottom-8 -right-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl max-w-sm transform rotate-2 group-hover:rotate-0 transition-transform duration-300">
                <div class="flex items-start space-x-3">
                  <svg class="w-8 h-8 text-pink-200 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path>
                  </svg>
                  <div>
                    <p class="font-semibold text-lg">&quot;Every child deserves love, education, and opportunity.&quot;</p>
                    <p class="text-pink-200 text-sm mt-2">- Our founding principle</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Enhanced Story Section -->
    <section class="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
        <div class="absolute bottom-20 right-20 w-80 h-80 bg-purple-200 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div class="container mx-auto px-4 relative">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <div class="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-6">
              📖 Our Journey
            </div>
            <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Story</h2>
            <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
          
          <div class="space-y-8">
            <div class="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-3 text-gray-900">The Beginning (2025)</h3>
                  <p class="text-gray-700 leading-relaxed">
                    ChildBridge was founded in 2025 by a group of technologists and child welfare advocates who saw a disconnect between donors and the children they wanted to help. Traditional donation platforms lacked transparency and personal connection, leaving donors wondering about the real impact of their generosity.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-3 text-gray-900">The Inspiration</h3>
                  <p class="text-gray-700 leading-relaxed">
                    After visiting the Jing Sun Welfare Society orphanage and witnessing the incredible work being done, our founders were inspired to create a platform that would bridge this gap. They envisioned a space where donors could see updates from the children they support, communicate with staff, and know exactly how their donations are used.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-3 text-gray-900">The Impact</h3>
                  <p class="text-gray-700 leading-relaxed">
                    With the support of technology partners and child welfare experts, ChildBridge was born. Today, we have connected over 1,500 donors with the orphanage, raising more than $120,000 to support education, healthcare, nutrition, and infrastructure improvements.
                  </p>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-8 md:p-10 rounded-3xl shadow-xl text-white">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-3">The Future</h3>
                  <p class="text-blue-100 leading-relaxed">
                    Our journey is just beginning. With your support, we aim to expand our model to other orphanages, creating a global network of connected, transparent, and impactful giving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Enhanced Values Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <div class="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-6">
            💎 What Drives Us
          </div>
          <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Core Values</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">These principles guide everything we do and shape how we build connections between donors and children.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-900">Transparency</h3>
            <p class="text-gray-600 leading-relaxed">We believe donors deserve to know exactly how their contributions are used and the impact they make.</p>
          </div>
          
          <div class="group p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200">
            <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-900">Connection</h3>
            <p class="text-gray-600 leading-relaxed">Meaningful relationships between donors and children create lasting positive impact for everyone involved.</p>
          </div>
          
          <div class="group p-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-pink-200">
            <div class="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-900">Empowerment</h3>
            <p class="text-gray-600 leading-relaxed">We empower both donors to give with confidence and children to develop the skills they need for bright futures.</p>
          </div>
          
          <div class="group p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-200">
            <div class="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-900">Community</h3>
            <p class="text-gray-600 leading-relaxed">We foster a global community of donors, staff, and children who support and learn from each other.</p>
          </div>
        </div>
      </div>
    </section>
    

    
    <!-- Enhanced CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
      <!-- Animated background -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-5 animate-pulse"></div>
        <div class="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full opacity-5 animate-bounce"></div>
        <div class="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full opacity-10 animate-ping"></div>
      </div>
      
      <div class="container mx-auto px-4 text-center relative">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Join Our Mission
          </h2>
          <p class="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
            Be part of our community and help create brighter futures for children at Jing Sun Welfare Society.
          </p>
          
          <div class="flex flex-col sm:flex-row justify-center gap-6">
            <NuxtLink to="/donate" class="group">
              <button class="bg-white text-blue-600 hover:bg-gray-100 font-bold px-10 py-4 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl text-lg">
                <span class="flex items-center justify-center">
                  <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  Donate Now
                  <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </span>
              </button>
            </NuxtLink>
            
            <NuxtLink to="/messages">
              <button class="border-2 border-white hover:bg-white/10 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg">
                Contact Us
              </button>
            </NuxtLink>
          </div>
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