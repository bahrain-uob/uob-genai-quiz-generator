import { useState, useCallback, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface QuestionState {
  kind: "questionState";
  data: pubQuestion;
}

interface ResultState {
  kind: "resultState";
  place: number;
  correct: number;
  total: number;
}

interface WaitState {
  kind: "waitState";
}

type GameState = QuestionState | ResultState | WaitState;

export function GameClient() {
  const [join, setJoin] = useState(false);
  // const gameId = useSearchParams()[0].get("gameId");
  const gameId = "mcq";
  const [username, setUsername] = useState("username");
  const socketUrl = `${
    import.meta.env.VITE_APP_SOCKET_URL
  }?username=${username}&gameId=${gameId}`;

  return (
    <>
      {!join && (
        <div>
          <h1>SET USERNAME</h1>
          <input
            type="text"
            defaultValue={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={() => setJoin(true)}>JOIN</button>
        </div>
      )}
      {join && <Game key={0} socketUrl={socketUrl} gameId={gameId!} />}
    </>
  );
}

function Game(props: { socketUrl: string; gameId: string }) {
  const {
    sendMessage: innerSendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(props.socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      const newMessage = JSON.parse(lastMessage.data) as ServerMessage;
      if (newMessage.action == "pubQuestion") {
        setState({ kind: "question", data: newMessage });
      }
    }
  }, [lastMessage]);

  const [state, setState]: [GameState, any] = useState({} as GameState);

  const send = useCallback((data: ClientMessage) => {
    if (data.action) innerSendMessage(JSON.stringify(data));
  }, []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <span>The WebSocket is currently {connectionStatus}</span>
      {state.kind == "questionState" && (
        <Question
          key={crypto.randomUUID()}
          state={state}
          socketSend={send}
          gameId={props.gameId}
        />
      )}
      {state.kind == "resultState" && (
        <div>
          <h1>{state.kind}</h1>
        </div>
      )}
    </div>
  );
}

function Question({
  state,
  socketSend,
  gameId,
}: {
  state: QuestionState;
  socketSend: (data: ClientMessage) => void;
  gameId: string;
}) {
  const [answered, setAnswered] = useState(false);
  const [chosenAnswer, setChosenAnswer] = useState(0xcafe);

  const answer = (index: number) => {
    socketSend({
      action: "sendAnswer",
      gameId,
      questionId: state.data.questionId,
      answer: index,
    });
    setAnswered(true);
    setChosenAnswer(index);
  };

  const colors = ["#d55e00", "#56b4e9", "#019e73", "#f0e442"];
  const art = ["٩(◕‿◕｡)۶", "(*≧ω≦*)", "(๑>◡<๑)", "(⁀ᗢ⁀)"];

  return (
    <>
      {!answered && (
        <div>
          <h1>{state.data.question}</h1>
          {state.data.choices.map((choice, index) => (
            <button
              key={choice}
              style={{
                backgroundColor: colors[index],
                width: "40%",
                height: "200px",
                margin: "5px",
              }}
              onClick={() => answer(index)}
            >
              {art[index]}
              <br />
              {choice}
            </button>
          ))}
        </div>
      )}
      {answered && (
        <h1>
          {chosenAnswer === state.data.answer ? "TRUE" : "FALSE"} WAITING FOR
          NEXT QUESTION
        </h1>
      )}
    </>
  );
}
