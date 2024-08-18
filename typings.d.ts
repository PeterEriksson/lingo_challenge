interface Message {
  text: string;
  createdAt: admin.firestore.Timestamp;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  isSubjectDiscussed?: boolean;
}

//how shold Challenge look like..placeholder:?
//NOT IN USE
interface Challenge {
  tips: string[];
  livesLeft: number;
  challengeTitle: string;
  challengeDescription: string;
  messages?: Message[];
  userId: string;
  createdAt: admin.firestore.Timestamp;
  completed: boolean;
  language: string;
  assessment?: {
    grade: string;
    completionTime: number;
    wordsProvided?: string; //words provided from wordCall(or helpful words?) ... store somehow -> remembered easier -> serve the user
    livesUsed?: number;
  };
}
