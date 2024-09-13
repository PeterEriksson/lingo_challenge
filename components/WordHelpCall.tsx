"use client";

import React from "react";
import {
  HeartIcon,
  PencilSquareIcon,
  PhoneArrowUpRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { DocumentData } from "firebase/firestore";
import toast from "react-hot-toast";

type Props = {
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  challenge?: DocumentData;
  email?: string;
  challengeId: string;
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  setWordsToHighlight: React.Dispatch<React.SetStateAction<string[]>>;
};

function WordHelpCall({
  setPrompt,
  challenge,
  email,
  challengeId,
  inputRef,
  setWordsToHighlight,
}: Props) {
  const [callInput, setCallInput] = React.useState<string>("");
  const callFormRef = React.useRef<HTMLFormElement>(null);
  const callInputRef = React.useRef<HTMLInputElement>(null);
  const [call, setCall] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [translation, setTranslation] = React.useState<string>("");
  const translatedParagraphRef = React.useRef<HTMLParagraphElement>(null);

  const maxCallInputLength = 45;

  let inputSound: HTMLAudioElement | null = null;
  let notificSound: HTMLAudioElement | null = null;
  let wordHelpErrorSound: HTMLAudioElement | null = null;
  //avoid bug, 'undefined', on page refresh
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    inputSound = document.getElementById("audio_input_tag") as HTMLAudioElement;
    notificSound = document.getElementById(
      "audio_notific_tag"
    ) as HTMLAudioElement;
    wordHelpErrorSound = document.getElementById(
      "word_help_error_tag"
    ) as HTMLAudioElement;
  }

  const activateCallWordHelp = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    //translation clicked, don't do anything
    if (e.target === translatedParagraphRef.current) return;

    //outcommented for now (testing..)
    /* if (challenge?.livesLeft < 1) {
      toast.error("no lives left!");
      return;
    } */

    setCall(true);
    setTimeout(() => {
      if (callInputRef.current) {
        callInputRef.current.focus();
      }
    }, 100);
  };

  //check for click outside form-el. maybe move code to seperate file.
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        callFormRef.current &&
        !callFormRef.current.contains(event.target as Node)
      ) {
        setCall(false);
      }
    };

    if (call) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [call]);

  const handleTranslationCall = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!callInput.trim()) return;

    if (callInput.length > maxCallInputLength) {
      toast("Max " + maxCallInputLength + " characters!", {
        icon: "⚠️",
      });
      return;
    }

    const inputCopy = callInput;
    const notification = toast.loading("Translating..");

    setLoading(true);
    await fetch(`/api/challenge/call`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        stringToTranslate: callInput,
        challenge: challenge,
        email: email,
        challengeId: challengeId,
        selectedLanguage: challenge?.language,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //long response from openai - probably not able to translate. temp solution.
        if (data.translation.length > 55) {
          wordHelpErrorSound?.play();
          setCall(false);
          setCallInput("");
          toast.error("ai couldn't understand input", {
            id: notification,
            duration: 4000,
          });
        } else {
          setTranslation(data.translation);
          notificSound?.play();

          toast(
            <p className="font-light">
              {callInput + ":"}
              <span className="font-bold"> {data.translation}</span>
            </p>,
            {
              id: notification,
              duration: 3300,
              icon: (
                <div className="flex items-center justify-center">
                  <HeartIcon className="h-6 w-6 " />
                  <p className="absolute rotate-12 text-3xl font-extralight mb-1 opacity-50">
                    /
                  </p>
                </div>
              ),
            }
          );
        }
      })
      .catch((err) => {
        toast.error("failed to call word-help");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTranslationClick = () => {
    const translationCopy = translation;
    setPrompt((prev) => prev + translationCopy + " ");

    //remove . from the string
    const stringFormatted = translationCopy.replace(/\./g, "");

    setWordsToHighlight((prev) => [...prev, stringFormatted]);

    setTranslation("");
    setCallInput("");
    inputSound?.play();

    toast(
      <p className="font-bold ">
        {translationCopy}
        <span className="!bg-white font-light"> added to input field</span>
      </p>,
      {
        icon: <PencilSquareIcon className="w-5 h-5 opacity-55 " />,
      }
    );

    //focus on Input after adding translation
    if (inputRef?.current) {
      inputRef.current.focus();
    }
    setCall(false);
  };

  return (
    <div
      onClick={(e) => activateCallWordHelp(e)}
      className={`flex w-fit group ${
        !call && "cursor-pointer"
      } space-x-2 items-center p-2 rounded-lg border border-gray-400/40     `}
    >
      {call ? (
        <form
          ref={callFormRef}
          onSubmit={handleTranslationCall}
          className="flex items-center"
        >
          {translation == "" ? (
            <input
              disabled={loading}
              ref={callInputRef}
              onChange={(e) => setCallInput(e.target.value)}
              value={callInput}
              placeholder="get translation"
              type="text"
              className={`focus:outline-none  placeholder-gray-500 ${
                callInput.length > maxCallInputLength && "text-red-500"
              } ${loading && "opacity-70 animate-pulse"} `}
            />
          ) : (
            <div className="space-x-3 flex items-center">
              <p
                ref={translatedParagraphRef}
                onClick={handleTranslationClick}
                className=" text-gray-700 cursor-pointer hover:bg-highlight px-1 rounded-md transition duration-150 ease-in "
              >
                {translation}
              </p>
              <XMarkIcon
                onClick={() => {
                  setTranslation("");
                  setCallInput("");
                }}
                className="h-4 w-4 text-gray-700 cursor-pointer hover:opacity-60"
              />
            </div>
          )}

          <button
            className={`${translation !== "" && "hidden"} `}
            type="submit"
            disabled={loading}
          >
            <PhoneArrowUpRightIcon
              className={`h-5 w-5 opacity-50 hover:opacity-80 cursor-pointer`}
            />
          </button>
        </form>
      ) : (
        <div className="flex space-x-2">
          <PhoneArrowUpRightIcon className="h-5 w-5 opacity-70 " />
          <p className="text-sm hidden group-hover:inline font-semibold text-gray-500/80 ">
            call word-help
          </p>
        </div>
      )}
      <audio id="audio_input_tag" src={"/sounds/multi-pop1.mp3"} />
      <audio id="audio_notific_tag" src={"/sounds/notification2.mp3"} />
      <audio id="word_help_error_tag" src={"/sounds/error5.mp3"} />
    </div>
  );
}

export default WordHelpCall;
