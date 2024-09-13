"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

function Login() {
  return (
    <button
      onClick={() => signIn("google")}
      className="mt-2 flex items-center p-3 font-bold text-lg border-2 border-black rounded-lg "
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
  );
}

export default Login;
