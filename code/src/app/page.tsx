import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <div
      className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/wallpaper.jpeg')" }}
    >
      {/* Camada branca translúcida */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
      ></div>

      {/* Conteúdo com logo no topo central */}
      <div className="relative z-10 flex flex-col items-center h-full text-gray-900">
        {/* Logo centralizada no topo */}
        <div className="w-full flex justify-center">
          <img src="/Logo.png" alt="Logo do restaurante" className="h-100" />
        </div>
      </div>
    </div>
  );
}
