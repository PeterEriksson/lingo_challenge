"use client";

import { useLanguageStringStore } from "@/store/store";
import React from "react";
import data from "../data.json";

function LanguageSelect() {
  const { selectedLanguageString, setSelectedLanguageString } =
    useLanguageStringStore();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguageString(event.target.value);
  };

  //temp sol
  const letsGoTranslation = () => {
    if (selectedLanguageString == "German 🇩🇪") {
      return "Los geht's!";
    } else if (selectedLanguageString == "Spanish 🇪🇸") {
      return "Vamos!";
    } else if (selectedLanguageString == "French 🇫🇷") {
      return "C'est parti!";
    } else if (selectedLanguageString == "Swedish 🇸🇪") {
      return "Nu kör vi!";
    } else {
      return "";
    }
  };

  return (
    <>
      <h3 className="tracking-tight uppercase font-bold mb-1.5 mt-4">
        {selectedLanguageString == ""
          ? "🌎 LET'S GET STARTED "
          : "🌎 " + letsGoTranslation()}
      </h3>
      <div className=" border-2 border-gray-900 rounded-xl p-1">
        <select
          className="focus:outline-none p-2.5 "
          value={selectedLanguageString}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select language
          </option>
          {data.languages.map((language, i) => (
            <option key={i} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default LanguageSelect;
