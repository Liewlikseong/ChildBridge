<template>
  <div class="min-h-screen bg-neutral-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white border-b border-neutral-200 px-4 py-4 flex-shrink-0">
      <div class="container-custom">
        <h1 class="text-2xl font-bold text-neutral-900">Messages</h1>
        <p class="text-neutral-600 mt-1">Connect with our team and community</p>
      </div>
    </div>

    <!-- Main Chat Container -->
    <div class="container-custom py-6 flex-1 flex flex-col min-h-0">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

        <!-- Conversations Sidebar -->
        <div class="lg:col-span-1 bg-white rounded-lg shadow-sm border border-neutral-200 flex flex-col max-h-full">
          <!-- Sidebar Header -->
          <div class="p-4 border-b border-neutral-200 flex-shrink-0">
            <h2 class="text-lg font-semibold text-neutral-900">Conversations</h2>
          </div>

          <!-- Conversations List - Scrollable -->
          <div class="flex-1 overflow-y-auto min-h-0">
            <!-- Staff Group Chat (for donors) -->
            <div
              v-if="userRole === 'donor'"
              @click="selectChat('group_staff')"
              :class="[
                'p-4 border-b border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors flex-shrink-0',
                selectedChatType === 'group' && selectedChatId === 'staff' ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
              ]"
            >
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-neutral-900">Staff Team</h3>
                  <p class="text-sm text-neutral-500 truncate">
                    {{ staffLastMessage || 'Contact our staffs they can help if got any general problem or just want to have a conversation' }}
                  </p>
                </div>
                <div class="flex flex-col items-end flex-shrink-0">
                  <span v-if="staffLastMessageTime" class="text-xs text-neutral-400">
                    {{ formatTime(staffLastMessageTime) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Admin Group Chat (for donors) -->
            <div
              v-if="userRole === 'donor'"
              @click="selectChat('group_admin')"
              :class="[
                'p-4 border-b border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors flex-shrink-0',
                selectedChatType === 'group' && selectedChatId === 'admin' ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
              ]"
            >
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-neutral-900">Admin Team</h3>
                  <p class="text-sm text-neutral-500 truncate">
                    {{ adminLastMessage || 'Contact our administrators they can help if got problem with the website' }}
                  </p>
                </div>
                <div class="flex flex-col items-end flex-shrink-0">
                  <span v-if="adminLastMessageTime" class="text-xs text-neutral-400">
                    {{ formatTime(adminLastMessageTime) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Direct Conversations (for staff/admin) -->
            <div v-if="userRole === 'staff' || userRole === 'admin'">
              <div
                v-for="conversation in conversations"
                :key="conversation.id"
                @click="selectChat(`direct_${conversation.id}`)"
                :class="[
                  'p-4 border-b border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors flex-shrink-0',
                  selectedChatType === 'direct' && selectedChatId === conversation.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
                ]"
              >
                <div class="flex items-center space-x-3">
                  <div class="relative flex-shrink-0">
                    <img
                      v-if="conversation.avatar"
                      :src="conversation.avatar"
                      :alt="conversation.name"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                      v-else
                      class="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium"
                    >
                      {{ getInitials(conversation.name) }}
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 mb-1">
                      <h3 class="font-medium text-neutral-900 truncate">{{ conversation.name }}</h3>
                      <span
                        v-if="conversation.role"
                        :class="[
                          'text-xs px-2 py-1 rounded-full font-medium flex-shrink-0',
                          conversation.role === 'donor' ? 'bg-blue-100 text-blue-800' :
                          conversation.role === 'staff' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        ]"
                      >
                        {{ conversation.role }}
                      </span>
                    </div>
                    <p class="text-sm text-neutral-500 truncate">
                      {{ conversation.lastMessage || 'No messages yet' }}
                    </p>
                  </div>
                  <div class="flex flex-col items-end flex-shrink-0">
                    <span v-if="conversation.lastMessageTime" class="text-xs text-neutral-400">
                      {{ formatTime(conversation.lastMessageTime) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Empty State for Conversations -->
              <div v-if="conversations.length === 0" class="p-6 text-center text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No conversations yet</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-neutral-200 flex flex-col max-h-full">
          <!-- Chat Header -->
          <div v-if="selectedChatId" class="p-4 border-b border-neutral-200 bg-white flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div v-if="chatHeader.avatar" class="relative flex-shrink-0">
                  <img :src="chatHeader.avatar" :alt="chatHeader.name" class="w-10 h-10 rounded-full object-cover" />
                </div>
                <div v-else class="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0" :class="chatHeader.bgColor">
                  <svg v-if="chatHeader.icon === 'staff'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <svg v-else-if="chatHeader.icon === 'admin'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span v-else>{{ chatHeader.icon }}</span>
                </div>
                <div class="min-w-0">
                  <h3 class="font-semibold text-neutral-900 truncate">{{ chatHeader.name }}</h3>
                  <p class="text-sm text-neutral-500 truncate">{{ chatHeader.status }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-2 flex-shrink-0">
                <button @click="refreshMessages" class="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Messages Area - Scrollable -->
          <div class="flex-1 overflow-y-auto p-4 min-h-0" ref="messagesContainer">
            <!-- Empty State -->
            <div v-if="!selectedChatId" class="h-full flex items-center justify-center text-neutral-500">
              <div class="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 class="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>

            <!-- Messages -->
            <div v-else class="space-y-4">
              <div v-for="message in messages" :key="message.id" class="flex" :class="message.isMine ? 'justify-end' : 'justify-start'">
                <div class="max-w-xs lg:max-w-md">
                  <div
                    :class="[
                      'rounded-lg px-4 py-2 break-words',
                      message.isMine
                        ? 'bg-primary-500 text-white rounded-br-none'
                        : 'bg-neutral-100 text-neutral-900 rounded-bl-none'
                    ]"
                  >
                    <!-- Sender Name for Group Messages -->
                    <div v-if="!message.isMine && selectedChatType === 'group' && message.senderName" class="text-xs font-medium mb-1 opacity-75">
                      {{ message.senderName }}
                    </div>

                    <!-- Media Files -->
                    <div v-if="message.media_files && message.media_files.length > 0" class="mb-2">
                    <!-- Single Image -->
                    <div v-if="message.media_files.length === 1" class="mb-2">
                        <img
                        :src="message.media_files[0].url"
                        alt="Shared image"
                        class="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        @click="openImageModal(message.media_files[0].url)"
                        loading="lazy"
                        />
                    </div>
                    
                    <!-- Multiple Images Grid -->
                    <div v-else class="grid gap-1 mb-2" :class="{
                        'grid-cols-2': message.media_files.length === 2,
                        'grid-cols-2': message.media_files.length === 3,
                        'grid-cols-2': message.media_files.length >= 4
                    }">
                        <div
                        v-for="(media, index) in message.media_files.slice(0, 4)"
                        :key="index"
                        class="relative"
                        :class="{
                            'col-span-2': message.media_files.length === 3 && index === 0,
                            'aspect-square': message.media_files.length > 1
                        }"
                        >
                        <img
                            :src="media.url"
                            alt="Shared image"
                            class="w-full h-full object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                            :class="{
                            'max-w-xs': message.media_files.length === 1,
                            'max-h-32': message.media_files.length > 1
                            }"
                            @click="openImageModal(media.url)"
                            loading="lazy"
                        />
                        
                        <!-- Show count overlay for 4+ images -->
                        <div
                            v-if="index === 3 && message.media_files.length > 4"
                            class="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center cursor-pointer"
                            @click="openImageModal(media.url)"
                        >
                            <span class="text-white font-semibold">+{{ message.media_files.length - 4 }}</span>
                        </div>
                        </div>
                    </div>
                    </div>


                    <!-- Message Content -->
                    <p v-if="message.content && !message.content.startsWith('📷')" class="text-sm">{{ message.content }}</p>
                    <p v-else-if="message.content.startsWith('📷')" class="text-sm italic opacity-75">{{ message.content }}</p>
                  </div>

                  <!-- Message Time -->
                  <div class="flex items-center mt-1" :class="message.isMine ? 'justify-end' : 'justify-start'">
                    <span class="text-xs text-neutral-400">{{ formatTime(message.created_at) }}</span>
                  </div>
                </div>
              </div>

              <!-- Typing Indicator -->
              <div v-if="isTyping" class="flex justify-start">
                <div class="bg-neutral-100 rounded-lg px-4 py-2 rounded-bl-none">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Image Preview Area -->
          <div v-if="imagePreview.length > 0" class="p-4 border-t border-neutral-200 bg-neutral-50 flex-shrink-0">
            <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-medium text-neutral-700">
                Image Preview ({{ imagePreview.length }} {{ imagePreview.length === 1 ? 'image' : 'images' }})
                </h4>
                <button
                @click="clearImagePreview"
                class="text-neutral-400 hover:text-neutral-600 transition-colors"
                :disabled="isUploadingImage"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            
            <!-- Image Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                <div
                v-for="image in imagePreview"
                :key="image.id"
                class="relative group"
                >
                <img
                    :src="image.url"
                    :alt="image.name"
                    class="w-full h-24 object-cover rounded-lg border border-neutral-200"
                />
                
                <!-- Upload Progress Overlay -->
                <div
                    v-if="image.isUploading"
                    class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center"
                >
                    <div class="text-white text-xs font-medium">
                    {{ uploadProgress[image.id] || 0 }}%
                    </div>
                </div>
                
                <!-- Remove Button -->
                <button
                    @click="removeImagePreview(image.id)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    :disabled="image.isUploading"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <!-- Upload Status -->
                <div class="absolute bottom-1 left-1 right-1">
                    <div
                    v-if="image.isUploading"
                    class="bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-90"
                    >
                    Uploading...
                    </div>
                    <div
                    v-else-if="image.uploaded_url"
                    class="bg-green-500 text-white text-xs px-2 py-1 rounded opacity-90"
                    >
                    Ready
                    </div>
                    <div
                    v-else
                    class="bg-red-500 text-white text-xs px-2 py-1 rounded opacity-90"
                    >
                    Failed
                    </div>
                </div>
                </div>
            </div>
            
            <!-- Send Button -->
            <div class="flex justify-between items-center">
                <div class="text-xs text-neutral-500">
                {{ imagePreview.filter(img => img.uploaded_url).length }} of {{ imagePreview.length }} ready to send
                </div>  
            </div>
            </div>


          <!-- Message Input Area -->
          <div v-if="selectedChatId" class="p-4 border-t border-neutral-200 bg-white flex-shrink-0">
            <form @submit.prevent="sendMessage" class="flex items-end space-x-3">
              <!-- Image Upload Button -->
                <label class="flex-shrink-0 cursor-pointer text-neutral-400 hover:text-primary-500 transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    @change="handleImageUpload"
                    class="sr-only"
                    :disabled="isUploadingImage"
                />
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                </label>

              <!-- Message Input -->
              <div class="flex-1 min-w-0">
                <textarea
                  v-model="newMessage"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.enter.shift.exact="newMessage += '\n'"
                  @input="sendTypingStatus"
                  placeholder="Type a message..."
                  rows="1"
                  class="w-full resize-none border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  style="min-height: 40px; max-height: 120px;"
                  :disabled="imagePreview.length > 0"
                ></textarea>
              </div>
              
              <!-- Send Button -->
              <button
                type="submit"
                :disabled="(!newMessage.trim() && !imagePreview) || isSending || isUploadingImage"
                class="bg-primary-500 text-white rounded-lg p-2 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <svg v-if="!isSending" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </form>

            <!-- Input Help Text -->
            <div class="mt-2 text-xs text-neutral-500">
              Press Enter to send, Shift+Enter for new line • Click 📷 to send images
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div
      v-if="selectedImage"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="closeImageModal"
    >
      <div class="relative max-w-4xl max-h-full p-4">
        <img
          :src="selectedImage"
          alt="Full size image"
          class="max-w-full max-h-full object-contain rounded-lg"
        />
        <button
          @click="closeImageModal"
          class="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports' // Assuming Nuxt 3 with Supabase module

// Page setup
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// Reactive data
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const selectedChatId = ref(null) // ID of the selected chat (user ID or 'staff'/'admin')
const selectedChatType = ref(null) // 'group' or 'direct'
const messages = ref([])
const conversations = ref([]) // For staff/admin's direct chats
const newMessage = ref('')
const isSending = ref(false)
const isTyping = ref(false) // This would require broadcast for real-time
const messagesContainer = ref(null)
const userProfile = ref(null)
const userRole = ref('donor') // Default role
const selectedImage = ref(null)

// Group chat specific data for donors
const staffLastMessage = ref('')
const staffLastMessageTime = ref(null)
const adminLastMessage = ref('')
const adminLastMessageTime = ref(null)

const imagePreview = ref([])
const isUploadingImage = ref(false)
const uploadProgress = ref({})

// Real-time subscription variables
let directMessageSubscription = null
let groupMessageSubscription = null
let typingChannel = null // For broadcast typing indicator

// Computed properties
const chatHeader = computed(() => {
  if (!selectedChatId.value) return {}

  if (selectedChatType.value === 'group') {
    if (selectedChatId.value === 'staff') {
      return {
        name: 'Staff Team',
        status: 'Available to help',
        icon: 'staff',
        bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600'
      }
    } else if (selectedChatId.value === 'admin') {
      return {
        name: 'Administration',
        status: 'Administration team',
        icon: 'admin',
        bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600'
      }
    }
  } else if (selectedChatType.value === 'direct') {
    const conv = conversations.value.find(c => c.id === selectedChatId.value)
    if (conv) {
      return {
        name: conv.name,
        avatar: conv.avatar,
        icon: getInitials(conv.name)
      }
    }
  }
  return {}
})

// Helper functions
const getInitials = (name) => {
  if (!name) return ''
  const parts = name.split(' ')
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || ''
  return (parts[0][0] || '') + (parts[1]?.[0] || '')
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / 60000)

  if (diffInMinutes < 1) return 'now'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  if (diffInMinutes < 1440) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    return `${formattedHours}:${formattedMinutes} ${ampm}`
  }
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d` // Less than 7 days
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const openImageModal = (imageUrl) => {
  selectedImage.value = imageUrl
}

const closeImageModal = () => {
  selectedImage.value = null
}

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files) // Get all selected files
  if (!files.length) return

  // Validate files
  const validFiles = files.filter(file => {
    if (!file.type.startsWith('image/')) {
      alert(`${file.name} is not a valid image file`)
      return false
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert(`${file.name} is too large. Maximum size is 10MB.`)
      return false
    }
    return true
  })

  if (!validFiles.length) return

  // Check total number of images (limit to 5 for example)
  if (imagePreview.value.length + validFiles.length > 5) {
    alert('You can only upload up to 5 images at once')
    return
  }

  isUploadingImage.value = true

  try {
    const uploadPromises = validFiles.map(async (file, index) => {
      const fileId = Date.now() + index // Unique ID for each file
      
      // Create preview immediately
      const preview = {
        id: fileId,
        url: URL.createObjectURL(file),
        file: file,
        name: file.name,
        uploaded_url: null,
        isUploading: true
      }
      
      imagePreview.value.push(preview)
      uploadProgress.value[fileId] = 0

      try {
        // Upload to Supabase storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = `messages/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            onUploadProgress: (progress) => {
              uploadProgress.value[fileId] = Math.round((progress.loaded / progress.total) * 100)
            }
          })

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath)

        // Update preview with uploaded URL
        const previewIndex = imagePreview.value.findIndex(p => p.id === fileId)
        if (previewIndex !== -1) {
          imagePreview.value[previewIndex].uploaded_url = publicUrl
          imagePreview.value[previewIndex].isUploading = false
        }

        return { success: true, fileId }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        // Remove failed upload from preview
        imagePreview.value = imagePreview.value.filter(p => p.id !== fileId)
        delete uploadProgress.value[fileId]
        return { success: false, error, fileName: file.name }
      }
    })

    const results = await Promise.all(uploadPromises)
    
    // Show any upload errors
    const failedUploads = results.filter(r => !r.success)
    if (failedUploads.length > 0) {
      alert(`Failed to upload: ${failedUploads.map(f => f.fileName).join(', ')}`)
    }

  } catch (error) {
    console.error('Error in upload process:', error)
    alert('An error occurred during upload. Please try again.')
  } finally {
    isUploadingImage.value = false
  }

  // Clear the file input
  event.target.value = ''
}

