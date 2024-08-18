import openai from "./chatgpt";

const wordTranslateQuery = async (prompt: string, selectedLanguage: string) => {
  const res = await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          //content: `Translate '${prompt}' to ${selectedLanguage}. If no translation reply 'Failed'`,
          content: `Translate '${prompt}' to ${selectedLanguage}`,
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

export default wordTranslateQuery;
