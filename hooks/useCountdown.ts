import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";

export const useCountdown = (initialSeconds: number, challengeId: string) => {
  const { data: session } = useSession();
  const [challengeInfo] = useDocumentData(
    session &&
      doc(db, "users", session?.user?.email!, "challenges", challengeId)
  );

  const [seconds, setSeconds] = useState(initialSeconds);

  const updateChallenge = async () => {
    await setDoc(
      doc(db, "users", session?.user?.email!, "challenges", challengeId),
      { ...challengeInfo, completed: true, grade: "Failed" }
    );
  };

  /* useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => Math.max(prevSeconds - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); */
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          clearInterval(timer);
          const updateChallenge = async () => {
            try {
              await setDoc(
                doc(
                  db,
                  "users",
                  session?.user?.email!,
                  "challenges",
                  challengeId
                ),
                { ...challengeInfo, completed: true }
              ).then(() => console.log("updated doc"));
            } catch (err) {
              console.log("error from countdown: " + err);
            }
          };
          !challengeInfo?.completed &&
            updateChallenge().then(() => {
              return 0;
            });

          //return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [challengeId, challengeInfo, session?.user?.email!]);

  return seconds;
};
