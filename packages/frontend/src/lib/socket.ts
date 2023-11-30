type ClientMessage = sendUsername | sendAnswer;

interface sendUsername {
  action: "sendUsername";
  gameId?: string;
  connectionId?: string;
  username: string;
}

interface sendAnswer {
  action: "sendAnswer";
  gameId?: string;
  connectionId?: string;
  time?: number;
  answer: number;
}

type ServerMessage = pubQuestion | pubResult | pubEnd;

interface pubQuestion {
  action: "pubQuestion";
  gameId?: string;
  questionIndex: number;
  totalQuestions: number;
  noOptions: number;
}

interface pubResult {
  action: "pubResult";
  gameId?: string;
  connectionId?: string;
  rank: number;
  score: number;
}

interface pubEnd {
  action: "pubEnd";
  gameId?: string;
  connectionId?: string;
  rank: number;
  correctQuestions: number;
  totalQuestions: number;
}
