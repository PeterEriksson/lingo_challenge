//v3..
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, //now works..
});
const openai = new OpenAIApi(configuration);

export default openai;

// New (v4..)
/* 
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
 });


export default openai; */