const clearImagePreview = () => {
  imagePreview.value.forEach(preview => {
    if (preview.url) {
      URL.revokeObjectURL(preview.url)
    }
  })
  imagePreview.value = []
  isUploadingImage.value = false
  uploadProgress.value = {}
}

const removeImagePreview = (imageId) => {
  const index = imagePreview.value.findIndex(p => p.id === imageId)
  if (index !== -1) {
    const preview = imagePreview.value[index]
    if (preview.url) {
      URL.revokeObjectURL(preview.url)
    }
    imagePreview.value.splice(index, 1)
    delete uploadProgress.value[imageId]
  }
}

// Fetch user profile and role
const fetchUserProfile = async () => {
  if (!user.value) return

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, role')
      .eq('id', user.value.id)
      .single()

    if (error) throw error

    userProfile.value = data
    userRole.value = data?.role || 'donor'

    // Load appropriate conversations based on role
    if (userRole.value === 'donor') {
      await loadDonorChats()
    } else {
      await loadStaffAdminConversations()
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

// Load donor chats (staff and admin groups)
const loadDonorChats = async () => {
  try {
    // Fetch last message and time for staff group
    const { data: staffMsgs, error: staffErr } = await supabase
      .from('messages')
      .select('content, created_at')
      .eq('group_type', 'staff')
      .eq('message_type', 'group')
      .order('created_at', { ascending: false })
      .limit(1)

    if (staffErr) throw staffErr
    if (staffMsgs && staffMsgs.length > 0) {
      staffLastMessage.value = staffMsgs[0].content
      staffLastMessageTime.value = staffMsgs[0].created_at
    }

    // Fetch last message and time for admin group
    const { data: adminMsgs, error: adminErr } = await supabase
      .from('messages')
      .select('content, created_at')
      .eq('group_type', 'admin')
      .eq('message_type', 'group')
      .order('created_at', { ascending: false })
      .limit(1)

    if (adminErr) throw adminErr
    if (adminMsgs && adminMsgs.length > 0) {
      adminLastMessage.value = adminMsgs[0].content
      adminLastMessageTime.value = adminMsgs[0].created_at
    }

  } catch (error) {
    console.error('Error loading donor group chats:', error)
  }
}

// Load staff/admin conversations (direct messages with other users)
const loadStaffAdminConversations = async () => {
  try {
    // Get all donor profiles for staff/admin
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, role')
      .neq('id', user.value.id)

    if (error) throw error

    const convs = await Promise.all(profiles.map(async (profile) => {
      // Get last message in direct conversation with this profile
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('content, created_at, is_from_group')
        .eq('message_type', 'direct')
        .or(`and(sender_id.eq.${user.value.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.value.id})`)
        .order('created_at', { ascending: false })
        .limit(1)

      return {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
        avatar: profile.avatar_url,
        role: profile.role,
        lastMessage: lastMsg?.[0]?.content || '',
        lastMessageTime: lastMsg?.[0]?.created_at || null,
        isFromGroup: lastMsg?.[0]?.is_from_group || false // Flag if last message was from group
      }
    }))

    // Sort: donors first, then by last message time
    conversations.value = convs.sort((a, b) => {
      // Prioritize donors
      if (a.role === 'donor' && b.role !== 'donor') return -1
      if (b.role === 'donor' && a.role !== 'donor') return 1

      // Sort by last message time
      if (!a.lastMessageTime && !b.lastMessageTime) return 0
      if (!a.lastMessageTime) return 1
      if (!b.lastMessageTime) return -1
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    })

  } catch (error) {
    console.error('Error loading staff/admin conversations:', error)
  }
}

// Fetch messages for the selected chat
const fetchMessages = async () => {
  if (!selectedChatId.value || !user.value?.id) return

  let data, error
  const currentUserId = user.value.id

  try {
    if (selectedChatType.value === 'group') {
      if (userRole.value === 'donor' && selectedChatId.value === 'staff') {
        // For donors viewing staff group: get both group messages and staff replies
        const { data: groupMsgs, error: groupError } = await supabase
          .from('messages')
          .select(`
            id, content, created_at, sender_id, is_staff_reply, receiver_id, media_files,
            sender:profiles!messages_sender_id_fkey(first_name, last_name, role)
          `)
          .eq('group_type', 'staff')
          .eq('message_type', 'group')
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .order('created_at', { ascending: true })

        if (groupError) throw groupError
        data = groupMsgs

      } else {
        // Regular group messages
        const { data: groupData, error: groupError } = await supabase
          .from('messages')
          .select(`
            id, content, created_at, sender_id, media_files,
            sender:profiles!messages_sender_id_fkey(first_name, last_name, role)
          `)
          .eq('group_type', selectedChatId.value)
          .eq('message_type', 'group')
          .order('created_at', { ascending: true })

        if (groupError) throw groupError
        data = groupData
      }

    } else if (selectedChatType.value === 'direct') {
      // Direct messages query
      const { data: directData, error: directError } = await supabase
        .from('messages')
        .select(`
          id, content, created_at, sender_id, receiver_id, is_from_group, group_context, media_files,
          sender:profiles!messages_sender_id_fkey(first_name, last_name, role, avatar_url)
        `)
        .eq('message_type', 'direct')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedChatId.value}),and(sender_id.eq.${selectedChatId.value},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true })

      if (directError) throw directError
      data = directData
    }

    if (!data) {
      console.error('No data returned from query')
      return
    }

    // Process messages with proper sender information
    messages.value = data.map(msg => {
      const senderName = msg.sender
        ? `${msg.sender.first_name || ''} ${msg.sender.last_name || ''}`.trim()
        : (msg.sender_id === currentUserId ? 'You' : 'Unknown')

      return {
        ...msg,
        isMine: msg.sender_id === currentUserId,
        senderName: senderName || 'Unknown'
      }
    })

    console.log('Fetched messages:', messages.value) // Debug log
    scrollToBottom()

  } catch (error) {
    console.error(`Error fetching ${selectedChatType.value} messages:`, error)
    messages.value = [] // Clear messages on error
  }
}

