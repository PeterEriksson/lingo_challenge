interface Message {
  text: string;
  createdAt: admin.firestore.Timestamp;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  isSubjectDiscussed?: boolean;
  wordsToHighlight?: string[];
}

//how shold Challenge look like..?
type Challenge = {
  userId?: string;
  createdAt?: admin.firestore.Timestamp;
  title: string;
  description: string;
  tips: string[];
  startingLives?: number;
  livesLeft?: number;
  completed?: boolean;
  minChars?: number;
  maxChars?: number;
  language?: string;
  specialLetters?: string[];
  grade?: string;
};
