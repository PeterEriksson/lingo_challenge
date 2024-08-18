import Image from "next/image";
import data from "../data.json";
import LanguageSelect from "@/components/LanguageSelect";
import NewChallenge from "@/components/NewChallenge";

export default function HomePage() {
  return (
    <div className="text-black flex flex-col items-center ///h-screen px-2// ">
      <Image alt="logo" src={"/logo1.png"} width={400} height={400} />
      <h2 className="text-lg font-bold text-gray-500/90 -mt-3">
        Exercises for{" "}
        <span className=" text-main ">intermediate language learners</span>
      </h2>
      {/* test    jklsjfdklö dsjfdklsöj sfdaklö fdsfsdfds
       */}

      <LanguageSelect />
      <div className="grid grid-cols-2 gap-7 p-4 mt-6">
        {data.challenges.map((challenge, index) => (
          <NewChallenge key={index} challenge={challenge} index={index} />
        ))}
      </div>
    </div>
  );
}
