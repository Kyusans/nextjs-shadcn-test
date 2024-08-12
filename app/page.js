"use client";
import { toast } from "sonner";
import Login from "./login";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";



export default function Home() {

  useEffect(() => {
    if (secureLocalStorage.getItem("url") !== "http://localhost/delmonte/api/") {
      secureLocalStorage.setItem("url", "http://localhost/delmonte/api/");
    }
  }, []);

  return (
    <main className="flex items-center justify-center h-screen p-24">
      <Login />
    </main>
  );
}
