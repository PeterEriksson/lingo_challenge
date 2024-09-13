import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import React from "react";

type Props = {
  message: DocumentData;
  grade?: string;
};

function Message({ message, grade }: Props) {
  const isUser = message.user.name !== "ChatGPT";
  const challengeFailed = !grade || !["Ok", "Good", "Gut"].includes(grade);

  const [showImprovement, setShowImprovement] = React.useState<boolean>(false);

  // Function to split the message text and highlight the words
  const getHighlightedText = (text: string, wordsToHighlight: string[]) => {
    // Escape special characters in the words for use in a regex pattern
    const regexPattern = new RegExp(`(${wordsToHighlight.join("|")})`, "gi");

    // Split text based on the pattern
    const parts = text.split(regexPattern);

    return parts.map((part, index) =>
      wordsToHighlight.some(
        (word) => word.toLowerCase() === part.toLowerCase()
      ) ? (
        <span key={index} className="bg-highlight">
          {part}
        </span>
      ) : (
        <span key={index} className="bg-white">
          {part}
        </span>
      )
    );
  };

  //figure out cleaner solution...too many ifs...(&&, ? : ....)
  //two returns? one for user, 1 for openai
  ////pass down grade from ChallengeBody

  if (isUser) {
    return (
      <div className={`py-5 text-black `}>
        <div className="flex space-x-3.5 px-3 max-w-2xl mx-auto ">
          <Image
            src={message?.user?.avatar}
            alt="avatar"
            width={100}
            height={100}
            className="h-8 w-8"
          />
          <div>
            {message?.isSubjectDiscussed && (
              <h3 className="font-bold text-md text-green-600 opacity-60">
                ai suggested improvements
              </h3>
            )}

            <p
              onClick={() => setShowImprovement(true)}
              className={` text-base  `}
            >
              {getHighlightedText(message?.text, message?.wordsToHighlight)}
            </p>
          </div>
        </div>
      </div>
    );

    // openai response
  } else {
    return (
      <div className={`py-5 text-black `}>
        <div className="flex space-x-3.5 px-3 max-w-2xl mx-auto ">
          <Image
            src={message?.user?.avatar}
            alt="avatar"
            width={100}
            height={100}
            className="h-8 w-8"
          />
          <div>
            {!challengeFailed && (
              <h1
                onClick={() => setShowImprovement(true)}
                className={`font-bold  ${
                  showImprovement ? "cursor-auto" : "cursor-pointer"
                } `}
              >
                <span className={`${showImprovement && "hidden"} `}>show</span>{" "}
                ai improvements
              </h1>
            )}
            <p
              className={`${challengeFailed && "font-bold"} ${
                !challengeFailed && (showImprovement ? "inline" : "hidden")
              } `}
            >
              {message?.text}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
