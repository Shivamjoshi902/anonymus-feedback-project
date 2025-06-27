'use client'
import * as z  from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from "next/link"
import { signInValidation } from "@/validationSchemas/signInValidation"
import { signIn } from 'next-auth/react';

export default function SignupForm(){

  const router = useRouter()
  const { toast } = useToast()

    const form = useForm<z.infer<typeof signInValidation>>({
        resolver: zodResolver(signInValidation),
        defaultValues: {
          identifier : "",
          password : ""
        }
    })

    const onSubmit = async(data : z.infer<typeof signInValidation>) => {
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            });
            if(result?.error){
                toast({
                    title: 'Login Failed',
                    description: 'Incorrect username or password',
                    variant: 'destructive',
                  });
            }
            if (result?.url) {
                router.replace('/dashboard');
            }
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join True Feedback
            </h1>
            <p className="mb-4">Signin to start your anonymous adventure</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EMAIL/USERNAME</FormLabel>
                    <Input placeholder="email/username" 
                    {...field}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PASSWORD</FormLabel>
                    <Input type="password" placeholder="password"
                    {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit"  className='w-full'>
                submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
}
