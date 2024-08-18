import openai from "./chatgpt";

const assessmentQuery = async (
  prompt: string,
  model: string,
  subject: string,
  subjectDiscussed: boolean,
  selectedLanguage: string
) => {
  if (!subjectDiscussed) return;

  //else -> subject is discussed, make api call to get assessment.
  const res = await openai
    .createChatCompletion({
      model: model,
      messages: [
        {
          role: "system",
          content: `You are a ${selectedLanguage} teacher. Write what I'm trying to say in a correct way. At the end of your response, always provide an assessment: Good, Ok, Failed. `,
          //content: `You are a german teacher. Write what I'm trying to say in a correct way. The subject is: ${subject}. At the end of your response, always provide an assessment: Good, Ok, Failed. In the assessment, take into account if the subject is talked about. `,
          //content: `You are a german teacher grading my discussion of: ${subject}. At the end of your response, always provide a grade: Good, Ok, Failed.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })
    .then((res) => res.data.choices[0].message?.content)
    .catch(
      (err) =>
        `hmm openai was unable to find an answer for that! (Error: ${err})`
    );

  return res;
};

export default assessmentQuery;
