<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary-900 text-white py-16 md:py-24">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">About ChildBridge</h1>
          <p class="text-xl text-primary-100">Connecting compassionate donors with children at Jing Sun Welfare Society through transparency and direct engagement.</p>
        </div>
      </div>
    </section>
    
    <!-- Mission -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold mb-6">Our Mission</h2>
            <p class="text-lg text-neutral-700 mb-6">ChildBridge exists to create meaningful connections between donors and children at the Jing Sun Welfare Society orphanage. We believe in the power of transparency, direct communication, and sustainable support.</p>
            <p class="text-lg text-neutral-700 mb-6">Our platform enables donors to see exactly how their contributions make a difference, communicate directly with orphanage staff, and build lasting relationships that transform lives.</p>
            <div class="flex items-center space-x-3">
              <div class="h-1 w-12 bg-primary-500"></div>
              <p class="text-primary-600 font-medium">Making a difference since 2020</p>
            </div>
          </div>
          <div class="relative">
            <img src="https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                 alt="Children smiling" class="rounded-lg shadow-xl w-full h-auto" />
            <div class="absolute -bottom-6 -right-6 bg-accent-500 text-white p-6 rounded-lg shadow-lg max-w-xs">
              <p class="font-medium">&quot;Every child deserves love, education, and opportunity.&quot;</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Our Story -->
    <section class="py-16 bg-neutral-50">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div class="space-y-6 text-neutral-700">
            <p>ChildBridge was founded in 2020 by a group of technologists and child welfare advocates who saw a disconnect between donors and the children they wanted to help. Traditional donation platforms lacked transparency and personal connection, leaving donors wondering about the real impact of their generosity.</p>
            <p>After visiting the Jing Sun Welfare Society orphanage and witnessing the incredible work being done, our founders were inspired to create a platform that would bridge this gap. They envisioned a space where donors could see updates from the children they support, communicate with staff, and know exactly how their donations are used.</p>
            <p>With the support of technology partners and child welfare experts, ChildBridge was born. Today, we have connected over 1,500 donors with the orphanage, raising more than $120,000 to support education, healthcare, nutrition, and infrastructure improvements.</p>
            <p>Our journey is just beginning. With your support, we aim to expand our model to other orphanages, creating a global network of connected, transparent, and impactful giving.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Values -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <h2 class="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="p-6 bg-primary-50 rounded-lg text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Transparency</h3>
            <p class="text-neutral-600">We believe donors deserve to know exactly how their contributions are used and the impact they make.</p>
          </div>
          
          <div class="p-6 bg-secondary-50 rounded-lg text-center">
            <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Connection</h3>
            <p class="text-neutral-600">Meaningful relationships between donors and children create lasting positive impact for everyone involved.</p>
          </div>
          
          <div class="p-6 bg-accent-50 rounded-lg text-center">
            <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Empowerment</h3>
            <p class="text-neutral-600">We empower both donors to give with confidence and children to develop the skills they need for bright futures.</p>
          </div>
          
          <div class="p-6 bg-neutral-100 rounded-lg text-center">
            <div class="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Community</h3>
            <p class="text-neutral-600">We foster a global community of donors, staff, and children who support and learn from each other.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Team -->
    <section class="py-16 bg-neutral-50">
      <div class="container-custom">
        <h2 class="text-3xl font-bold mb-12 text-center">Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(person, index) in team" :key="index" class="bg-white rounded-lg shadow-md overflow-hidden">
            <img :src="`https://i.pravatar.cc/300?img=${index+10}`" :alt="person.name" class="w-full h-64 object-cover" />
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-1">{{ person.name }}</h3>
              <p class="text-primary-600 mb-3">{{ person.role }}</p>
              <p class="text-neutral-600 mb-4">{{ person.bio }}</p>
              <div class="flex space-x-3">
                <a href="#" class="text-neutral-400 hover:text-neutral-700">
                  <span class="sr-only">LinkedIn</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </a>
                <a href="#" class="text-neutral-400 hover:text-neutral-700">
                  <span class="sr-only">Twitter</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="py-16 bg-primary-900 text-white">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">Be part of our community and help create brighter futures for children at Jing Sun Welfare Society.</p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/donate" class="btn bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105">
            Donate Now
          </NuxtLink>
          <NuxtLink to="/contact" class="btn bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-lg transition-all">
            Contact Us
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

const team = [
  {
    name: 'Jessica Wang',
    role: 'Founder & Executive Director',
    bio: 'Jessica has over 15 years of experience in nonprofit management and international child welfare. She founded ChildBridge to create meaningful connections between donors and children.'
  },
  {
    name: 'David Chen',
    role: 'Technology Director',
    bio: 'With a background in software engineering and UX design, David leads our technology team to create a seamless and secure donation platform focused on transparency.'
  },
  {
    name: 'Sophia Martinez',
    role: 'Partnerships Manager',
    bio: 'Sophia builds and maintains relationships with Jing Sun Welfare Society and other organizations, ensuring that donor funds are used effectively and transparently.'
  },
  {
    name: 'Michael Johnson',
    role: 'Communications Director',
    bio: 'Michael oversees all external communications, helping to share the stories of the children we support and the impact of our donors\' generosity.'
  },
  {
    name: 'Grace Liu',
    role: 'Finance Manager',
    bio: 'Grace ensures the financial integrity of ChildBridge, managing donation processing, fiscal reporting, and maintaining our commitment to transparency.'
  },
  {
    name: 'Robert Kim',
    role: 'Volunteer Coordinator',
    bio: 'Robert manages our global volunteer network, coordinating remote and in-person opportunities to support the children at Jing Sun Welfare Society.'
  }
];
</script>