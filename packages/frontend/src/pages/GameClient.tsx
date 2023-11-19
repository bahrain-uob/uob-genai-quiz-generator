import { useState, useCallback, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "../caravalClient.css";

interface PreGameState {
  kind: "preGameState";
}

interface WaitState {
  kind: "waitState";
}

interface QuestionState {
  kind: "questionState";
  questionIndex: number;
  totalQuestions: number;
  noOptions: number;
}

interface ResultState {
  kind: "resultState";
  rank: number;
  score: number;
}

interface EndGameState {
  kind: "endGameState";
  rank: number;
  correctQuestions: number;
  totalQuestions: number;
}

type ClientState =
  | PreGameState
  | WaitState
  | QuestionState
  | ResultState
  | EndGameState;

export function GameClient() {
  const [state, _setState] = useState({ kind: "preGameState" } as ClientState);
  const gameId = "mcq";
  // const gameId = useSearchParams()[0].get("gameId");
  const socketUrl = `${import.meta.env.VITE_APP_SOCKET_URL}?gameId=${gameId}`;

  const {
    sendMessage: innerSendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      // @ts-ignore
      const newMessage = JSON.parse(lastMessage.data) as ServerMessage;
    }
  }, [lastMessage]);

  // @ts-ignore
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
    <>
      {state.kind == "preGameState" && <PreGame />}
      {state.kind == "waitState" && <Wait />}
      {state.kind == "questionState" && <Question state={state} />}
      {state.kind == "resultState" && <Result state={state} />}
      {state.kind == "endGameState" && <EndGame state={state} />}
      <h1>IGNORE BELOW</h1>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
    </>
  );
}

function PreGame() {
  return (
    <>
      <div className="pre-game-client">
        <h1>Caraval!</h1>
        <input className="name-input" placeholder="Name" />
        <button>Enter</button>
      </div>
    </>
  );
}

function Wait() {
  return (
    <>
      <div className="wait-container">
        <h1>Get Ready!</h1>
        <div style={{ marginTop: "30px" }}>
          <div className="square">
            <div className="sword">
              <div className="blade"></div>
              <div className="handle"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Question(props: { state: QuestionState }) {
  // @ts-ignore
  const { questionIndex, totalQuestions, noOptions } = props.state;

  return <h1>Question</h1>;
}

function Result(props: { state: ResultState }) {
  // @ts-ignore
  const { rank, score } = props.state;

  return <h1>Result</h1>;
}

function EndGame(props: { state: EndGameState }) {
  // @ts-ignore
  const { rank, correctQuestions, totalQuestions } = props.state;

  return <h1>EndGame</h1>;
}
