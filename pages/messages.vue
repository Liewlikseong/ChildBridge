<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-sm flex-shrink-0">
      <div class="container-custom">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Messages</h1>
        <p class="text-gray-600 mt-1">Connect with our team and community</p>
      </div>
    </div>

    <!-- Main Chat Container -->
    <div class="container-custom py-6 flex-1 flex flex-col min-h-0">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

        <!-- Conversations Sidebar -->
        <div class="lg:col-span-1 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 flex flex-col max-h-full overflow-hidden">
          <!-- Sidebar Header -->
          <div class="p-6 border-b border-gray-200/50 flex-shrink-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
            <h2 class="text-xl font-semibold text-gray-900">Conversations</h2>
          </div>

          <!-- Conversations List - Scrollable -->
          <div class="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
            <!-- Staff Group Chat (for donors) -->
            <div
              v-if="userRole === 'donor'"
              @click="selectChat('group_staff')"
              :class="[
                'p-4 border-b border-gray-200/30 cursor-pointer hover:bg-white/50 transition-all duration-200 flex-shrink-0',
                selectedChatType === 'group' && selectedChatId === 'staff' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500 shadow-sm' : ''
              ]"
            >
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900">Staff Team</h3>
                  <p class="text-sm text-gray-500 truncate">
                    {{ staffLastMessage || 'Contact our staffs they can help if got any general problem or just want to have a conversation' }}
                  </p>
                </div>
                <div class="flex flex-col items-end flex-shrink-0">
                  <span v-if="staffLastMessageTime" class="text-xs text-gray-400 font-medium">
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
                'p-4 border-b border-gray-200/30 cursor-pointer hover:bg-white/50 transition-all duration-200 flex-shrink-0',
                selectedChatType === 'group' && selectedChatId === 'admin' ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-l-purple-500 shadow-sm' : ''
              ]"
            >
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900">Admin Team</h3>
                  <p class="text-sm text-gray-500 truncate">
                    {{ adminLastMessage || 'Contact our administrators they can help if got problem with the website' }}
                  </p>
                </div>
                <div class="flex flex-col items-end flex-shrink-0">
                  <span v-if="adminLastMessageTime" class="text-xs text-gray-400 font-medium">
                    {{ formatTime(adminLastMessageTime) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Direct Conversations (for staff/admin) -->
            <div v-if="userRole !== 'donor'">
              <div
                v-for="conversation in conversations"
                :key="conversation.id"
                @click="selectChat(`direct_${conversation.id}`)"
                :class="[
                  'p-4 border-b border-gray-200/30 cursor-pointer hover:bg-white/50 transition-all duration-200 flex-shrink-0',
                  selectedChatType === 'direct' && selectedChatId === conversation.id ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500 shadow-sm' : ''
                ]"
              >
                <div class="flex items-center space-x-3">
                  <div class="relative flex-shrink-0">
                    <img
                      v-if="conversation.avatar"
                      :src="conversation.avatar"
                      :alt="conversation.name"
                      class="w-12 h-12 rounded-xl object-cover shadow-md"
                    />
                    <div
                      v-else
                      class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md"
                    >
                      {{ getInitials(conversation.name) }}
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 mb-1">
                      <h3 class="font-semibold text-gray-900 truncate">{{ conversation.name }}</h3>
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
                    <p class="text-sm text-gray-500 truncate">
                      {{ conversation.lastMessage || 'No messages yet' }}
                    </p>
                  </div>
                  <div class="flex flex-col items-end flex-shrink-0">
                    <span v-if="conversation.lastMessageTime" class="text-xs text-gray-400 font-medium">
                      {{ formatTime(conversation.lastMessageTime) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Empty State for Conversations -->
              <div v-if="conversations.length === 0" class="p-8 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p class="font-medium">No conversations yet</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 flex flex-col max-h-full overflow-hidden">
          <!-- Chat Header -->
          <div v-if="selectedChatId" class="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 flex-shrink-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div v-if="chatHeader.avatar" class="relative flex-shrink-0">
                  <img :src="chatHeader.avatar" :alt="chatHeader.name" class="w-12 h-12 rounded-xl object-cover shadow-md" />
                </div>
                <div v-else class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-md" :class="chatHeader.bgColor">
                  <svg v-if="chatHeader.icon === 'staff'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <svg v-else-if="chatHeader.icon === 'admin'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span v-else class="text-sm">{{ chatHeader.icon }}</span>
                </div>
                <div class="min-w-0">
                  <h3 class="text-xl font-bold text-gray-900 truncate">{{ chatHeader.name }}</h3>
                  <p class="text-sm text-gray-500 truncate">{{ chatHeader.status }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-2 flex-shrink-0">
                <button @click="refreshMessages" class="p-3 text-gray-400 hover:text-blue-600 rounded-xl hover:bg-white/50 transition-all duration-200 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Messages Area - Scrollable -->
          <div class="flex-1 overflow-y-auto p-6 min-h-0 custom-scrollbar" ref="messagesContainer">
            <!-- Empty State -->
            <div v-if="!selectedChatId" class="h-full flex items-center justify-center text-gray-500">
              <div class="text-center">
                <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2 text-gray-900">Select a conversation</h3>
                <p class="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>

            <!-- Messages -->
            <div v-else class="space-y-4">
              <div v-for="message in messages" :key="message.id" class="flex message-bubble" :class="message.isMine ? 'justify-end' : 'justify-start'">
                <div class="max-w-xs lg:max-w-md">
                  <div
                    :class="[
                      'rounded-2xl px-4 py-3 break-words shadow-md transition-all duration-200 hover:shadow-lg',
                      message.isMine
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-md message-bubble sender'
                        : 'bg-white text-gray-900 rounded-bl-md message-bubble receiver border border-gray-200/50'
                    ]"
                  >
                    <!-- Sender Name for Group Messages -->
                    <div v-if="!message.isMine && selectedChatType === 'group' && message.senderName" class="text-xs font-semibold mb-2" :class="message.isMine ? 'text-blue-100' : 'text-blue-600'">
                      {{ message.senderName }}
                    </div>

                    <!-- Media Files -->
                    <div v-if="message.media_files && message.media_files.length > 0" class="mb-3">
                      <!-- Single Media -->
                      <div v-if="message.media_files.length === 1" class="mb-2">
                        <img
                          v-if="message.media_files[0].type === 'image'"
                          :src="message.media_files[0].url"
                          alt="Shared image"
                          class="max-w-xs rounded-xl cursor-pointer hover:opacity-90 transition-opacity shadow-md"
                          @click="openMediaModal(message.media_files[0].url, 'image')"
                          loading="lazy"
                        />
                        <video
                          v-else-if="message.media_files[0].type === 'video'"
                          :src="message.media_files[0].url"
                          class="max-w-xs rounded-xl cursor-pointer hover:opacity-90 transition-opacity shadow-md"
                          @click="openMediaModal(message.media_files[0].url, 'video')"
                          controls
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      
                      <!-- Multiple Media Grid -->
                      <div v-else class="grid gap-2 mb-2" :class="{
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
                            v-if="media.type === 'image'"
                            :src="media.url"
                            alt="Shared image"
                            class="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                            :class="{
                              'max-w-xs': message.media_files.length === 1,
                              'max-h-32': message.media_files.length > 1
                            }"
                            @click="openMediaModal(media.url, 'image')"
                            loading="lazy"
                          />
                          <video
                            v-else-if="media.type === 'video'"
                            :src="media.url"
                            class="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                            :class="{
                              'max-w-xs': message.media_files.length === 1,
                              'max-h-32': message.media_files.length > 1
                            }"
                            @click="openMediaModal(media.url, 'video')"
                          >
                            Your browser does not support the video tag.
                          </video>
                          
                          <!-- Show count overlay for 4+ media -->
                          <div
                            v-if="index === 3 && message.media_files.length > 4"
                            class="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center cursor-pointer backdrop-blur-sm"
                            @click="openMediaModal(media.url, media.type)"
                          >
                            <span class="text-white font-bold text-lg">+{{ message.media_files.length - 4 }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Message Content -->
                    <p v-if="message.content && !message.content.startsWith('📷') && !message.content.startsWith('🎥')" class="text-sm leading-relaxed">{{ message.content }}</p>
                    <p v-else-if="message.content.startsWith('📷') || message.content.startsWith('🎥')" class="text-sm italic opacity-75">{{ message.content }}</p>
                  </div>

                  <!-- Message Time -->
                  <div class="flex items-center mt-2" :class="message.isMine ? 'justify-end' : 'justify-start'">
                    <span class="text-xs text-gray-400 font-medium">{{ formatTime(message.created_at) }}</span>
                  </div>
                </div>
              </div>

              <!-- Typing Indicator -->
              <div v-if="isTyping" class="flex justify-start">
                <div class="bg-white rounded-2xl px-4 py-3 rounded-bl-md shadow-md border border-gray-200/50">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Media Preview Area -->
          <div v-if="mediaPreview.length > 0" class="p-4 border-t border-gray-200/50 bg-gray-50/80 backdrop-blur-sm flex-shrink-0">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-gray-700">
                Media Preview ({{ mediaPreview.length }} {{ mediaPreview.length === 1 ? 'file' : 'files' }})
              </h4>
              <button
                @click="clearMediaPreview"
                class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-white/50"
                :disabled="isUploadingMedia"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Media Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
              <div
                v-for="media in mediaPreview"
                :key="media.id"
                class="relative group"
              >
                <img
                  v-if="media.type === 'image'"
                  :src="media.url"
                  :alt="media.name"
                  class="w-full h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
                <video
                  v-else-if="media.type === 'video'"
                  :src="media.url"
                  class="w-full h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
                >
                  Your browser does not support the video tag.
                </video>
                
                <!-- Upload Progress Overlay -->
                <div
                  v-if="media.isUploading"
                  class="absolute inset-0 bg-black bg-opacity-60 rounded-xl flex items-center justify-center backdrop-blur-sm"
                >
                  <div class="text-white text-xs font-semibold">
                    {{ uploadProgress[media.id] || 0 }}%
                  </div>
                </div>
                
                <!-- Remove Button -->
                <button
                  @click="removeMediaPreview(media.id)"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  :disabled="media.isUploading"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <!-- Upload Status -->
                <div class="absolute bottom-1 left-1 right-1">
                  <div
                    v-if="media.isUploading"
                    class="bg-blue-500 text-white text-xs px-2 py-1 rounded-lg opacity-90 font-medium"
                  >
                    Uploading...
                  </div>
                  <div
                    v-else-if="media.uploaded_url"
                    class="bg-green-500 text-white text-xs px-2 py-1 rounded-lg opacity-90 font-medium"
                  >
                    Ready
                  </div>
                  <div
                    v-else
                    class="bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-90 font-medium"
                  >
                    Failed
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Status Info -->
            <div class="flex justify-between items-center">
              <div class="text-xs text-gray-500 font-medium">
                {{ mediaPreview.filter(media => media.uploaded_url).length }} of {{ mediaPreview.length }} ready to send
              </div>  
            </div>
          </div>

          <!-- Dynamic Message Input Area -->
          <div v-if="selectedChatId" class="border-t border-gray-200/50 bg-white/50 rounded-b-2xl" :style="{ minHeight: mediaPreview.length > 0 ? '120px' : '120px' }">
            <div class="p-4 h-full flex flex-col">
              <form @submit.prevent="sendMessage" class="flex items-center space-x-3 flex-1">
                <!-- Media Upload Buttons -->
                <div class="flex space-x-2 flex-shrink-0">
                  <!-- Image Upload -->
                  <label class="cursor-pointer text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-xl hover:bg-white/50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      @change="handleMediaUpload"
                      class="sr-only"
                      :disabled="isUploadingMedia"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </label>

                  <!-- Video Upload -->
                  <label class="cursor-pointer text-gray-400 hover:text-purple-500 transition-colors p-2 rounded-xl hover:bg-white/50">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      @change="handleMediaUpload"
                      class="sr-only"
                      :disabled="isUploadingMedia"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </label>
                </div>

                <!-- Message Input -->
                <div class="flex-1 min-w-0">
                  <textarea
                    v-model="newMessage"
                    @keydown.enter.exact.prevent="sendMessage"
                    @keydown.enter.shift.exact="newMessage += '\n'"
                    @input="sendTypingStatus"
                    placeholder="Type a message..."
                    rows="1"
                    class="w-full resize-none border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm text-sm"
                    style="height: 40px; min-height: 40px; max-height: 40px;"
                    :disabled="mediaPreview.length > 0 && mediaPreview.some(m => m.isUploading)"
                  ></textarea>
                </div>
                
                <!-- Send Button -->
                <button
                  type="submit"
                  :disabled="(!newMessage.trim() && !mediaPreview.length) || isSending || isUploadingMedia"
                  class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-2 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 shadow-lg"
                >
                  <svg v-if="!isSending" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </form>

              <!-- Enhanced Help Text -->
              <div class="mt-2 text-xs text-gray-500 font-medium flex-shrink-0">
                Press Enter to send, Shift+Enter for new line • 📷 Images & 🎥 Videos supported
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Media Modal -->
    <div
      v-if="selectedMedia.url"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
      @click="closeMediaModal"
    >
      <div class="relative max-w-5xl max-h-full p-6">
        <img
          v-if="selectedMedia.type === 'image'"
          :src="selectedMedia.url"
          alt="Full size image"
          class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
        />
        <video
          v-else-if="selectedMedia.type === 'video'"
          :src="selectedMedia.url"
          class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
          controls
          autoplay
        >
          Your browser does not support the video tag.
        </video>
        
        <button
          @click="closeMediaModal"
          class="absolute top-4 right-4 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all duration-200 shadow-lg"
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
import { useSupabaseClient, useSupabaseUser } from '#imports'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// Reactive data
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const selectedChatId = ref(null)
const selectedChatType = ref(null)
const messages = ref([])
const conversations = ref([])
const newMessage = ref('')
const isSending = ref(false)
const isTyping = ref(false)
const messagesContainer = ref(null)
const userProfile = ref(null)
const userRole = ref('donor')
const selectedMedia = ref({ url: null, type: null })

// Group chat data
const staffLastMessage = ref('')
const staffLastMessageTime = ref(null)
const adminLastMessage = ref('')
const adminLastMessageTime = ref(null)

// Enhanced media preview (supports both images and videos)
const mediaPreview = ref([])
const isUploadingMedia = ref(false)
const uploadProgress = ref({})

// Real-time subscriptions
let directMessageSubscription = null
let groupMessageSubscription = null
let typingChannel = null

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
        icon: getInitials(conv.name),
        status: 'Active now'
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
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const openMediaModal = (mediaUrl, mediaType) => {
  selectedMedia.value = { url: mediaUrl, type: mediaType }
}

const closeMediaModal = () => {
  selectedMedia.value = { url: null, type: null }
}

// Enhanced media upload handler (supports both images and videos)
const handleMediaUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return

  const validFiles = files.filter(file => {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (!isImage && !isVideo) {
      alert(`${file.name} is not a valid media file`)
      return false
    }
    
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // 50MB for video, 10MB for image
    if (file.size > maxSize) {
      alert(`${file.name} is too large. Maximum size is ${isVideo ? '50MB' : '10MB'}.`)
      return false
    }
    return true
  })

  if (!validFiles.length) return

  if (mediaPreview.value.length + validFiles.length > 5) {
    alert('You can only upload up to 5 media files at once')
    return
  }

  isUploadingMedia.value = true

  try {
    const uploadPromises = validFiles.map(async (file, index) => {
      const fileId = Date.now() + index
      const fileType = file.type.startsWith('image/') ? 'image' : 'video'
      
      const preview = {
        id: fileId,
        url: URL.createObjectURL(file),
        file: file,
        name: file.name,
        type: fileType,
        uploaded_url: null,
        isUploading: true
      }
      
      mediaPreview.value.push(preview)
      uploadProgress.value[fileId] = 0

      try {
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

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath)

        const previewIndex = mediaPreview.value.findIndex(p => p.id === fileId)
        if (previewIndex !== -1) {
          mediaPreview.value[previewIndex].uploaded_url = publicUrl
          mediaPreview.value[previewIndex].isUploading = false
        }

        return { success: true, fileId }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        mediaPreview.value = mediaPreview.value.filter(p => p.id !== fileId)
        delete uploadProgress.value[fileId]
        return { success: false, error, fileName: file.name }
      }
    })

    const results = await Promise.all(uploadPromises)
    
    const failedUploads = results.filter(r => !r.success)
    if (failedUploads.length > 0) {
      alert(`Failed to upload: ${failedUploads.map(f => f.fileName).join(', ')}`)
    }

  } catch (error) {
    console.error('Error in upload process:', error)
    alert('An error occurred during upload. Please try again.')
  } finally {
    isUploadingMedia.value = false
  }

  event.target.value = ''
}

const clearMediaPreview = () => {
  mediaPreview.value.forEach(preview => {
    if (preview.url) {
      URL.revokeObjectURL(preview.url)
    }
  })
  mediaPreview.value = []
  isUploadingMedia.value = false
  uploadProgress.value = {}
}

const removeMediaPreview = (mediaId) => {
  const index = mediaPreview.value.findIndex(p => p.id === mediaId)
  if (index !== -1) {
    const preview = mediaPreview.value[index]
    if (preview.url) {
      URL.revokeObjectURL(preview.url)
    }
    mediaPreview.value.splice(index, 1)
    delete uploadProgress.value[mediaId]
  }
}

// Fetch user profile and set userRole properly for admin group access
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
    // Keep original role for proper access control
    userRole.value = data?.role || 'donor'

    if (userRole.value === 'donor') {
      await loadDonorChats()
    } else {
      await loadStaffAdminConversations()
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

const loadDonorChats = async () => {
  try {
    // Load last staff message
    const { data: staffMsgs, error: staffErr } = await supabase
      .from('messages')
      .select('content, created_at')
      .eq('group_type', 'staff')
      .eq('message_type', 'group')
      .eq('receiver_id', user.value.id) // Only messages for this donor
      .order('created_at', { ascending: false })
      .limit(1)

    if (staffErr) throw staffErr
    if (staffMsgs && staffMsgs.length > 0) {
      staffLastMessage.value = staffMsgs[0].content
      staffLastMessageTime.value = staffMsgs[0].created_at
    }

    // Load last admin message
    const { data: adminMsgs, error: adminErr } = await supabase
      .from('messages')
      .select('content, created_at')
      .eq('group_type', 'admin')
      .eq('message_type', 'group')
      .eq('receiver_id', user.value.id) // Only messages for this donor
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

const loadStaffAdminConversations = async () => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, role')
      .neq('id', user.value.id)

    if (error) throw error

    const convs = await Promise.all(profiles.map(async (profile) => {
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
        isFromGroup: lastMsg?.[0]?.is_from_group || false
      }
    }))

    conversations.value = convs.sort((a, b) => {
      if (a.role === 'donor' && b.role !== 'donor') return -1
      if (b.role === 'donor' && a.role !== 'donor') return 1

      if (!a.lastMessageTime && !b.lastMessageTime) return 0
      if (!a.lastMessageTime) return 1
      if (!b.lastMessageTime) return -1
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    })

  } catch (error) {
    console.error('Error loading staff/admin conversations:', error)
  }
}

// Enhanced fetchMessages function to show staff shared conversations
const fetchMessages = async () => {
  if (!selectedChatId.value || !user.value?.id) return

  let data, error
  const currentUserId = user.value.id

  try {
    if (selectedChatType.value === 'group') {
      // Group chat logic for donors
      if (userRole.value === 'donor') {
        if (selectedChatId.value === 'staff') {
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

        } else if (selectedChatId.value === 'admin') {
          const { data: groupMsgs, error: groupError } = await supabase
            .from('messages')
            .select(`
              id, content, created_at, sender_id, is_admin_reply, receiver_id, media_files,
              sender:profiles!messages_sender_id_fkey(first_name, last_name, role)
            `)
            .eq('group_type', 'admin')
            .eq('message_type', 'group')
            .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
            .order('created_at', { ascending: true })

          if (groupError) throw groupError
          data = groupMsgs
        }
      } else {
        // Staff/admin viewing group chats
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
      // Check if the selected user is a donor (for staff viewing)
      const { data: selectedUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', selectedChatId.value)
        .single()

      const isStaffViewingDonor = (userRole.value === 'staff' || userRole.value === 'admin' || userRole.value === 'head_admin') && 
                                  selectedUserProfile?.role === 'donor'

      if (isStaffViewingDonor) {
        // Enhanced query: Get all direct messages with this donor from ANY staff/admin member
        const { data: directData, error: directError } = await supabase
          .from('messages')
          .select(`
            id, content, created_at, sender_id, receiver_id, is_from_group, group_context, media_files, is_staff_reply, is_admin_reply,
            sender:profiles!messages_sender_id_fkey(first_name, last_name, role, avatar_url)
          `)
          .eq('message_type', 'direct')
          .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedChatId.value}),and(sender_id.eq.${selectedChatId.value},receiver_id.eq.${currentUserId}),receiver_id.eq.${selectedChatId.value}`)
          .order('created_at', { ascending: true })

        if (directError) throw directError
        data = directData
      } else {
        // Regular direct message query
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
    }

    if (!data) {
      console.error('No data returned from query')
      return
    }

    messages.value = data.map(msg => {
      const senderName = msg.sender
        ? `${msg.sender.first_name || ''} ${msg.sender.last_name || ''}`.trim()
        : (msg.sender_id === currentUserId ? 'You' : 'Unknown')

      // Determine if this is the current user's message
      const isMine = msg.sender_id === currentUserId

      // For staff viewing donor conversations, show staff/admin names for others' messages
      let displaySenderName = senderName || 'Unknown'
      if (!isMine && (msg.is_staff_reply || msg.is_admin_reply)) {
        // This is a message from a staff/admin member
        const role = msg.sender?.role
        if (role === 'admin' || role === 'head_admin') {
          displaySenderName = `${senderName} (Admin)`
        } else if (role === 'staff') {
          displaySenderName = `${senderName} (Staff)`
        } else {
          displaySenderName = senderName
        }
      }

      return {
        ...msg,
        isMine: isMine,
        senderName: displaySenderName
      }
    })

    scrollToBottom()

  } catch (error) {
    console.error(`Error fetching ${selectedChatType.value} messages:`, error)
    messages.value = []
  }
}

// Enhanced sendMessage function with staff visibility (no DB changes needed)
const sendMessage = async () => {
  const hasMedia = mediaPreview.value.length > 0
  const hasText = newMessage.value.trim().length > 0
  
  if (!hasMedia && !hasText) return
  if (!selectedChatId.value || !user.value?.id || isSending.value) return

  const stillUploading = mediaPreview.value.some(media => media.isUploading)
  if (hasMedia && stillUploading) {
    alert('Please wait for all media to finish uploading')
    return
  }

  isSending.value = true
  const messageContent = newMessage.value.trim()
  newMessage.value = ''
  await nextTick()

  try {
    let messageData, error
    const currentUserId = user.value.id
    const currentUserRole = userProfile.value?.role

    const mediaFiles = hasMedia ? mediaPreview.value
      .filter(media => media.uploaded_url && !media.isUploading)
      .map(media => ({
        url: media.uploaded_url,
        type: media.type,
        name: media.name
      })) : null

    if (selectedChatType.value === 'group') {
      // Existing group chat logic remains unchanged
      if (userRole.value === 'donor' && selectedChatId.value === 'staff') {
        const { data: staffMembers, error: staffError } = await supabase
          .from('profiles')
          .select('id')
          .in('role', ['staff', 'admin', 'head_admin'])

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

      } else if (userRole.value === 'donor' && selectedChatId.value === 'admin') {
        const { data: adminMembers, error: adminError } = await supabase
          .from('profiles')
          .select('id')
          .in('role', ['admin', 'head_admin'])

        if (adminError) throw adminError

        const directMessages = adminMembers.map(admin => ({
          content: messageContent,
          sender_id: currentUserId,
          receiver_id: admin.id,
          message_type: 'direct',
          is_from_group: true,
          group_context: 'admin',
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
            group_type: 'admin',
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
      const { data: receiverProfile, error: receiverError } = await supabase
        .from('profiles')
        .select('role, first_name, last_name')
        .eq('id', selectedChatId.value)
        .single()

      if (receiverError) throw receiverError

      // Send the main direct message
      const { data: directData, error: directError } = await supabase
        .from('messages')
        .insert({
          content: messageContent,
          sender_id: currentUserId,
          receiver_id: selectedChatId.value,
          message_type: 'direct',
          is_staff_reply: (currentUserRole === 'staff' || currentUserRole === 'admin' || currentUserRole === 'head_admin') && receiverProfile.role === 'donor',
          ...(mediaFiles && { media_files: mediaFiles })
        })
        .select(`
          id, content, created_at, sender_id, receiver_id, is_staff_reply, media_files,
          sender:profiles!messages_sender_id_fkey(first_name, last_name, role, avatar_url)
        `)
        .single()

      if (directError) throw directError
      messageData = directData

      // NEW: If staff/admin is replying to donor, just send to donor and create group message
      if ((currentUserRole === 'staff' || currentUserRole === 'admin' || currentUserRole === 'head_admin') && receiverProfile.role === 'donor') {
        const isAdminReply = (currentUserRole === 'admin' || currentUserRole === 'head_admin')
        const groupType = isAdminReply ? 'admin' : 'staff'
        
        // Create group message for the donor to see in their group chat
        const { error: groupError } = await supabase
          .from('messages')
          .insert({
            content: messageContent,
            sender_id: currentUserId,
            receiver_id: selectedChatId.value,
            group_type: groupType,
            message_type: 'group',
            is_staff_reply: !isAdminReply,
            is_admin_reply: isAdminReply,
            ...(mediaFiles && { media_files: mediaFiles })
          })

        if (groupError) console.error('Error creating group message for staff/admin reply:', groupError)
      }
    }

    const msgToAdd = {
      ...messageData,
      isMine: true,
      senderName: userProfile.value
        ? `${userProfile.value.first_name || ''} ${userProfile.value.last_name || ''}`.trim()
        : 'You'
    }

    messages.value.push(msgToAdd)
    scrollToBottom()

    if (hasMedia) {
      clearMediaPreview()
    }

    const displayContent = hasMedia && !hasText ? 
      (mediaFiles.some(f => f.type === 'video') ? '🎥 Video' : '📷 Image') : 
      messageContent
    
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
    alert(`Failed to send message: ${error.message || 'Please try again.'}`)
  } finally {
    isSending.value = false
  }
}

// Enhanced real-time subscription to handle shared staff messages
const setupRealtimeListeners = () => {
  if (!user.value?.id) return

  // Clear existing subscriptions
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

  // Enhanced direct message subscription
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

        // Handle regular direct messages - no more shared message handling needed
        if (userRole.value === 'donor' &&
            selectedChatType.value === 'group' &&
            selectedChatId.value === 'staff' &&
            newMessageData.is_from_group) {
          await fetchMessages()
          return
        }

        if (selectedChatType.value === 'direct' && selectedChatId.value === newMessageData.sender_id) {
          // Fetch sender profile for direct messages
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name, role')
            .eq('id', newMessageData.sender_id)
            .single()

          let senderName = senderProfile 
            ? `${senderProfile.first_name || ''} ${senderProfile.last_name || ''}`.trim() 
            : 'Unknown'

          // Add role indicator for staff/admin messages
          if (newMessageData.is_staff_reply || newMessageData.is_admin_reply) {
            const role = senderProfile?.role
            if (role === 'admin' || role === 'head_admin') {
              senderName = `${senderName} (Admin)`
            } else if (role === 'staff') {
              senderName = `${senderName} (Staff)`
            }
          }

          messages.value.push({
            ...newMessageData,
            isMine: false,
            senderName: senderName,
            sender: senderProfile
          })
          scrollToBottom()
        } else if (selectedChatType.value === 'direct' && selectedChatId.value === newMessageData.receiver_id && 
                   (userRole.value === 'staff' || userRole.value === 'admin' || userRole.value === 'head_admin')) {
          // This handles when other staff/admin send messages to the same donor you're viewing
          await fetchMessages()
        } else {
          const conv = conversations.value.find(c => c.id === newMessageData.sender_id)
          if (conv) {
            conv.lastMessage = newMessageData.content
            conv.lastMessageTime = newMessageData.created_at
          } else if (userRole.value !== 'donor') {
            await loadStaffAdminConversations()
          }
        }
      }
    )
    .subscribe()

  // Group message subscription (unchanged)
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
        if (newMessageData.sender_id === user.value.id) return;

        if (userRole.value === 'donor') {
          if (newMessageData.group_type === 'staff' &&
              newMessageData.is_staff_reply && 
              newMessageData.receiver_id === user.value.id) {
            
            if (selectedChatType.value === 'group' && selectedChatId.value === 'staff') {
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
              staffLastMessage.value = newMessageData.content
              staffLastMessageTime.value = newMessageData.created_at
            }
          }

          if (newMessageData.group_type === 'admin' &&
              newMessageData.is_admin_reply && 
              newMessageData.receiver_id === user.value.id) {
            
            if (selectedChatType.value === 'group' && selectedChatId.value === 'admin') {
              const { data: senderProfile } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', newMessageData.sender_id)
                .single()

              messages.value.push({
                ...newMessageData,
                isMine: false,
                senderName: senderProfile ? `${senderProfile.first_name || ''} ${senderProfile.last_name || ''}`.trim() : 'Admin'
              })
              scrollToBottom()
            } else {
              adminLastMessage.value = newMessageData.content
              adminLastMessageTime.value = newMessageData.created_at
            }
          }
        } else {
          if (selectedChatType.value === 'group' && selectedChatId.value === newMessageData.group_type) {
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', newMessageData.sender_id)
              .single()

            messages.value.push({
              ...newMessageData,
              isMine: false,
              senderName: senderProfile ? `${senderProfile.first_name || ''} ${senderProfile.last_name || ''}`.trim() : 'User'
            })
            scrollToBottom()
          }
        }
      }
    )
    .subscribe()

  // Typing indicator (unchanged)
  typingChannel = supabase.channel('typing_indicator')
  typingChannel.on('broadcast', { event: 'typing' }, (payload) => {
    if (payload.payload.chatId === selectedChatId.value && payload.payload.senderId !== user.value.id) {
      isTyping.value = true;
      clearTimeout(window.typingTimer);
      window.typingTimer = setTimeout(() => {
        isTyping.value = false;
      }, 3000);
    }
  }).subscribe();
}

const sendTypingStatus = () => {
  if (typingChannel && selectedChatId.value) {
    typingChannel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { senderId: user.value.id, chatId: selectedChatId.value }
    })
  }
}

const refreshMessages = async () => {
  await fetchMessages()
}

watch(selectedChatId, async (newChatId, oldChatId) => {
  if (newChatId && newChatId !== oldChatId) {
    await fetchMessages();
    scrollToBottom();
  }
})

const selectChat = async (chatId) => {
  if (chatId.startsWith('group_')) {
    const groupType = chatId.replace('group_', '')
    selectedChatType.value = 'group'
    selectedChatId.value = groupType
  } else if (chatId.startsWith('direct_')) {
    const userId = chatId.replace('direct_', '')
    selectedChatType.value = 'direct'
    selectedChatId.value = userId
  }

  clearMediaPreview();
  await fetchMessages()
}

const scrollToBottom = async () => {
  if (messagesContainer.value) {
    await nextTick()
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(async () => {
  await fetchUserProfile()
  setupRealtimeListeners()
  
  if (userRole.value === 'donor' && staffLastMessage.value) {
    selectChat('group_staff');
  } else if (userRole.value === 'donor' && adminLastMessage.value) {
    selectChat('group_admin');
  } else if (userRole.value !== 'donor' && conversations.value.length > 0) {
    selectChat(`direct_${conversations.value[0].id}`);
  }
})

onUnmounted(() => {
  if (directMessageSubscription) {
    supabase.removeChannel(directMessageSubscription)
  }
  if (groupMessageSubscription) {
    supabase.removeChannel(groupMessageSubscription)
  }
  if (typingChannel) {
    supabase.removeChannel(typingChannel)
  }
  clearMediaPreview()
})
</script>

<style scoped>
/* Enhanced scrollbar styling */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #cbd5e0, #a0aec0);
  border-radius: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #a0aec0, #718096);
}

.min-h-0 {
  min-height: 0;
}

/* Enhanced animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-enter-active {
  animation: fadeInUp 0.3s ease-out;
}

/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
  background: linear-gradient(135deg, var(--tw-gradient-stops));
}

/* Enhanced shadow effects */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced button hover effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Media preview animations */
.media-preview-enter-active,
.media-preview-leave-active {
  transition: all 0.3s ease;
}

.media-preview-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.media-preview-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Modal backdrop blur */
.modal-backdrop {
  backdrop-filter: blur(8px);
}

/* Custom scrollbar for webkit browsers */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 0.5);
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #e5e7eb, #d1d5db);
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #d1d5db, #9ca3af);
}

/* Enhanced focus styles */
textarea:focus,
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Improved message bubble styles */
.message-bubble {
  position: relative;
}

.message-bubble::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
}

/* Sender bubble tail */
.message-bubble.sender::before {
  bottom: 0;
  right: -8px;
  border-left: 8px solid;
  border-bottom: 8px solid transparent;
  border-color: inherit;
}

/* Receiver bubble tail */
.message-bubble.receiver::before {
  bottom: 0;
  left: -8px;
  border-right: 8px solid;
  border-bottom: 8px solid transparent;
  border-color: inherit;
}

/* Glass morphism effects */
.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Conversation item hover effects */
.conversation-item {
  position: relative;
  overflow: hidden;
}

.conversation-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.conversation-item:hover::before {
  left: 100%;
}

/* Enhanced input field styling */
textarea {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(156, 163, 175, 0.3);
  backdrop-filter: blur(10px);
}

textarea:focus {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Media upload button effects */
.media-upload-btn {
  position: relative;
  overflow: hidden;
}

.media-upload-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  transition: all 0.3s ease;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.media-upload-btn:hover::after {
  width: 100px;
  height: 100px;
}

/* Chat bubble animation on send */
@keyframes bubblePop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.message-sent {
  animation: bubblePop 0.4s ease-out;
}

/* Loading shimmer effect */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 40px, #f0f0f0 80px);
  background-size: 200px;
  animation: shimmer 1.5s infinite;
}

/* Typing indicator animation */
@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.typing-dot {
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) { animation-delay: 0s; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

/* Media grid hover effects */
.media-grid-item {
  transition: all 0.3s ease;
}

.media-grid-item:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Progress bar styling */
.progress-bar {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 4px;
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  transition: width 0.3s ease;
}

/* Status badge animations */
.status-badge {
  animation: fadeInUp 0.3s ease-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .message-bubble {
    max-width: 85vw;
  }
  
  .media-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .conversation-sidebar {
    max-height: 40vh;
  }
}

/* Dark mode support (if needed) */
@media (prefers-color-scheme: dark) {
  .glass-effect {
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .message-bubble {
    border: 2px solid currentColor;
  }
  
  button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>