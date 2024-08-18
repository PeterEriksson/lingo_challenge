"use client";

import { db } from "@/firebase";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React from "react";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import Message from "./Message";
import {
  ArrowDownCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { formatTime } from "@/lib/timeUtils";
import Success from "./Success";
import { Typewriter } from "react-simple-typewriter";

type Props = {
  challengeId: string;
};

/* ChallengeBody: ai-assessment + summary(grade+time) */

function ChallengeBody({ challengeId }: Props) {
  const { data: session } = useSession();

  const [messages, loadingMessages /* error */] = useCollection(
    session &&
      query(
        collection(
          db,
          "users",
          session?.user?.email!,
          /* "chats" */ "challenges",
          challengeId,
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
  );

  const [challenge] = useDocumentData(
    session &&
      doc(db, "users", session?.user?.email!, "challenges", challengeId)
  );

  return (
    <div
      className={`${
        messages?.empty && "flex flex-col justify-end"
      }   overflow-y-auto overflow-x-hidden overflow-hidden (use up majority of the screen -> pushes down chatInput (with help of css in page)): flex-1  `}
    >
      {/* 📝 challenge is ongoing - show tips, todo */}
      {messages?.empty && (
        <div className="relative m-auto cursor-default group">
          <div className="group-hover:opacity-0 flex items-center space-x-1.5 py-4 px-12">
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 opacity-20" />
            <h3 className="text-xl uppercase font-extrabold opacity-20 tracking-widest">
              hover for tips
            </h3>
          </div>
          <p className="py-4 px-12 absolute bottom-0 left-0 right-0 text-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300">
            <Typewriter
              words={challenge?.tips}
              //Control how many times to run. 0 | false to run infinitely
              loop={false}
              cursor
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </p>
        </div>
      )}

      {messages?.docs.map((message) => (
        <Message message={message.data()} key={message.id} />
      ))}

      {/* Summary */}
      {challenge?.completed && (
        <div
          className={`${
            loadingMessages && "hidden"
          } flex flex-col items-center`}
        >
          {["Ok", "Good", "Gut"].includes(challenge?.grade) ? (
            <Success grade={challenge?.grade} />
          ) : (
            //Failure:
            <>
              <XMarkIcon className={`h-20 w-20 mx-auto mt-2.5 text-red-500 `} />
              <p className=" text-red-500 mt-[6px]">{challenge?.grade}</p>
            </>
          )}

          <div className="flex items-center opacity-75 space-x-1 text-sm mt-1.5">
            <ClockIcon className="w-4 h-4 " />
            <p className="font-light ">
              {challenge?.time ? formatTime(challenge?.time) : ""}
            </p>
          </div>

          {challenge?.newWords?.length > 0 && (
            <>
              <h2 className={`font-bold opacity-40 -mb-1 mt-1  `}>New words</h2>
              {challenge?.newWords?.map((string: string, i: number) => (
                <p className="bg-yellow-300 mt-1" key={i}>
                  {string}
                </p>
              ))}
            </>
          )}

          <p className="text-xs opacity-70 mt-6 ">
            note: ai can make mistakes.
          </p>
        </div>
      )}
    </div>
  );
}

export default ChallengeBody;
