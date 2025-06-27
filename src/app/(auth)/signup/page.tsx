'use client'
import * as z  from "zod"
import { signupValidation } from "@/validationSchemas/signupValidation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDebounceCallback } from 'usehooks-ts'
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
import { Loader2 } from "lucide-react"
import Link from "next/link"


export default function SignupForm(){
  const [userName, setUserName] = useState('')
  const [isCheckingUserName, setIsCheckingUserName] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userNameMessage, setUserNameMessage] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const debounced = useDebounceCallback(setUserName, 500)

    const form = useForm<z.infer<typeof signupValidation>>({
        resolver: zodResolver(signupValidation),
        defaultValues: {
          userName: "",
          email : "",
          password : ""
        }
    })

    useEffect(() => {
      const checkUserNameUnique = async() => {
          if(userName){
            setIsCheckingUserName(true);
            setUserNameMessage('');
            try {
              const response = await axios.get(`/api/username-check-unique?username=${userName}`);
              console.log(response)
              setUserNameMessage(response.data.message);
            } catch (error) {
              setUserNameMessage('error while checking username')
            } finally{
              setIsCheckingUserName(false)
            }
          }
      }
      checkUserNameUnique();
    }, [userName])

    const onSubmit = async(data : z.infer<typeof signupValidation>) => {
      setIsSubmitting(true)

      try {
        const response = await axios.post('/api/sign-up',data);
        toast({
          title: "success",
          description: response.data.message,
        })
        router.replace(`/verify/${userName}`);
      } catch (error) {
        console.error('there was a problem while sign up')
        toast({
          title: "failed",
          description: 'there was a problem while sign up'
        })
      } finally{
        setIsSubmitting(false)
      }
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join True Feedback
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UserName</FormLabel>
                    <Input placeholder="username" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                    />
                    {isCheckingUserName && <Loader2 className="animate-spin" />}
                    {!isCheckingUserName && userNameMessage && (
                      <p
                        className={`text-sm ${
                          userNameMessage === 'Username is unique'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {userNameMessage}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EMAIL</FormLabel>
                    <Input placeholder="email" 
                    {...field}
                    />
                    <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
                    <FormMessage />
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
              <Button type="submit" disabled={isSubmitting} className='w-full'>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Already a member?{' '}
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
}
