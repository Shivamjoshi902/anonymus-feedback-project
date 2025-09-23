'use client'
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

const Dashboard = () =>{
    const router = useRouter()
    return(
        <Button
            size="lg"
            onClick={() => router.push('/dashboard')}
        >
            Go To Dashboard
        </Button>
    )
}

export default  Dashboard