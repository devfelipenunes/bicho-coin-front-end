"use client";

import { useRouter } from "next/navigation";

export default function Games() {
  const router = useRouter();

  return (
    <div className="text-black bg-white flex justify-center items-center flex-col space-y-5 p-[20px]">
      <p>Nosso Jogos</p>
      <div>
        <div
          onClick={() => {
            router.push("/Roulette");
          }}
          className="w-[100px] h-[100px] bg-blue-500 flex justify-center items-center"
        >
          <p>Roletinha do Bicho</p>
        </div>
      </div>
    </div>
  );
}
