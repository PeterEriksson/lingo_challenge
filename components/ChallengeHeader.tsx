"use client";

import { db } from "@/firebase";
import { useCountdown } from "@/hooks/useCountdown";
import useCountUp from "@/hooks/useCountup";
import { formatTime } from "@/lib/timeUtils";
import { HeartIcon } from "@heroicons/react/24/solid";
import { doc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";

type Props = {
  challengeId: string;
};

function ChallengeHeader({ challengeId }: Props) {
  const { data: session } = useSession();

  const [challenge, loading] = useDocumentData(
    session &&
      doc(db, "users", session?.user?.email!, "challenges", challengeId)
  );

  //const seconds = useCountdown(150, challengeId);
  const seconds = useCountUp();

  return (
    <header className="sticky z-50 flex justify-between items-center px-4 py-[18px] shadow-md ">
      {loading ? (
        <p className="animate-pulse text-xs opacity-70 font-light">
          Loading...
        </p>
      ) : (
        <div>
          <h1 className="font-bold text-gray-500/70 text-lg md:text-xl">
            {challenge?.description}
          </h1>
          <h4 className="font-bold text-xs text-gray-500/60 ">
            {challenge?.minChars}-{challenge?.maxChars} chars
          </h4>
        </div>
      )}

      {/* COUNTDOWN/COUNTUP */}
      {!challenge?.completed && (
        <h3
          className={`w-10 text-right md:text-lg font-bold text-gray-500/60 tracking-wide  relative ${
            loading && "opacity-0"
          }`}
        >
          {formatTime(seconds)}
        </h3>
      )}

      {/* HEARTS */}
      <div className={`${loading && "opacity-0"} opacity-80 flex`}>
        {Array.from({ length: challenge?.startingLives }).map((_, i) => (
          <HeartIcon
            key={i}
            className={`md:h-5 md:w-5 w-4 h-4 ${
              i + 1 > challenge?.livesLeft ? "text-gray-500" : "text-red-300 "
            }
            ${challenge?.livesLeft == 1 && i == 0 && "animate-pulse"}
            `}
          />
        ))}
      </div>
    </header>
  );
}

export default ChallengeHeader;
