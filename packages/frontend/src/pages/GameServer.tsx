import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Mcq } from "../lib/store";
import { atom, useAtomValue } from "jotai";
import { QRCodeSVG } from "qrcode.react";
import { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface RegisterState {
  kind: "registerState";
}

interface QuestionState {
  kind: "questionState";
}

interface ScoreboardState {
  kind: "scoreboardState";
}

interface EndGameState {
  kind: "endGameState";
}

type ServerState =
  | RegisterState
  | QuestionState
  | ScoreboardState
  | EndGameState;

const questionsAtom = atom([
  {
    question: "can you clone kahoot in a weekend?",
    choices: ["yes", "no", "maybe", "idk"],
    answer_index: 0,
  },
  {
    question: "whats 9 + 10",
    choices: ["21", "19", "12", "3"],
    answer_index: 0,
  },
] as Mcq[]);

// const gameId = crypto.randomUUID();
const gameId = "mcq";
const gameUrl = `${import.meta.env.VITE_APP_SOCKET_URL}?gameId=${gameId}`;
const socketUrl = `${gameUrl}&username=master&master=true`;

const usernames = new Map();

export function GameServer() {
  const {
    sendMessage: innerSendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);
  const [events, setEvents] = useState([] as string[]);

  const questions = useAtomValue(questionsAtom);
  const [qIndex, setQIndex] = useState(0);

  const [scores, innerSetScores] = useState(new Map());
  const setScores = (k: string, v: number) =>
    innerSetScores(new Map(scores.set(k, v)));

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data) as ClientMessage;
      console.log(message);
      if (message.action == "sendName") {
        usernames.set(message.connectionId, message.username);
        setEvents([`${message.username} joined!`, ...events]);
      }
      if (message.action == "sendAnswer") {
        if (
          questions[message.questionIndex as any].answer_index == message.answer
        ) {
          setScores(
            message.connectionId!,
            (scores.get(message.connectionId!) ?? 0) + 1,
          );
        }
        setEvents([
          `${usernames.get(message.connectionId)} answered "${message.answer}"`,
          ...events,
        ]);
      }
    }
  }, [lastMessage]);

  const send = useCallback((message: ServerMessage) => {
    if (message.action) innerSendMessage(JSON.stringify(message));
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
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <div style={{ display: "flex" }}>
        <h1>{qIndex}</h1>
        <h1 onClick={() => setQIndex((qIndex + 1) % questions.length)}>NEXT</h1>
      </div>
      <div style={{ display: "flex" }}>
        <QuestionArea
          key={qIndex}
          question={{ ...questions[qIndex], id: qIndex as any }}
          send={send}
        />
        <div style={{ margin: "10px" }}>
          <QRCodeSVG
            style={{ margin: "50px" }}
            value={`https://educraft.com/join?gameId=${gameId}`}
          />
          <p>{gameId}</p>
        </div>
        <div style={{ marginLeft: "20px" }}>
          <h1
            onClick={() => {
              console.log("SCORE");
              console.log(scores);
              console.log("QUESTIONS");
              console.log(questions);
            }}
          >
            Events
          </h1>
          {events.map((message) => (
            <div>
              <span>{message}</span>
              <br />
            </div>
          ))}
          <h1>Scores</h1>
          {[...scores.entries()].map(([k, v]) => {
            return (
              <p>
                {usernames.get(k)}: {v}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuestionArea({
  question,
  send,
}: {
  question: Mcq;
  send: (message: ServerMessage) => void;
}) {
  const sendQuestion = () => {
    send({
      action: "pubQuestion",
      gameId,
      questionIndex: 0,
      noOptions: question.choices.length,
      totalQuestions: 10,
    });
  };

  const colors = ["#d55e00", "#56b4e9", "#019e73", "#f0e442"];

  return (
    <>
      <div className="question-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <FontAwesomeIcon
            icon={faPlusCircle}
            size="2x"
            className="faMinusCircle"
            onClick={sendQuestion}
          />

          <textarea
            style={{ padding: "5px" }}
            rows={2}
            cols={35}
            defaultValue={question.question}
          ></textarea>

          {question.choices.map((choice: string, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "5px",
              }}
            >
              <label style={{ fontSize: "medium" }}>{index + 1})</label>
              <input
                style={{
                  backgroundColor: colors[index],
                }}
                type="text"
                defaultValue={choice}
              />
            </div>
          ))}
        </form>
      </div>
    </>
  );
}
