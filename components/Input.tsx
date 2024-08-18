"use client";

import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import React from "react";
import toast from "react-hot-toast";
import { useDocumentData } from "react-firebase-hooks/firestore";
import useCountUp from "@/hooks/useCountup";
import WordHelpCall from "./WordHelpCall";
import {
  ArrowDownCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import InputProgress from "./InputProgress";

type Props = {
  challengeId: string;
};

function Input({ challengeId }: Props) {
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { data: session } = useSession();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const seconds = useCountUp();
  const model = "gpt-3.5-turbo"; //recommended in docs...
  const [wordsToHighlight, setWordsToHighlight] = React.useState<string[]>([
    "test",
  ]);

  let successSound: HTMLAudioElement | null = null;
  let failSound: HTMLAudioElement | null = null;
  //avoid bug, 'undefined', on page refresh
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    successSound = document.getElementById(
      "audio_success_tag"
    ) as HTMLAudioElement;
    failSound = document.getElementById("audio_fail_tag") as HTMLAudioElement;
  }

  const [challenge] = useDocumentData(
    session &&
      doc(db, "users", session?.user?.email!, "challenges", challengeId)
  );

  // Focus on the input when the component mounts
  React.useEffect(() => {
    const delayedFunction = () => {
      // Check if the inputRef is not null before focusing (to avoid errors).
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    const timeoutId = setTimeout(delayedFunction, 300);
    // Cleanup function to clear the timeout if the component unmounts before the timeout is reached
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const notification = toast.loading("ai processing your input...");
    const input = prompt.trim();

    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image! ||
          `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };

    await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "challenges",
        challengeId,
        "messages"
      ),
      message
    );

    await fetch("/api/challenge/assessment", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        challengeId,
        model,
        session,
        subject: challenge?.title,
        /* temp solution, remove the emoji */
        selectedLanguage: challenge?.language.match(/\w+/)[0],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (["Ok", "Good"].includes(data.grade)) {
          successSound?.play();
          toast.success("Nice job!", { id: notification });
        } else {
          failSound?.play();
          toast.error("Failed challenge..", { id: notification });
        }
        //move setDoc to route?
        return setDoc(
          doc(db, "users", session?.user?.email!, "challenges", challengeId),
          {
            ...challenge,
            grade: ["Ok", "Good"].includes(data.grade) ? data.grade : "Failed",
            completed: true,
            time: seconds,
            newWords: wordsToHighlight,
          }
        );
      })
      .catch((err) => {
        console.log(err);
        toast.error("something went wrong: " + err);
      })
      .finally(() => {
        setLoading(false);
        setPrompt("");
      });
  };

  const handleSpecialLetter = (letter: string) => {
    //updates prompt, positions the letter + cursor to where the cursor was located
    //(use in wordcall translation click aswell)
    if (inputRef.current) {
      const textarea = inputRef.current;
      const selectionStart = textarea.selectionStart || 0;
      const selectionEnd = textarea.selectionEnd || 0;

      // Construct the new value by inserting the letter at the current cursor position
      const newValue =
        prompt.substring(0, selectionStart) +
        letter +
        prompt.substring(selectionEnd);

      // Update the state with the new value
      setPrompt(newValue);

      // Focus on the textarea after inserting the letter
      textarea.focus();

      // Set the cursor position after the inserted letter.
      setTimeout(() => {
        textarea.setSelectionRange(selectionStart + 1, selectionStart + 1);
      }, 10);
    }
  };

  const highlightWords = (text: any) => {
    // Regular expression to match words
    const regex = new RegExp(`\\b(${wordsToHighlight.join("|")})\\b`, "gi");
    // Replace matched words with highlighted span
    return text.replace(regex, '<span class="bg-yellow-300">$1</span>');
  };

  const promptAdjusted = prompt.replace(/\s/g, "");

  /* keep highlighted text sync'd when y-oveflow... */
  const [scrollPosition, setScrollPosition] = React.useState<number>(0);
  const handleScroll = (e: any) => {
    setScrollPosition(e.target.scrollTop);
  };

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      className={`text-black text-sm relative ${
        !challenge?.completed && "border-t border-gray-200/90"
      }      px-4 pt-4 overflow-issue-temp-fix: pb-10`}
    >
      <audio id="audio_success_tag" src={"/sounds/pass.mp3"} />
      <audio id="audio_fail_tag" src={"/sounds/fail.mp3"} />

      {/* ARROW DOWN BOUNCE (ux) */}
      {!challenge?.completed && prompt.length == 0 && (
        <div className="absolute flex justify-center w-full pointer-events-none -top-10">
          <ArrowDownCircleIcon className="h-10 w-10 text-black/70 animate-bounce " />
        </div>
      )}

      {promptAdjusted.length > 0 && (
        <InputProgress
          prompt={prompt}
          minChars={challenge?.minChars}
          maxChars={challenge?.maxChars}
        />
      )}

      {/* TEXTAREA */}
      <div className={` ${challenge?.completed && "hidden"}`}>
        <PencilSquareIcon className="w-5 h-5 opacity-40 absolute pointer-events-none left-4 top-[20px]" />
        <div className="relative w-full overflow-hidden">
          {/* WORDS HIGHLIGHTED */}
          <div
            className=" text-lg pl-6  absolute top-0 left-0 w-full h-full  whitespace-pre-wrap break-words text-transparent pointer-events-none"
            dangerouslySetInnerHTML={{ __html: highlightWords(prompt) }}
            style={{ top: -scrollPosition }}
          />
          <textarea
            ref={inputRef}
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            rows={4}
            //display language emoji - temp solution
            placeholder={`Give it a shot! ${challenge?.language
              ?.split(" ")
              ?.pop()}`}
            disabled={!session || challenge?.completed}
            className={` ${
              loading && "text-gray-300"
            } text-lg pl-6 disabled:cursor-not-allowed disabled:text-gray-300 relative w-full bg-transparent text-black resize-none whitespace-pre-wrap break-words outline-none     `}
          />
        </div>
      </div>

      {/* CONTAINER: WORD-HELP, SPECIAL-LETTERS, SUBMIT BUTTON */}
      <div
        className={`${
          challenge?.completed && "hidden"
        } flex justify-between items-center  `}
      >
        <div className={`opacity-90 space-x-6 flex items-center    `}>
          <WordHelpCall
            email={session?.user?.email!}
            setPrompt={setPrompt}
            challenge={challenge}
            challengeId={challengeId}
            inputRef={inputRef}
            setWordsToHighlight={setWordsToHighlight}
          />

          <div className={`flex space-x-1.5 !ml-14 `}>
            {challenge?.specialLetters.map((letter: string, i: number) => (
              <p
                key={i}
                onClick={() => handleSpecialLetter(letter)}
                className="text-black/70 p-1 cursor-pointer hover:text-black"
              >
                {letter}
              </p>
            ))}
          </div>
        </div>
        <button
          className=" disabled:bg-gray-300 disabled:cursor-not-allowed bg-main text-white hover:opacity-50 rounded-lg font-bold px-6 py-3.5    tempSmallFix: -mr-[3px] "
          onClick={(e) => handleSubmit(e)}
          disabled={
            !session ||
            !prompt.trim() ||
            loading ||
            challenge?.completed ||
            promptAdjusted.length < challenge?.minChars ||
            promptAdjusted.length > challenge?.maxChars
          }
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Input;
