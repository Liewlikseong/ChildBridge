<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-20 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div class="container-custom relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Secure Payment
          </div>
          <h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {{ eventData?.title || 'Complete Payment' }}
          </h1>
          <p class="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Complete your {{ paymentType }} securely with our encrypted payment system.
          </p>
        </div>
      </div>
    </section>

    <!-- Payment Form Section -->
    <section class="py-20 relative">
      <div class="container-custom">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Products/Items Section -->
            <div class="lg:col-span-2 space-y-8">
              
              <!-- Products for Selling Events -->
              <div v-if="eventData?.event_type === 'selling' && products.length > 0" 
                   class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 transform hover:scale-[1.01] transition-all duration-300">
                <div class="flex items-center mb-8">
                  <div class="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                  </div>
                  <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Available Products</h2>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    v-for="product in products" 
                    :key="product.id" 
                    class="group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 transform hover:scale-105"
                  >
                    <div class="relative overflow-hidden">
                      <img 
                        :src="product.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'"
                        :alt="product.name"
                        class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div class="p-6">
                      <h3 class="font-bold text-xl mb-3 text-gray-800 group-hover:text-purple-600 transition-colors">{{ product.name }}</h3>
                      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
                      <div class="flex justify-between items-center mb-4">
                        <span class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          RM{{ product.price.toFixed(2) }}
                        </span>
                        <button
                          @click="addToCart(product)"
                          :disabled="!product.available"
                          class="group/btn relative px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-md hover:shadow-lg disabled:shadow-none text-sm"
                        >
                          <span class="relative z-10 flex items-center">
                            <svg class="w-4 h-4 mr-1.5 group-hover/btn:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            Add
                          </span>
                        </button>
                      </div>
                      <p v-if="product.stock_quantity" class="text-sm text-gray-500 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-2 1m2-1l-2-1m2 1H4"/>
                        </svg>
                        {{ product.stock_quantity }} in stock
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Donation Section -->
              <div v-if="isDonationEvent" 
                   class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-xl border border-emerald-200 p-8 transform hover:scale-[1.01] transition-all duration-300">
                <div class="flex items-center mb-6">
                  <div class="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">Make a Donation</h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-emerald-700 mb-3">
                      Donation Amount (RM)
                    </label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 font-bold">RM</span>
                      <input
                        v-model="donationAmount"
                        type="number"
                        min="1"
                        step="0.01"
                        class="w-full pl-12 pr-4 py-4 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-lg font-semibold bg-white/80 backdrop-blur-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div class="flex items-end">
                    <button
                      @click="addDonationToCart"
                      :disabled="!donationAmount || parseFloat(donationAmount) <= 0"
                      class="w-full h-14 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 font-semibold transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none"
                    >
                      <span class="flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Add
                      </span>
                    </button>
                  </div>
                </div>
                
                <!-- Donation Message -->
                <div>
                  <label class="block text-sm font-semibold text-emerald-700 mb-3">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    v-model="donationMessage"
                    rows="4"
                    class="w-full px-4 py-4 border-2 border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none"
                    placeholder="Leave a heartfelt message with your donation..."
                  ></textarea>
                </div>
              </div>

              <!-- Event Details -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 transform hover:scale-[1.01] transition-all duration-300">
                <div class="flex items-center mb-6">
                  <div class="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Event Details</h3>
                </div>
                
                <!-- Date Card - Full Width -->
                <div class="mb-6">
                  <div class="flex items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div class="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4 shadow-lg">
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">Event Date</p>
                      <p class="text-xl font-bold text-gray-800">{{ formatEventDate() }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Location and Type Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-if="eventData?.location" class="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div class="p-2 bg-green-500 rounded-lg mr-3">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-green-600 uppercase tracking-wide">Location</p>
                      <p class="font-semibold text-gray-800">{{ eventData.location }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div class="p-2 bg-purple-500 rounded-lg mr-3">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-purple-600 uppercase tracking-wide">Type</p>
                      <p class="font-semibold text-gray-800 capitalize">{{ eventData?.event_type || paymentType }} Event</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cart & Checkout Section -->
            <div class="lg:col-span-1">
              <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 sticky top-8 transform hover:scale-[1.01] transition-all duration-300">
                <div class="flex items-center mb-8">
                  <div class="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h1M7 13v6a1 1 0 001 1h1m-2-6h10v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6z"/>
                    </svg>
                  </div>
                  <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Your Order</h2>
                </div>

                <!-- Cart Items -->
                <div v-if="cart.length === 0" class="text-center py-12">
                  <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h1M7 13v6a1 1 0 001 1h1m-2-6h10v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6z"/>
                    </svg>
                  </div>
                  <p class="text-gray-500 font-medium">Your cart is empty</p>
                  <p class="text-sm text-gray-400 mt-2">
                    {{ eventData?.event_type === 'selling' ? 'Add products to get started' : 'Add a donation to continue' }}
                  </p>
                </div>

                <div v-else class="space-y-6 mb-8">
                  <div 
                    v-for="item in cart" 
                    :key="item.id" 
                    class="group bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h4 class="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{{ item.productName }}</h4>
                        <p class="text-sm text-gray-600 mt-1">{{ item.productDescription }}</p>
                        
                        <!-- Donation Amount Input -->
                        <div v-if="item.isDonation" class="mt-3">
                          <div class="relative">
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 font-bold text-sm">RM</span>
                            <input
                              :value="item.unitPrice"
                              @input="updateDonationAmount(item.id, $event.target.value)"
                              type="number"
                              min="1"
                              step="0.01"
                              class="w-24 pl-8 pr-2 py-2 border-2 border-emerald-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                            />
                          </div>
                        </div>
                        
                        <!-- Product Quantity Controls -->
                        <div v-else class="flex items-center mt-3 space-x-3">
                          <button
                            @click="updateCartQuantity(item.id, item.quantity - 1)"
                            class="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 group/btn"
                          >
                            <svg class="w-4 h-4 text-gray-600 group-hover/btn:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                            </svg>
                          </button>
                          <span class="min-w-[2.5rem] text-center font-bold text-lg text-gray-800">{{ item.quantity }}</span>
                          <button
                            @click="updateCartQuantity(item.id, item.quantity + 1)"
                            class="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 group/btn"
                          >
                            <svg class="w-4 h-4 text-gray-600 group-hover/btn:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div class="text-right ml-4">
                        <p class="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">RM{{ item.totalPrice.toFixed(2) }}</p>
                        <button
                          @click="removeFromCart(item.id)"
                          class="mt-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 group/remove"
                        >
                          <svg class="w-4 h-4 group-hover/remove:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Order Summary -->
                <div v-if="cart.length > 0" class="mb-8">
                  <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                    <div class="flex justify-between items-center">
                      <span class="text-lg font-semibold">Total Amount:</span>
                      <span class="text-3xl font-bold">RM{{ subtotal.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Customer Information -->
                <div class="space-y-6 mb-8">
                  <div class="flex items-center mb-4">
                    <div class="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <h3 class="text-lg font-bold text-gray-800">Contact Information</h3>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="relative">
                      <input
                        v-model="paymentForm.firstName"
                        type="text"
                        placeholder="First Name *"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                    <div class="relative">
                      <input
                        v-model="paymentForm.lastName"
                        type="text"
                        placeholder="Last Name *"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <input
                    v-model="paymentForm.email"
                    type="email"
                    placeholder="Email Address *"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <!-- Stripe Card Element -->
                <div class="mb-8">
                  <div class="flex items-center mb-4">
                    <div class="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mr-3">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                      </svg>
                    </div>
                    <h3 class="text-lg font-bold text-gray-800">Payment Method</h3>
                  </div>
                  <!-- Card-like design for payment input -->
                  <div class="relative">
                    <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-2xl border border-slate-700 relative overflow-hidden">
                      <!-- Card decoration -->
                      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                      <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-xl"></div>
                      
                      <!-- Card content -->
                      <div class="relative z-10">
                        <div class="flex justify-between items-start mb-8">
                          <div class="text-xs font-medium text-slate-300 tracking-wide">SECURE PAYMENT</div>
                          <div class="flex space-x-2">
                            <div class="w-8 h-5 bg-blue-500 rounded-sm"></div>
                            <div class="w-8 h-5 bg-red-500 rounded-sm"></div>
                          </div>
                        </div>
                        
                        <div id="card-element" class="min-h-[60px] text-white">
                          <!-- Stripe Elements will create form elements here -->
                        </div>
                        
                        <div class="mt-6 flex justify-between items-end">
                          <div class="text-xs text-slate-300">
                            VALID THRU<br>
                            <span class="text-white font-mono">MM/YY</span>
                          </div>
                          <div class="text-xs text-slate-300 text-right">
                            CVV<br>
                            <span class="text-white font-mono">***</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="card-errors" role="alert" class="text-red-600 text-sm mt-3 font-medium px-2"></div>
                  </div>
                </div>

                <!-- Terms and Conditions -->
                <div class="mb-8">
                  <label class="flex items-start group cursor-pointer">
                    <input
                      v-model="agreedToTerms"
                      type="checkbox"
                      class="mt-1 mr-3 w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                    />
                    <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      I agree to the 
                      <a href="#" class="text-purple-600 hover:text-purple-700 underline font-semibold transition-colors">Terms and Conditions</a>
                      and 
                      <a href="#" class="text-purple-600 hover:text-purple-700 underline font-semibold transition-colors">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <!-- Payment Button -->
                <button
                  v-if="cart.length > 0"
                  @click="processPayment"
                  :disabled="!canSubmit || processing"
                  :class="[
                    'w-full py-5 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center transform shadow-xl',
                    canSubmit && !processing
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105 hover:shadow-2xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed scale-100'
                  ]"
                >
                  <span v-if="processing" class="flex items-center">
                    <div class="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Processing Payment...
                  </span>
                  <span v-else class="flex items-center">
                    <svg class="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    Complete Payment • RM{{ subtotal.toFixed(2) }}
                  </span>
                </button>

                <!-- Security Notice -->
                <div v-if="cart.length > 0" class="mt-6 text-center">
                  <div class="inline-flex items-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                    <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <span class="text-xs text-gray-600 font-medium">256-bit SSL encryption • Secure payment processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-100">
        <div class="p-8 text-center">
          <!-- Success Animation -->
          <div class="relative w-24 h-24 mx-auto mb-6">
            <div class="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
            <div class="relative w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <h3 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Payment Successful! 🎉
          </h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            Thank you for your {{ hasOnlyDonations ? 'generous donation' : 'purchase' }} of 
            <span class="font-bold text-purple-600">RM{{ subtotal.toFixed(2) }}</span>.
            <br>
            {{ hasOnlyDonations ? 'Your contribution makes a real difference!' : 'You will receive a confirmation email shortly.' }}
          </p>
          
          <!-- Order Summary in Modal -->
          <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 text-left border border-gray-200">
            <div class="flex items-center mb-4">
              <div class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h4 class="font-bold text-lg text-gray-800">Order Summary</h4>
            </div>
            <div class="space-y-3">
              <div v-for="item in cart" :key="item.id" class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <div>
                  <span class="font-medium text-gray-800">{{ item.productName }}</span>
                  <span v-if="!item.isDonation" class="text-gray-500 text-sm ml-2">×{{ item.quantity }}</span>
                </div>
                <span class="font-bold text-purple-600">RM{{ item.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="pt-3 border-t-2 border-purple-200">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-gray-800">Total:</span>
                  <span class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">RM{{ subtotal.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <button
              @click="goToEvents"
              class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Back to Events
              </span>
            </button>
            <button
              @click="closeModal"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-8 rounded-xl font-semibold transition-all duration-300 border border-gray-300 hover:border-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useSupabaseClient, useSupabaseUser, navigateTo } from '#imports';

const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RVvV5R9hGUCBGvpabSsViVwSDDh3g902bSZruZee6dvLPLehVnCPBYmwdMTTfLsH391IP6oo8Iy9GkNAIKyuMd900gEHBJO57';
let stripe = null;
let elements = null;
let cardElement = null;

// Page data
const eventId = ref(route.query.eventId || '');
const paymentType = ref(route.query.type || 'donation');
const eventData = ref(null);
const products = ref([]);

// Cart and form data
const cart = ref([]);
const donationAmount = ref('');
const donationMessage = ref('');
const paymentForm = ref({
  firstName: '',
  lastName: '',
  email: user.value?.email || ''
});

// UI state
const processing = ref(false);
const showSuccessModal = ref(false);
const agreedToTerms = ref(false);

// Computed properties
const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.totalPrice, 0));

const isDonationEvent = computed(() => ['donation', 'fundraiser'].includes(eventData.value?.event_type));

const hasOnlyDonations = computed(() => cart.value.every(item => item.isDonation));

const canSubmit = computed(() => {
  return cart.value.length > 0 && 
         paymentForm.value.firstName.trim() && 
         paymentForm.value.lastName.trim() && 
         paymentForm.value.email.trim() && 
         agreedToTerms.value &&
         !processing.value &&
         cardElement;
});

// Cart management
const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.productId === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
    existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
  } else {
    cart.value.push({
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      productDescription: product.description,
      unitPrice: product.price,
      quantity: 1,
      totalPrice: product.price,
      isDonation: false
    });
  }
};

