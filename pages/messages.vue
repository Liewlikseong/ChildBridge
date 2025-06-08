<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="bg-white border-b border-neutral-200 px-4 py-4">
      <div class="container-custom">
        <h1 class="text-2xl font-bold text-neutral-900">Messages</h1>
        <p class="text-neutral-600 mt-1">Connect with our team and community</p>
      </div>
    </div>

    <div class="container-custom py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        
        <div class="lg:col-span-1 bg-white rounded-lg shadow-sm border border-neutral-200 flex flex-col">
          <div class="p-4 border-b border-neutral-200">
            <h2 class="text-lg font-semibold text-neutral-900">Conversations</h2>
          </div>
          
          <div class="flex-1 overflow-y-auto">
            <div 
              v-if="userRole === 'donor'"
              @click="selectChat('group_staff')"
              :class="[
                'p-4 border-b border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors',
                selectedChatType === 'group' && selectedChatId === 'staff' ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
              ]"
            >
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
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
                <div class="flex flex-col items-end">
                  <span v-if="staffLastMessageTime" class="text-xs text-neutral-400">
                    {{ formatTime(staffLastMessageTime) }}
                  </span>
                </div>
              </div>
            </div>

            <div 
              v-if="userRole === 'donor'"
              @click="selectChat('group_admin')"
              :class="[
                'p-4 border-b border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors',
                selectedChatType === 'group' && selectedChatId === 'admin' ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
              ]"
            >
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
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
                <div class="flex flex-col items-end">
                  <span v-if="adminLastMessageTime" class="text-xs text-neutral-400">
                    {{ formatTime(adminLastMessageTime) }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="userRole === 'staff' || userRole === 'admin'" class="space-y-0">
              <div 
                v-for="conversation in conversations" 
                :key="conversation.id"
                @click="selectChat(`direct_${conversation.id}`)"
                :class="[
                  'p-4 border-b border-neutral-100 cursor-pointer hover:bg-neutral-50 transition-colors',
                  selectedChatType === 'direct' && selectedChatId === conversation.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
                ]"
              >
                <div class="flex items-center space-x-3">
                  <div class="relative">
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
                    <div class="flex items-center space-x-2">
                      <h3 class="font-medium text-neutral-900">{{ conversation.name }}</h3>
                      <span 
                        v-if="conversation.role" 
                        :class="[
                          'text-xs px-2 py-1 rounded-full font-medium',
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
                  <div class="flex flex-col items-end">
                    <span v-if="conversation.lastMessageTime" class="text-xs text-neutral-400">
                      {{ formatTime(conversation.lastMessageTime) }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="conversations.length === 0" class="p-6 text-center text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No conversations yet</p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-neutral-200 flex flex-col">
          <div v-if="selectedChatId" class="p-4 border-b border-neutral-200 bg-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div v-if="chatHeader.avatar" class="relative">
                  <img :src="chatHeader.avatar" :alt="chatHeader.name" class="w-10 h-10 rounded-full object-cover" />
                </div>
                <div v-else class="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" :class="chatHeader.bgColor">
                  <svg v-if="chatHeader.icon === 'staff'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <svg v-else-if="chatHeader.icon === 'admin'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span v-else>{{ chatHeader.icon }}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-neutral-900">{{ chatHeader.name }}</h3>
                  <p class="text-sm text-neutral-500">{{ chatHeader.status }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button @click="refreshMessages" class="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4" ref="messagesContainer">
            <div v-if="!selectedChatId" class="h-full flex items-center justify-center text-neutral-500">
              <div class="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 class="text-lg font-medium mb-2">Select a conversation</h3>
                <p>Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>

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
                    <div v-if="!message.isMine && selectedChatType === 'group' && message.senderName" class="text-xs font-medium mb-1 opacity-75">
                      {{ message.senderName }}
                    </div>
                    <p class="text-sm">{{ message.content }}</p>
                  </div>
                  
                  <div class="flex items-center mt-1" :class="message.isMine ? 'justify-end' : 'justify-start'">
                    <span class="text-xs text-neutral-400">{{ formatTime(message.created_at) }}</span>
                  </div>
                </div>
              </div>

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

          <div v-if="selectedChatId" class="p-4 border-t border-neutral-200 bg-white">
            <form @submit.prevent="sendMessage" class="flex items-end space-x-3">
              <div class="flex-1">
                <textarea
                  v-model="newMessage"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.enter.shift.exact="newMessage += '\n'"
                  @input="sendTypingStatus"
                  placeholder="Type a message..."
                  rows="1"
                  class="w-full resize-none border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  style="min-height: 40px; max-height: 120px;"
                ></textarea>
              </div>
              <button
                type="submit"
                :disabled="!newMessage.trim() || isSending"
                class="bg-primary-500 text-white rounded-lg p-2 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg v-if="!isSending" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </form>
            <div class="mt-2 text-xs text-neutral-500">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
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

// Group chat specific data for donors
const staffLastMessage = ref('')
const staffLastMessageTime = ref(null)
const adminLastMessage = ref('')
const adminLastMessageTime = ref(null)

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
            id, content, created_at, sender_id, is_staff_reply, receiver_id,
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
            id, content, created_at, sender_id,
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
          id, content, created_at, sender_id, receiver_id, is_from_group, group_context,
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

// Send a message
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChatId.value || !user.value?.id || isSending.value) return

  isSending.value = true
  const messageContent = newMessage.value.trim()
  newMessage.value = '' // Clear input immediately
  await nextTick()
  resizeTextarea()

  try {
    let messageData, error
    const currentUserId = user.value.id

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
          group_context: 'staff'
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
          })
          .select(`
            id, content, created_at, sender_id,
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
          })
          .select(`
            id, content, created_at, sender_id,
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
          is_staff_reply: userRole.value === 'staff' && receiverProfile.role === 'donor'
        })
        .select(`
          id, content, created_at, sender_id, receiver_id, is_staff_reply,
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
            is_staff_reply: true
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

    // Update last message in chat lists
    if (selectedChatType.value === 'group') {
      if (selectedChatId.value === 'staff') {
        staffLastMessage.value = messageContent
        staffLastMessageTime.value = msgToAdd.created_at
      } else if (selectedChatId.value === 'admin') {
        adminLastMessage.value = messageContent
        adminLastMessageTime.value = msgToAdd.created_at
      }
    } else if (selectedChatType.value === 'direct') {
      const conv = conversations.value.find(c => c.id === selectedChatId.value)
      if (conv) {
        conv.lastMessage = messageContent
        conv.lastMessageTime = msgToAdd.created_at
      }
    }

  } catch (error) {
    console.error('Error sending message:', error)
    alert('Failed to send message. Please try again.')
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
})
</script>

