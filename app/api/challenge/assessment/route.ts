import assessmentQuery from "@/lib/assessmentApi";
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { adminDb } from "@/firebaseAdmin";
import { NextResponse } from "next/server";
import openai from "@/lib/chatgpt";
import subjectDiscussedQuery from "@/lib/subjectDiscussedApi";

type Data = {
  answer: string;
  grade: string;
};

export async function POST(req: any, res: NextApiResponse<Data>) {
  const { prompt, challengeId, model, session, subject, selectedLanguage } =
    await req.json();

  // get initial response whether subject is discussed
  const subjectDiscussedResponse = await subjectDiscussedQuery(
    prompt,
    model,
    subject,
    selectedLanguage
  );
  const isSubjectDiscussed = subjectDiscussedResponse == "Yes";
  //console.log("subjectDiscussedResponse: " + subjectDiscussedResponse);
  console.log("subject is discussed? " + isSubjectDiscussed);

  const response = await assessmentQuery(
    prompt,
    model,
    subject,
    isSubjectDiscussed,
    selectedLanguage
  );
  //get the assesment
  // Remove punctuation marks
  const cleanStr =
    response?.replace(/[^\w\s]/gi, "") || "ai was unable to answer. Failed";
  // Split the string into words
  const words = cleanStr.split(" ");
  const lastWordGrade = words[words.length - 1];

  const message: Message = isSubjectDiscussed
    ? {
        text: ["Ok", "Good"].includes(lastWordGrade)
          ? response || "ai was unable to answer. Failed"
          : "Topic discussed, but language not well enough expressed",
        createdAt: admin.firestore.Timestamp.now(),
        user: {
          _id: "ChatGPT",
          name: "ChatGPT",
          avatar:
            "https://i.pinimg.com/236x/4b/b9/ac/4bb9ac138c2e4768381f14c040f48e80.jpg",
        },
        isSubjectDiscussed: isSubjectDiscussed,
      }
    : {
        text: "Topic not discussed sufficiently",
        createdAt: admin.firestore.Timestamp.now(),
        user: {
          _id: "ChatGPT",
          name: "ChatGPT",
          avatar:
            "https://i.pinimg.com/236x/4b/b9/ac/4bb9ac138c2e4768381f14c040f48e80.jpg",
        },
        isSubjectDiscussed: isSubjectDiscussed,
      };

  //v8 approach. add message
  await adminDb
    .collection("users")
    .doc(session?.user?.email)
    .collection("challenges")
    .doc(challengeId)
    .collection("messages")
    .add(message);

  // set challengeDoc here?? now on the client..(Input.tsx)

  return NextResponse.json({
    answer: message.text,
    grade: isSubjectDiscussed ? lastWordGrade : "Failed",
  });
}
