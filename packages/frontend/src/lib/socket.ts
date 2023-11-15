type ClientMessage = sendName | sendAnswer;

interface sendName {
  action: "sendName";
  gameId?: string;
  connectionId?: string;
  username: string;
}

interface sendAnswer {
  action: "sendAnswer";
  gameId?: string;
  connectionId?: string;
  time?: number;
  questionIndex: number;
  answer: number;
}

type ServerMessage = pubQuestion | pubResult;

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
  questionId: string;
  answer: number;
}
