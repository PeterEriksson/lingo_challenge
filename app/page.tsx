import Image from "next/image";
import data from "../data.json";
import LanguageSelect from "@/components/LanguageSelect";
import NewChallenge from "@/components/NewChallenge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Login from "@/components/Login";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="text-black flex flex-col items-center ///h-screen px-2// ">
      <Image
        className="-mt-[9px]"
        alt="logo"
        src={"/logo.png"}
        width={400}
        height={100}
      />
      <h2 className="text-lg font-bold text-gray-500/90 -mt-8">
        Exercises for{" "}
        <span className=" text-main ">intermediate language learners</span>
      </h2>
      <h3 className=" font-bold text-gray-500/90">Can you beat them all?</h3>

      {session ? <LanguageSelect /> : <Login />}

      <div className="grid grid-cols-2 gap-7 p-4 mt-6">
        {data.challenges.map((challenge, index) => (
          <NewChallenge key={index} challenge={challenge} index={index} />
        ))}
      </div>
    </div>
  );
}
