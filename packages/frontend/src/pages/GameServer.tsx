import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Mcq } from "../lib/store";
import { PrimitiveAtom, atom, useAtom } from "jotai";
import { QRCodeSVG } from "qrcode.react";
import { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const question = atom({
  id: crypto.randomUUID(),
  question: "can you clone kahoot in a weekend?",
  choices: ["yes", "no", "maybe", "idk"],
  answer_index: 0,
} as Mcq);

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

  const [questions, innerSetQuestions] = useState(new Map());
  const setQuestions = (k: string, v: number) =>
    innerSetQuestions(new Map(questions.set(k, v)));

  const [scores, innerSetScores] = useState(new Map());
  const setScores = (k: string, v: number) =>
    innerSetScores(new Map(scores.set(k, v)));

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data) as ClientMessage;
      console.log(message);
      if (message.action == "joinGame") {
        usernames.set(message.connectionId, message.username);
        setEvents([`${message.username} joined!`, ...events]);
      }
      if (message.action == "sendAnswer") {
        if (questions.get(message.questionId) == message.answer) {
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
    if (message.questionId) setQuestions(message.questionId, message.answer);
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
        <QuestionArea question={question} send={send} />
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

function QuestionArea(props: {
  question: PrimitiveAtom<Mcq>;
  send: (message: ServerMessage) => void;
}) {
  const [question, setQuestion] = useAtom(props.question);

  function handleQuestionChange(event: any) {
    const updatedQuestion = { ...question, question: event.target.value };
    setQuestion(updatedQuestion);
  }

  function handleChoiceChange(event: any, index: number) {
    const updatedQuestion = { ...question };
    updatedQuestion.choices[index] = event.target.value;
    setQuestion(updatedQuestion);
  }

  const send = () => {
    const q = {
      questionId: crypto.randomUUID(),
      question: question.question,
      choices: question.choices,
      answer: question.answer_index,
    };
    props.send({
      action: "pubQuestion",
      gameId,
      ...q,
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
            onClick={send}
          />

          <textarea
            style={{ padding: "5px" }}
            rows={2}
            cols={35}
            defaultValue={question.question}
            onChange={(e) => handleQuestionChange(e)}
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
              <label
                onClick={() =>
                  setQuestion({ ...question, answer_index: index })
                }
                style={{ fontSize: "medium" }}
              >
                {index + 1})
              </label>
              <input
                style={{
                  backgroundColor: colors[index],
                }}
                type="text"
                defaultValue={choice}
                onChange={(e) => handleChoiceChange(e, index)}
              />
            </div>
          ))}
        </form>
      </div>
    </>
  );
}
