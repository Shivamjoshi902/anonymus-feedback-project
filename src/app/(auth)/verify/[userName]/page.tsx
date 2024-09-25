'use client'

import * as z  from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react'
import { verifyValidation } from "@/validationSchemas/verifyValidation"

function verificationPage() {
    const params = useParams<{userName : string}>()
    const router = useRouter()
    const {toast} = useToast();
    const form = useForm<z.infer<typeof verifyValidation>>({
        resolver: zodResolver(verifyValidation)
    })

    const onSubmit = async(data :z.infer<typeof verifyValidation> ) => {
        try {
            const response = await axios.post('/api/verify-account',{
                userName : params.userName,
                code : data.verifyCode
            });

            toast({
                title: "success",
                description: response.data.message,
            })

            router.replace('/sign-in')
        } catch (error) {
            console.error('there was a problem while code verification')
            toast({
            title: "failed",
            description: 'there was a problem while code verification',
            variant: 'destructive'
        })
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb-4">Enter the verification code sent to your email</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="verifyCode"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>VERIFY CODE</FormLabel>
                            <Input placeholder="verify code" 
                            {...field}
                            />
                        </FormItem>
                        )}
                    />
                    <Button type="submit">Verify</Button>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default verificationPage