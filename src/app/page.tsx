// src/app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import MessagesCarousel from "@/components/MessagesCarousel";
import axios from "axios";
import { cookies } from "next/headers";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const base_url = process.env.NEXT_PUBLIC_BASE_URL
  const response = await fetch(`${base_url}/api/get-messages`, {
    headers: {
      Cookie: cookies().toString(),
    },
    cache: "no-store",
  });

  const data = await response.json();
  const messages = data.messages

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {session?.user ? (
          <MessagesCarousel messages={messages} />
        ) : (
          <p className="text-gray-400">Please login to view feedback messages.</p>
        )}
      </main>
      {/* Footer */} 
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 True Feedback. All rights reserved. 
      </footer>
    </>
  );
}
