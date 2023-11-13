type ClientMessage = joinGame | sendAnswer;

interface joinGame {
  action: "joinGame";
  gameId: string;
  connectionId?: string;
  username: string;
}

interface sendAnswer {
  action: "sendAnswer";
  gameId: string;
  connectionId?: string;
  time?: number;
  questionId: string;
  answer: number;
}

type ServerMessage = pubQuestion | pubResult;

interface pubQuestion {
  action: "pubQuestion";
  gameId: string;
  questionId: string;
  question: string;
  choices: string[];
  answer: number;
}

interface pubResult {
  action: "pubResult";
  gameId: string;
  questionId: string;
  answer: number;
}
