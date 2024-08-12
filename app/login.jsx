"use client";
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useEffect, useState } from "react"
import Spinner from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner";
import secureLocalStorage from "react-secure-storage";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "This field is required",
  }),
  password: z.string().min(1, {
    message: "This field is required",
  }),
})



export default function Home() {
  const router = useRouter();
  // isLoading para rani sa loading2 sa button hehe
  const [isLoading, setIsloading] = useState(false);
  // while kaning loading nako kay ang whole page
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(33);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })


  const onSubmit = async (values) => {
    setIsloading(true);
    try {
      const url = secureLocalStorage.getItem("url") + "users.php";
      const formData = new FormData();
      formData.append("operation", "login");
      formData.append("json", JSON.stringify(values));
      const res = await axios.post(url, formData);
      console.log("res mo to, " + JSON.stringify(res));
      if (res.data === 0) {
        toast.error("Invalid username or password");
      } else {
        setLoading(true);
        toast.success("Login successful");
        secureLocalStorage.setItem("userId", res.data.user_id);
        secureLocalStorage.setItem("userLevel", res.data.user_level);
        setTimeout(() => {
          setProgress(96)

        }, 500)
        if (res.data.user_level === 100) {
          setTimeout(() => {
            router.push("/admin");
          }, 500)
        } else {
          setTimeout(() => {
            router.push("/dashboard");
          }, 500)
        }
      }
    } catch (error) {
      toast.error("Network error")
      console.log("error ni login: " + error);
    } finally {
      setIsloading(false);
    }
  }

  useEffect(() => {
    if (secureLocalStorage.getItem("userLevel") === 100) {
      router.push("/admin");
    } else if (secureLocalStorage.getItem("userLevel") === 90) {
      router.push("/dashboard");
    } else {
      setProgress(95);
      setTimeout(() => {
        setLoading(false);
        setProgress(33);
      }, 500);
    }
  }, [router])

  return (
    <div className="flex justify-center items-center h-screen">
      {loading ? (
        <>
          <Progress value={progress} className="w-80 md:w-96" />
        </>
      ) : (
        <>
          <Form {...form}>
            <Card className="w-80 md:w-96" shadow="lg">
              <CardHeader>
                <CardTitle className="text-center text-3xl">Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" autoFocus {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-center">
                    <Button type="submit" className="w-full" disabled={isLoading}> {isLoading && <Spinner />} Login</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </Form>
        </>
      )
      }
    </div>
  )
}
