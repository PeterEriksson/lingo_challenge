"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

function Login() {
  return (
    <div className="bg-white rounded-xl h-screen flex flex-col items-center justify-center text-center">
      {/* <h1 className="uppercase tracking-wide text-4xl opacity-80">
        lingo challenge
      </h1> */}
      <Image alt="logo" src={"/logo1.png"} width={400} height={400} />
      <h3 className="-mt-2 font-bold text-gray-500/90 mb-5">
        Exercises for intermediate{" "}
        <span className=" text-main ">language learners</span>
      </h3>
      <button
        onClick={() => signIn("google")}
        className="flex items-center p-4 font-bold text-lg animate-pulse  border-2 border-black rounded-lg "
      >
        <Image
          src={"/g_icon.png"}
          alt="google-icon"
          width={32}
          height={32}
          className="mr-1"
        />
        <p className="text-black">Sign in with Google</p>
      </button>
    </div>
  );
}

export default Login;