const addDonationToCart = () => {
  const amount = parseFloat(donationAmount.value);
  if (amount > 0) {
    cart.value.push({
      id: Date.now(),
      productId: 'donation',
      productName: 'Donation',
      productDescription: donationMessage.value || 'Thank you for your generous donation',
      unitPrice: amount,
      quantity: 1,
      totalPrice: amount,
      isDonation: true
    });
    donationAmount.value = '';
  }
};

const updateCartQuantity = (cartItemId, newQuantity) => {
  if (newQuantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  const item = cart.value.find(item => item.id === cartItemId);
  if (item && !item.isDonation) {
    item.quantity = newQuantity;
    item.totalPrice = newQuantity * item.unitPrice;
  }
};

const updateDonationAmount = (cartItemId, newAmount) => {
  const amount = parseFloat(newAmount) || 0;
  const item = cart.value.find(item => item.id === cartItemId);
  if (item && item.isDonation) {
    item.unitPrice = amount;
    item.totalPrice = amount;
  }
};

const removeFromCart = (cartItemId) => {
  const index = cart.value.findIndex(item => item.id === cartItemId);
  if (index !== -1) {
    cart.value.splice(index, 1);
  }
};

// Date formatting
const formatEventDate = () => {
  if (!eventData.value) return '';
  
  const startDate = new Date(eventData.value.event_startdate);
  const endDate = new Date(eventData.value.event_enddate);
  
  const formatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  if (startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString('en-US', formatOptions);
  } else {
    return `${startDate.toLocaleDateString('en-US', formatOptions)} - ${endDate.toLocaleDateString('en-US', formatOptions)}`;
  }
};

// Fetch event and products data
const fetchEventData = async () => {
  if (!eventId.value) return;

  try {
    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId.value)
      .single();

    if (eventError) throw eventError;
    eventData.value = event;

    // Fetch products if it's a selling event
    if (event.event_type === 'selling') {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('event_id', eventId.value)
        .eq('available', true);

      if (productsError) throw productsError;
      products.value = productsData || [];
    }

  } catch (error) {
    console.error('Error fetching event data:', error);
    alert('Failed to load event data');
  }
};

