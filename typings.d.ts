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

//how shold Challenge look like..?
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
    wordsToHighlight?: string[];
  };
}
