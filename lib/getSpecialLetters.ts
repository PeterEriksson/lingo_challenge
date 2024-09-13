//temp sol

const getSpecialLetters = (selectedLanguage: string) => {
  if (selectedLanguage == "German 🇩🇪") {
    return ["ß", "ä", "ö", "ü"];
  } else if (selectedLanguage == "Spanish 🇪🇸") {
    return ["ü", "ñ", "é", "á", "í", "ó", "ú"];
  } else if (selectedLanguage == "French 🇫🇷") {
    return ["é", "à", "è", "ù", "â", "î", "ô", "û", "ç", "ë", "ï", "ü"];
  } else if (selectedLanguage == "Italian 🇮🇹") {
    return [" à, è, é, ì, ò, ù"];
  } else if (selectedLanguage == "Swedish 🇸🇪") {
    return ["ä", "ä", "ö"];
  } else {
    return "";
  }
};

export { getSpecialLetters };
