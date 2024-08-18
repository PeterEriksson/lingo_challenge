import openai from "./chatgpt";

const subjectDiscussedQuery = async (
  prompt: string,
  model: string,
  subject: string,
  selectedLanguage: string
) => {
  const res = await openai
    .createChatCompletion({
      model: model,
      messages: [
        {
          role: "system",
          content: `Am I discussing this subject: ${subject}? Reply 'Yes' or No. `,
          //content: `Am I writing in this language: ${selectedLanguage}? Reply 'Yes' or No. `, create new file .. (future version)
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

export default subjectDiscussedQuery;