// Initialize Stripe
const initializeStripe = async () => {
  console.log('🔄 Starting Stripe initialization...');
  
  try {
    if (!window.Stripe) {
      console.log('📦 Loading Stripe script...');
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => {
        console.log('✅ Stripe script loaded');
        setupStripe();
      };
      script.onerror = () => {
        console.error('❌ Failed to load Stripe script');
      };
      document.head.appendChild(script);
    } else {
      console.log('✅ Stripe already available');
      setupStripe();
    }
  } catch (error) {
    console.error('❌ Error loading Stripe:', error);
  }
};

// Setup Stripe elements with custom styling for card-like appearance
const setupStripe = () => {
  console.log('🔧 Setting up Stripe elements...');
  
  try {
    if (!window.Stripe) {
      console.error('❌ Stripe not available on window');
      return;
    }

    stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    console.log('✅ Stripe instance created');
    
    elements = stripe.elements();
    console.log('✅ Stripe elements created');

    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#ffffff',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          '::placeholder': {
            color: '#94a3b8',
          },
          iconColor: '#ffffff',
        },
        invalid: {
          color: '#ef4444',
          iconColor: '#ef4444',
        },
        complete: {
          color: '#22c55e',
          iconColor: '#22c55e',
        },
      },
      hidePostalCode: true,
    });
    console.log('✅ Card element created');

    // Check if DOM element exists before mounting
    const cardContainer = document.getElementById('card-element');
    if (cardContainer) {
      cardElement.mount('#card-element');
      console.log('✅ Card element mounted successfully');
    } else {
      console.error('❌ Card element container not found, retrying...');
      // Retry after a short delay
      setTimeout(() => {
        const retryContainer = document.getElementById('card-element');
        if (retryContainer) {
          cardElement.mount('#card-element');
          console.log('✅ Card element mounted on retry');
        } else {
          console.error('❌ Card element container still not found');
        }
      }, 500);
    }

    cardElement.on('change', ({ error }) => {
      console.log('💳 Card element change event:', error ? error.message : 'No error');
      const displayError = document.getElementById('card-errors');
      if (displayError) {
        if (error) {
          displayError.textContent = error.message;
        } else {
          displayError.textContent = '';
        }
      }
    });

    cardElement.on('ready', () => {
      console.log('✅ Card element is ready for input');
    });

    cardElement.on('focus', () => {
      console.log('🎯 Card element focused');
    });

  } catch (error) {
    console.error('❌ Error setting up Stripe:', error);
  }
};

