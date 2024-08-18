import openai from "@/lib/chatgpt";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

//3:02
//TEST

type Option = {
  value: string;
  label: string;
};
type Data = {
  modelOptions: Option[];
};

export async function GET(req: NextApiRequest, res: NextApiResponse<Data>) {
  const models = await openai.listModels().then((res) => res.data.data);
  console.log(models);
  const modelOptions = models.map((model) => ({
    value: model.id,
    label: model.id,
  }));

  return NextResponse.json({ modelOptions });
}
