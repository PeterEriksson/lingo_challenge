"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  DocumentData,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { db } from "@/firebase";
import { getSpecialLetters } from "@/lib/getSpecialLetters";
import { useLanguageStringStore } from "@/store/store";
import { useCollectionData } from "react-firebase-hooks/firestore";

type Props = {
  challenge: Challenge;
  index: number;
};

function NewChallenge({ challenge, index }: Props) {
  const [buttonPressed, setButtonPressed] = React.useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { selectedLanguageString } = useLanguageStringStore();

  const specialLetters = getSpecialLetters(selectedLanguageString);

  const createNewChallenge = async (challenge: Challenge) => {
    if (!session) return;

    if (selectedLanguageString === "") {
      toast("please select a language", {
        icon: "🌎",
      });
      return;
    }

    const doc = await addDoc(
      collection(db, "users", session?.user?.email!, "challenges"),
      {
        userId: session?.user?.email!,
        createdAt: serverTimestamp(),
        title: challenge.title,
        description: challenge.description,
        tips: challenge.tips,
        startingLives: 5,
        livesLeft: 5,
        completed: false,
        minChars: 75,
        maxChars: 350,
        language: selectedLanguageString,
        specialLetters: specialLetters,
      }
    );

    router.push(`/challenge/${doc.id}`);
  };

  const getTiltClass = (index: number) => {
    const tiltClasses = [
      "!rotate-[-5deg]",
      "rotate-[5deg]",
      "!rotate-[-10deg]",
      "!rotate-[10deg]",
    ];
    return tiltClasses[index % tiltClasses.length];
  };

  const [challenges, loading, error] = useCollectionData(
    session &&
      query(
        collection(db, "users", session.user?.email!, "challenges"),
        orderBy("createdAt", "asc")
      )
  );

  const passed = () =>
    challenges?.some(
      (_challenge) =>
        challenge.title === _challenge.title &&
        ["Good", "Ok"].includes(_challenge.grade)
    ) || false;

  return (
    <button
      onMouseDown={() => setButtonPressed(true)}
      onMouseUpCapture={() => setButtonPressed(false)}
      onMouseLeave={() => setButtonPressed(false)}
      onClick={() => createNewChallenge(challenge)}
      key={index}
      className={`flex items-center justify-center ${
        buttonPressed && "!opacity-85 !scale-[0.995]"
      } bg-main p-8 text-xl font-bold text-white text-center rounded-lg shadow-lg transition ease-in-out duration-300 transform ${getTiltClass(
        index
      )} ${
        selectedLanguageString === ""
          ? "opacity-70 cursor-default hover:scale-[1.025]"
          : "opacity-100 hover:scale-105"
      }
      `}
    >
      {challenge?.title} {passed() && " ✅"}
    </button>
  );
}

export default NewChallenge;
