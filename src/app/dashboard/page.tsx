'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { apiResponse } from '@/helpers/apiResponse'
import { Message } from '@/models/user.model'
import { acceptMessageValidation } from '@/validationSchemas/acceptMessageValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const {toast} = useToast()

  const handleDeleteMessage = (messageId : string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  const {data : session} = useSession()

  const form = useForm({
    resolver : zodResolver(acceptMessageValidation)
  })

  const {register, watch, setValue} = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessagesStatus = useCallback(async () => {
      setIsSwitchLoading(true);
      try {
        const response = await axios.get('/api/accept-messages')
        setValue('acceptMessages', response.data.isAcceptingMessage)
      } catch (error) {
        console.log(error)
        const axiosError = error as AxiosError<apiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ??
            'Failed to fetch message settings',
          variant: 'destructive',
        });
      }
      finally{
        setIsSwitchLoading(false);
      }
    }, [setValue])

    const fetchMessages = useCallback( async (refresh : boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get('/api/get-messages');
        setMessages(response.data.messages);
        console.log(response.data.message)
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
          const axiosError = error as AxiosError<apiResponse>;
          toast({
            title: 'Error',
            description:
              axiosError.response?.data.message ?? 'Failed to fetch messages',
            variant: 'destructive',
          });
      }finally{
        setIsLoading(false)
      }
    }, [setIsLoading, setMessages])

    useEffect(() => {
      if(!session || !session.user)return
      fetchAcceptMessagesStatus();
      fetchMessages();
    }, [session,fetchAcceptMessagesStatus,fetchMessages,setValue])

    const handleSwitchChange = async () => {
      try {
        const response = await axios.post('/api/accept-messages',{
          acceptMessageStatus : !acceptMessages
        })
        setValue('acceptMessages', !acceptMessages)
        toast({
          title: response.data.message,
          variant: 'default',
        });
      } catch (error) {
        const axiosError = error as AxiosError<apiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ??
            'Failed to update message settings',
          variant: 'destructive',
        });
      }
    }

    if(!session || !session.user){
      return(
        <div></div>
      );
    }

    const {userName} = session.user as User

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${userName}`;

    const copyToClipboard = () => {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: 'URL Copied!',
        description: 'Profile URL has been copied to clipboard.',
      });
    };
    
    return (
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
  
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>
  
        <div className="mb-4">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>
        <Separator />
  
        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          { 
            messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    );
}

export default Dashboard