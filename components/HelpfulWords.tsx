import {
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { DocumentData, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import toast from "react-hot-toast";

/* NOT IN USE */

type Props = {
  challenge?: DocumentData;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  email: string;
  challengeId: string;
};

function HelpfulWords({
  challenge,
  setPrompt,
  inputRef,
  email,
  challengeId,
}: Props) {
  const [helpfulWordsVisible, setHelpfulWordsVisible] =
    React.useState<boolean>(false);

  const handleHelpfulWord = (word: string) => {
    if (challenge?.completed) return;
    else {
      setPrompt((prev) => prev + word + " ");
      if (inputRef?.current) {
        inputRef.current.focus();
      }
      toast(
        <p className="font-bold">
          {/* {word} */}
          <span className="font-light">word(s) added to input field</span>
        </p>,
        {
          icon: "📝",
        }
      );
    }
  };

  const helpfulWordsArray = challenge?.helpfulWords.split(", ");

  const handleShowHelpfulWords = async () => {
    if (challenge?.livesLeft < 1 && !helpfulWordsVisible) {
      toast.error("No lives left!");
      return;
    }
    if (helpfulWordsVisible || challenge?.completed) return;

    setHelpfulWordsVisible(true);

    await setDoc(doc(db, "users", email!, "challenges", challengeId), {
      ...challenge,
      livesLeft: challenge?.livesLeft - 1,
    })
      .then(() =>
        toast("Helpful words visible", {
          icon: (
            <div className="flex items-center justify-center">
              <HeartIcon className="h-6 w-6 " />
              <p className="absolute rotate-12 text-3xl font-extralight mb-1 opacity-50">
                /
              </p>
            </div>
          ),
        })
      )
      .catch((err) => {
        toast.error("oops something went wrong ...");
        console.log(err);
      });
  };

  return (
    <div
      onClick={handleShowHelpfulWords}
      className="flex w-fit group cursor-pointer space-x-2 items-center p-2 bg-gray-300/90 rounded-lg  "
    >
      <ChatBubbleBottomCenterTextIcon className="h-5 w-5 opacity-70" />
      <p
        className={`text-sm hidden group-hover:inline font-bold text-gray-500/80`}
      >
        Get me started
        {helpfulWordsVisible &&
          helpfulWordsArray?.map((word: string, i: number) => (
            <span
              onClick={() => handleHelpfulWord(word)}
              className={`hover:bg-gray-400 px-1 rounded-xl italic font-normal text-black`}
              key={i}
            >
              {word}
            </span>
          ))}
      </p>
    </div>
  );
}

export default HelpfulWords;