// Process payment
const processPayment = async () => {
  if (!canSubmit.value || !stripe || !cardElement) return;

  processing.value = true;

  try {
    console.log('🔍 Creating payment intent...');
    
    // Prepare order items
    const orderItems = cart.value.map(item => ({
      product_id: item.productId === 'donation' ? null : item.productId,
      product_name: item.productName,
      product_price: item.unitPrice,
      quantity: item.quantity,
      total_amount: item.totalPrice
    }));

    // Create payment intent with enhanced API
    const response = await $fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      body: {
        amount: subtotal.value,
        currency: 'myr',
        category: hasOnlyDonations.value ? 'donation' : 'purchase',
        message: donationMessage.value || null,
        event_id: eventId.value,
        order_items: orderItems,
        customer_info: paymentForm.value
      }
    });

    console.log('🎯 API Response:', response);
    console.log('🔑 Client secret present:', !!response.client_secret);

    if (!response.client_secret) {
      console.error('❌ No client_secret in response!');
      console.log('Response keys:', Object.keys(response));
      throw new Error('Failed to create payment intent - no client_secret returned');
    }

    console.log('💳 Confirming payment...');
    
    const { error, paymentIntent } = await stripe.confirmCardPayment(response.client_secret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${paymentForm.value.firstName} ${paymentForm.value.lastName}`,
          email: paymentForm.value.email,
        },
      }
    });

    if (error) {
      console.error('❌ Payment confirmation failed:', error);
      throw new Error(error.message);
    }

    console.log('✅ Payment confirmed:', paymentIntent);

    if (paymentIntent.status === 'succeeded') {
      console.log('🎉 Payment succeeded!');
      
      // Update donation status to completed in database
      await updateDonationStatus(response.donation_id, 'completed');
      
      showSuccessModal.value = true;
    } else {
      throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
    }

  } catch (error) {
    console.error('❌ Payment error:', error);
    
    let errorMessage = error.message;
    if (error.name === 'FetchError') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    alert(`Payment failed: ${errorMessage}`);
  } finally {
    processing.value = false;
  }
};

// Update donation status to completed after successful payment
const updateDonationStatus = async (donationId, status) => {
  if (!donationId) {
    console.error('❌ No donation ID provided for status update');
    return;
  }
  
  try {
    console.log(`🔄 Updating donation ${donationId} status to ${status}...`);
    
    const { error } = await supabase
      .from('donations')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', donationId);

    if (error) {
      console.error('❌ Failed to update donation status:', error);
      throw error;
    } else {
      console.log(`✅ Donation status updated to ${status}`);
    }
  } catch (error) {
    console.error('❌ Error updating donation status:', error);
    // Don't throw here - payment already succeeded, this is just cleanup
  }
};

// Modal actions
const closeModal = () => {
  showSuccessModal.value = false;
};

const goToEvents = () => {
  showSuccessModal.value = false;
  navigateTo('/events');
};

// Fetch user profile
const fetchUserProfile = async () => {
  if (!user.value) return;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.value.id)
      .single();

    if (data && !error) {
      paymentForm.value.firstName = data.first_name || '';
      paymentForm.value.lastName = data.last_name || '';
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
  }
};

onMounted(async () => {
  console.log('🚀 Component mounted');
  
  // Wait a bit for DOM to be fully ready
  await new Promise(resolve => setTimeout(resolve, 100));
  
  await initializeStripe();
  
  if (user.value) {
    await fetchUserProfile();
  }
  
  await fetchEventData();
  
  console.log('✅ All initialization complete');
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.border-3 {
  border-width: 3px;
}
</style>