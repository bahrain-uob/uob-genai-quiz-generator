import { useState, useCallback, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "../caravalClient.css";
import {
  faCheck,
  faCloud,
  faMeteor,
  faStar,
  faSun,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "react-router-dom";

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
  const [state, setState] = useState({ kind: "preGameState" } as ClientState);
  const gameId = useSearchParams()[0].get("gameId")!;
  const socketUrl = `${import.meta.env.VITE_APP_SOCKET_URL}?gameId=${gameId}`;

  const {
    sendMessage: innerSendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data) as ServerMessage;
      console.log(message);
      if (message.action == "pubQuestion") {
        setState({ kind: "questionState", ...message });
      }
      if (message.action == "pubResult") {
        setState({
          kind: "resultState",
          rank: message.rank,
          score: message.score,
        });
      }
    }
  }, [lastMessage]);

  // @ts-ignore
  const send = useCallback((data: ClientMessage) => {
    if (data.action) innerSendMessage(JSON.stringify({ ...data, gameId }));
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
      {state.kind == "preGameState" && (
        <PreGame send={send} setState={setState} />
      )}
      {state.kind == "waitState" && <Wait />}
      {state.kind == "questionState" && (
        <Question state={state} send={send} setState={setState} />
      )}
      {state.kind == "resultState" && <Result state={state} />}
      {state.kind == "endGameState" && <EndGame state={state} />}
      <h1>IGNORE BELOW</h1>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
    </>
  );
}

function PreGame(props: {
  send: (data: sendUsername) => void;
  setState: (s: WaitState) => void;
}) {
  const [username, setUsername] = useState("");

  const joinGame = () => {
    props.send({ action: "sendUsername", username });
    props.setState({ kind: "waitState" });
  };

  return (
    <>
      <div className="pre-game-client">
        <h1>Caraval!</h1>
        <input
          onChange={(e) => setUsername(e.target.value)}
          className="name-input"
          placeholder="Name"
        />
        <button onClick={joinGame}>Enter</button>
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

function Question(props: {
  state: QuestionState;
  send: (m: sendAnswer) => void;
  setState: (s: WaitState) => void;
}) {
  // @ts-ignore
  const { questionIndex, totalQuestions, noOptions } = props.state;
  const icons = [faCloud, faSun, faMeteor, faStar];

  const sendAnswer = (index: number) => {
    props.send({ action: "sendAnswer", answer: index });
    props.setState({ kind: "waitState" });
  };

  return (
    <>
      <div className="question-client">
        <div className="num-of-questions">
          <p>
            {questionIndex + 1} of {totalQuestions}
          </p>
        </div>
        <div className="options-client">
          {[...Array(noOptions).keys()].map((i) => {
            return (
              <div
                key={i}
                onClick={() => sendAnswer(i)}
                className="option-area-client"
              >
                <FontAwesomeIcon
                  icon={icons[i]}
                  size="4x"
                  style={{ color: "#ffffff" }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Result(props: { state: ResultState }) {
  const { rank, score } = props.state;
  return (
    <>
      <div className={`result-client ${score > 0 ? "green" : "red"}`}>
        {score > 0 ? (
          <>
            <h1>Bingo!</h1>
            <FontAwesomeIcon
              className="icon-client"
              icon={faCheck}
              size="4x"
              style={{ color: "white" }}
            />
            <div className="score-container">+ {score}</div>
            <small>You're no. {rank}</small>
          </>
        ) : (
          <>
            <h1>Wrong!</h1>
            <FontAwesomeIcon
              className="icon-client"
              icon={faXmark}
              size="5x"
              style={{ color: "white" }}
            />
          </>
        )}
      </div>
    </>
  );
}

function EndGame(props: { state: EndGameState }) {
  // @ts-ignore
  const { rank, correctQuestions, totalQuestions } = props.state;

  return (
    <>
      <div className="end-game-client">
        <h1>You are in the 1st Place!</h1>
        <p>3 of 3 are correct</p>
      </div>
    </>
  );
}
