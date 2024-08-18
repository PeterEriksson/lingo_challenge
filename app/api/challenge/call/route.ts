import { adminDb } from "@/firebaseAdmin";
import openai from "@/lib/chatgpt";
import wordTranslateQuery from "@/lib/wordTranslateApi";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

type Data = {
  translation: string;
};

//provide translation and update the challenge(-1 life)
export async function PUT(req: any, res: NextApiResponse<Data>) {
  const { stringToTranslate, challenge, email, challengeId, selectedLanguage } =
    await req.json();

  //capitalize the first letter of the string -> better results
  const prompt =
    stringToTranslate.charAt(0).toUpperCase() + stringToTranslate.slice(1);

  const translation = await wordTranslateQuery(prompt, selectedLanguage);
  console.log(translation);

  //adminDb..remove life no matter what for now.
  //v8 approach
  await adminDb
    .collection("users")
    .doc(email)
    .collection("challenges")
    .doc(challengeId)
    .set({
      ...challenge,
      livesLeft: challenge?.livesLeft - 1,
    });

  //create subcollection with calltranslations(these can be shown later in assessment)
  // -> remind user new word(s) they've encountered

  return NextResponse.json({
    translation,
  });
}
