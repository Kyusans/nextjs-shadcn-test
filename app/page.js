"use client";
import { toast } from "sonner";
import Login from "./login";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { ModeToggle } from "@/components/ui/mode-toggle";



export default function Home() {

  useEffect(() => {
    if (secureLocalStorage.getItem("url") !== "http://localhost/delmonte/api/") {
      secureLocalStorage.setItem("url", "http://localhost/delmonte/api/");
    }
  }, []);

  return (
    <>
      <header>
        <div className="absolute right-4 top-4">
          <ModeToggle />
        </div>
      </header>
      <main className="flex items-center justify-center h-screen p-24">
        <Login />
      </main>
    </>
  );
}
