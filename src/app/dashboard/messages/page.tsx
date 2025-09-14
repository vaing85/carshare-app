'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Send, ArrowLeft, Phone, Mail, MapPin, Star } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import Link from 'next/link'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  isRead: boolean
}

interface Conversation {
  id: string
  otherUser: {
    id: string
    name: string
    avatar: string
    isHost: boolean
  }
  car?: {
    id: string
    make: string
    model: string
    year: number
    image: string
  }
  lastMessage: Message
  unreadCount: number
  messages: Message[]
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    // Simulate loading conversations
    setTimeout(() => {
      setConversations([
        {
          id: '1',
          otherUser: {
            id: '2',
            name: 'John Smith',
            avatar: '/api/placeholder/40/40',
            isHost: true,
          },
          car: {
            id: '1',
            make: 'Toyota',
            model: 'Camry',
            year: 2022,
            image: '/api/placeholder/60/40',
          },
          lastMessage: {
            id: '1',
            content: 'Thanks for the great rental! The car was perfect.',
            senderId: '2',
            receiverId: session.user?.id || '',
            createdAt: '2024-01-10T10:30:00Z',
            isRead: false,
          },
          unreadCount: 1,
          messages: [
            {
              id: '1',
              content: 'Hi! I\'m interested in renting your Toyota Camry. Is it available this weekend?',
              senderId: session.user?.id || '',
              receiverId: '2',
              createdAt: '2024-01-09T14:20:00Z',
              isRead: true,
            },
            {
              id: '2',
              content: 'Yes, it\'s available! The car is in excellent condition and ready to go.',
              senderId: '2',
              receiverId: session.user?.id || '',
              createdAt: '2024-01-09T14:25:00Z',
              isRead: true,
            },
            {
              id: '3',
              content: 'Perfect! I\'ll book it for Saturday and Sunday.',
              senderId: session.user?.id || '',
              receiverId: '2',
              createdAt: '2024-01-09T14:30:00Z',
              isRead: true,
            },
            {
              id: '4',
              content: 'Thanks for the great rental! The car was perfect.',
              senderId: '2',
              receiverId: session.user?.id || '',
              createdAt: '2024-01-10T10:30:00Z',
              isRead: false,
            },
          ],
        },
        {
          id: '2',
          otherUser: {
            id: '3',
            name: 'Sarah Johnson',
            avatar: '/api/placeholder/40/40',
            isHost: false,
          },
          car: {
            id: '2',
            make: 'Honda',
            model: 'Civic',
            year: 2021,
            image: '/api/placeholder/60/40',
          },
          lastMessage: {
            id: '5',
            content: 'When can I pick up the car?',
            senderId: '3',
            receiverId: session.user?.id || '',
            createdAt: '2024-01-09T16:45:00Z',
            isRead: true,
          },
          unreadCount: 0,
          messages: [
            {
              id: '5',
              content: 'When can I pick up the car?',
              senderId: '3',
              receiverId: session.user?.id || '',
              createdAt: '2024-01-09T16:45:00Z',
              isRead: true,
            },
          ],
        },
      ])
      setLoading(false)
    }, 1000)
  }, [session, router])

  useEffect(() => {
    if (selectedConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedConversation?.messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: session?.user?.id || '',
      receiverId: selectedConversation.otherUser.id,
      createdAt: new Date().toISOString(),
      isRead: false,
    }

    // Add message to conversation
    setSelectedConversation(prev => ({
      ...prev!,
      messages: [...prev!.messages, message],
      lastMessage: message,
    }))

    // Update conversations list
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: message, unreadCount: 0 }
          : conv
      )
    )

    setNewMessage('')

    // Add notification for recipient
    addNotification({
      type: 'message',
      title: 'New Message',
      message: `You have a new message from ${session?.user?.name}`,
      userId: selectedConversation.otherUser.id,
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Communicate with hosts and renters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 text-left hover:bg-gray-50 ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={conversation.otherUser.avatar}
                      alt={conversation.otherUser.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.otherUser.name}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      {conversation.car && (
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.car.year} {conversation.car.make} {conversation.car.model}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.content}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(conversation.lastMessage.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedConversation.otherUser.avatar}
                        alt={selectedConversation.otherUser.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedConversation.otherUser.name}
                        </h3>
                        {selectedConversation.car && (
                          <p className="text-sm text-gray-600">
                            {selectedConversation.car.year} {selectedConversation.car.make} {selectedConversation.car.model}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Mail className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto max-h-96">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === session?.user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === session?.user?.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-md transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
