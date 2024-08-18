import { DocumentData } from "firebase/firestore";
import React from "react";

type Props = {
  message: DocumentData;
};

function Message({ message }: Props) {
  const isChatGPT = message.user.name == "ChatGPT";

  return (
    <div className={`py-5 text-black ${isChatGPT && " "}`}>
      <div className="flex space-x-5 px-3 max-w-2xl mx-auto ">
        <img src={message?.user?.avatar} alt="avatar" className="h-8 w-8 " />
        <div>
          {message?.isSubjectDiscussed && (
            <h1 className="font-bold">ai suggested improvements</h1>
          )}
          <p
            className={`${
              !message?.isSubjectDiscussed && isChatGPT && "font-bold"
            }  `}
          >
            {message?.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Message;