// Send a message (handles both text and images)
const sendMessage = async () => {
  // Check if there are images to send
  const hasImages = imagePreview.value.length > 0
  const hasText = newMessage.value.trim().length > 0
  
  if (!hasImages && !hasText) return
  if (!selectedChatId.value || !user.value?.id || isSending.value) return

  // If there are images but some are still uploading, wait or show error
  const stillUploading = imagePreview.value.some(img => img.isUploading)
  if (hasImages && stillUploading) {
    alert('Please wait for all images to finish uploading')
    return
  }

  isSending.value = true
  const messageContent = newMessage.value.trim()
  newMessage.value = '' // Clear input immediately
  await nextTick()
  resizeTextarea()

  try {
    let messageData, error
    const currentUserId = user.value.id

    // Prepare media files array if there are images
    const mediaFiles = hasImages ? imagePreview.value
      .filter(img => img.uploaded_url && !img.isUploading)
      .map(img => ({
        url: img.uploaded_url,
        type: 'image',
        name: img.name
      })) : null

    if (selectedChatType.value === 'group') {
      // Group message logic
      if (userRole.value === 'donor' && selectedChatId.value === 'staff') {
        // Donor sending to staff group
        const { data: staffMembers, error: staffError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'staff')

        if (staffError) throw staffError

        const directMessages = staffMembers.map(staff => ({
          content: messageContent,
          sender_id: currentUserId,
          receiver_id: staff.id,
          message_type: 'direct',
          is_from_group: true,
          group_context: 'staff',
          ...(mediaFiles && { media_files: mediaFiles })
        }))

        const { error: insertError } = await supabase
          .from('messages')
          .insert(directMessages)

        if (insertError) throw insertError

        const { data: groupMessage, error: groupError } = await supabase
          .from('messages')
          .insert({
            content: messageContent,
            sender_id: currentUserId,
            group_type: 'staff',
            message_type: 'group',
            ...(mediaFiles && { media_files: mediaFiles })
          })
          .select(`
            id, content, created_at, sender_id, media_files,
            sender:profiles!messages_sender_id_fkey(first_name, last_name, role)
          `)
          .single()

        if (groupError) throw groupError
        messageData = groupMessage

      } else {
        // Regular group message
        const { data: groupData, error: groupError } = await supabase
          .from('messages')
          .insert({
            content: messageContent,
            sender_id: currentUserId,
            group_type: selectedChatId.value,
            message_type: 'group',
            ...(mediaFiles && { media_files: mediaFiles })
          })
          .select(`
            id, content, created_at, sender_id, media_files,
            sender:profiles!messages_sender_id_fkey(first_name, last_name, role)
          `)
          .single()

        if (groupError) throw groupError
        messageData = groupData
      }

    } else if (selectedChatType.value === 'direct') {
      // Direct message insertion
      const { data: receiverProfile, error: receiverError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', selectedChatId.value)
        .single()

      if (receiverError) throw receiverError

      // Insert the direct message
      const { data: directData, error: directError } = await supabase
        .from('messages')
        .insert({
          content: messageContent,
          sender_id: currentUserId,
          receiver_id: selectedChatId.value,
          message_type: 'direct',
          is_staff_reply: userRole.value === 'staff' && receiverProfile.role === 'donor',
          ...(mediaFiles && { media_files: mediaFiles })
        })
        .select(`
          id, content, created_at, sender_id, receiver_id, is_staff_reply, media_files,
          sender:profiles!messages_sender_id_fkey(first_name, last_name, role, avatar_url)
        `)
        .single()

      if (directError) throw directError
      messageData = directData

      // If staff is replying to donor, also create a group message
      if (userRole.value === 'staff' && receiverProfile.role === 'donor') {
        const { error: groupError } = await supabase
          .from('messages')
          .insert({
            content: messageContent,
            sender_id: currentUserId,
            receiver_id: selectedChatId.value,
            group_type: 'staff',
            message_type: 'group',
            is_staff_reply: true,
            ...(mediaFiles && { media_files: mediaFiles })
          })

        if (groupError) console.error('Error creating group message for staff reply:', groupError)
      }
    }

    if (error) throw error

    // Add message to UI immediately
    const msgToAdd = {
      ...messageData,
      isMine: true,
      senderName: userProfile.value
        ? `${userProfile.value.first_name || ''} ${userProfile.value.last_name || ''}`.trim()
        : 'You'
    }

    messages.value.push(msgToAdd)
    scrollToBottom()

    // Clear image preview after successful send
    if (hasImages) {
      clearImagePreview()
    }

    // Update last message in chat lists
    const displayContent = hasImages && !hasText ? '📷 Image' : messageContent
    
    if (selectedChatType.value === 'group') {
      if (selectedChatId.value === 'staff') {
        staffLastMessage.value = displayContent
        staffLastMessageTime.value = msgToAdd.created_at
      } else if (selectedChatId.value === 'admin') {
        adminLastMessage.value = displayContent
        adminLastMessageTime.value = msgToAdd.created_at
      }
    } else if (selectedChatType.value === 'direct') {
      const conv = conversations.value.find(c => c.id === selectedChatId.value)
      if (conv) {
        conv.lastMessage = displayContent
        conv.lastMessageTime = msgToAdd.created_at
      }
    }

  } catch (error) {
    console.error('Error sending message:', error)
    console.error('Error details:', error.message, error.details)
    alert(`Failed to send message: ${error.message || 'Please try again.'}`)
  } finally {
    isSending.value = false
  }
}

// Real-time listener for new messages
const setupRealtimeListeners = () => {
  if (!user.value?.id) return

  // Clean up existing subscriptions
  if (directMessageSubscription) {
    supabase.removeChannel(directMessageSubscription)
    directMessageSubscription = null
  }
  if (groupMessageSubscription) {
    supabase.removeChannel(groupMessageSubscription)
    groupMessageSubscription = null
  }
  if (typingChannel) {
    supabase.removeChannel(typingChannel)
    typingChannel = null
  }

  // Realtime for Direct Messages
  directMessageSubscription = supabase
    .channel(`direct_messages_for_${user.value.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.value.id}`
      },
      async (payload) => {
        const newMessageData = payload.new;
        if (newMessageData.message_type !== 'direct') return;

        // If donor is viewing staff group and receives direct message from staff
        if (userRole.value === 'donor' &&
            selectedChatType.value === 'group' &&
            selectedChatId.value === 'staff' &&
            newMessageData.is_from_group) {
          // This message should appear in the group chat view
          await fetchMessages() // Refresh to get the corresponding group message
          return
        }

        if (selectedChatType.value === 'direct' && selectedChatId.value === newMessageData.sender_id) {
          // Add message to current direct chat
          messages.value.push({
            ...newMessageData,
            isMine: false,
            senderName: null
          })
          scrollToBottom()
        } else {
          // Update conversation list
          const conv = conversations.value.find(c => c.id === newMessageData.sender_id)
          if (conv) {
            conv.lastMessage = newMessageData.content
            conv.lastMessageTime = newMessageData.created_at
          } else if (userRole.value === 'staff' || userRole.value === 'admin') {
            await loadStaffAdminConversations()
          }
        }
      }
    )
    .subscribe()

  // Realtime for Group Messages (Staff/Admin group)
  groupMessageSubscription = supabase
    .channel(`group_messages_for_${user.value.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `message_type=eq.group`
      },
      async (payload) => {
        const newMessageData = payload.new;
        if (newMessageData.sender_id === user.value.id) return; // Skip own messages

        // For donors: only show staff group messages that are meant for them
        if (userRole.value === 'donor' &&
            newMessageData.group_type === 'staff') {

          // Check if this message is for this donor (staff reply)
          if (newMessageData.is_staff_reply && newMessageData.receiver_id === user.value.id) {
            if (selectedChatType.value === 'group' && selectedChatId.value === 'staff') {
              // Fetch sender profile
              const { data: senderProfile } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', newMessageData.sender_id)
                .single()

              messages.value.push({
                ...newMessageData,
                isMine: false,
                senderName: senderProfile ? `${senderProfile.first_name || ''} ${senderProfile.last_name || ''}`.trim() : 'Staff'
              })
              scrollToBottom()
            } else {
              // Update last message for staff group
              staffLastMessage.value = newMessageData.content
              staffLastMessageTime.value = newMessageData.created_at
            }
          }
        }
      }
    )
    .subscribe()

  // Broadcast for typing indicator (optional)
  typingChannel = supabase.channel('typing_indicator')
  typingChannel.on('broadcast', { event: 'typing' }, (payload) => {
    // Implement logic to show/hide typing indicator based on payload
    if (payload.payload.chatId === selectedChatId.value && payload.payload.senderId !== user.value.id) {
      isTyping.value = true;
      clearTimeout(window.typingTimer);
      window.typingTimer = setTimeout(() => {
        isTyping.value = false;
      }, 3000); // Hide after 3 seconds of no activity
    }
  }).subscribe();
}

// Function to send typing broadcast (call this on textarea @input event)
const sendTypingStatus = () => {
  if (typingChannel && selectedChatId.value) {
    typingChannel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { senderId: user.value.id, chatId: selectedChatId.value }
    })
  }
}

// Refresh messages (e.g., pulling down to refresh or explicit button click)
const refreshMessages = async () => {
  await fetchMessages()
}

// Watch selected chat to re-fetch messages and set up new listeners
watch(selectedChatId, async (newChatId, oldChatId) => {
  if (newChatId && newChatId !== oldChatId) {
    await fetchMessages();
    scrollToBottom();
  }
})

// Select a chat (group or direct)
const selectChat = async (chatId) => {
  if (chatId.startsWith('group_')) {
    // Group chat selection
    const groupType = chatId.replace('group_', '') // 'staff' or 'admin'
    selectedChatType.value = 'group'
    selectedChatId.value = groupType
  } else if (chatId.startsWith('direct_')) {
    // Direct chat selection
    const userId = chatId.replace('direct_', '')
    selectedChatType.value = 'direct'
    selectedChatId.value = userId
  }

  // Clear any existing image preview when switching chats
  clearImagePreview();

  // Fetch messages for the selected chat
  await fetchMessages()
}

// Helper function for textarea auto-resize
const resizeTextarea = () => {
  const textarea = document.querySelector('textarea')
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
}

// Scroll to bottom of messages container
const scrollToBottom = async () => {
  if (messagesContainer.value) {
    await nextTick()
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Lifecycle hooks
onMounted(async () => {
  await fetchUserProfile()
  setupRealtimeListeners()
  // Automatically select the first chat if donor or staff/admin
  if (userRole.value === 'donor' && staffLastMessage.value) {
    selectChat('group_staff');
  } else if (userRole.value === 'donor' && adminLastMessage.value) {
    selectChat('group_admin');
  } else if (userRole.value !== 'donor' && conversations.value.length > 0) {
    selectChat(`direct_${conversations.value[0].id}`);
  }
})

onUnmounted(() => {
  // Clean up real-time subscriptions
  if (directMessageSubscription) {
    supabase.removeChannel(directMessageSubscription)
  }
  if (groupMessageSubscription) {
    supabase.removeChannel(groupMessageSubscription)
  }
  if (typingChannel) {
    supabase.removeChannel(typingChannel)
  }
  // 6. ADD onUnmounted CLEANUP
  clearImagePreview() // Clean up any image preview URLs
})
</script>

<style scoped>
/* Ensure proper scrolling behavior */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Ensure min-height works properly */
.min-h-0 {
  min-height: 0;
}
</style>
