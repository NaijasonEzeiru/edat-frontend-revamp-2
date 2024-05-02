import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { type ReactNode } from "react";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="w-screen md:w-[98vw] relative">
      <div className="hidden md:block md:w-[49vw] bg-[#00327f] fixed h-screen">
        <div className="relative z-20 h-full flex items-center justify-center">
          <Image src="/pngegg.webp" width={1280} height={843} alt="" />
        </div>
      </div>
      <div className="w-screen md:w-[49vw] md:float-right min-h-screen py-6 px-3 sm:px-10 lg:px-20 flex justify-between gap-6 flex-col overflow-hidden">
        <div className="md:self-end">
          <Image
            src="/edat_logo_b@2x.png"
            alt="e-dat"
            width={100}
            height={30}
          />
        </div>
        {children}
        {/* <div className="flex justify-between gap-5 mt-8">
          <Link
            href=""
            className="underline underline-offset-4 hover:text-primary text-m"
          >
            Privacy Policy
          </Link>
        </div> */}
        <p className="text-center text-xs mt-8 text-opacity-65">
          {"© EDAT, All Rights Reserved"}
        </p>
      </div>
      <Toaster />
    </main>
  );
}

export default AuthLayout;
