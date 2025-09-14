'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'

export interface Notification {
  id: string
  type: 'booking' | 'message' | 'review' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: Date
  userId: string
  data?: any
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  removeNotification: (notificationId: string) => void
  socket: Socket | null
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (session?.user?.id) {
      // Temporarily disable WebSocket for development
      // TODO: Implement proper WebSocket server
      console.log('WebSocket disabled for development')
      
      // Simulate some notifications for testing
      setTimeout(() => {
        addNotification({
          type: 'system',
          title: 'Welcome to CarShare!',
          message: 'You can now browse cars and start booking.',
          userId: session.user.id,
        })
      }, 2000)
    }
  }, [session?.user?.id])

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      read: false,
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        socket,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
