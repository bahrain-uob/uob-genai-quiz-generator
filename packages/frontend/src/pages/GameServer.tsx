import {
  faCheck,
  faCloud,
  faMeteor,
  faPlusCircle,
  faStar,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { Mcq } from "../lib/store";
import { atom, useAtomValue } from "jotai";
import { QRCodeSVG } from "qrcode.react";
import { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import caraval from "../assets/Caraval-comp.svg";
import Confetti from "react-confetti";
import "../caraval.css";

interface PreGameState {
  kind: "preGameState";
}

interface RegisterState {
  kind: "registerState";
}

interface QuestionState {
  kind: "questionState";
  // questionIndex: number;
  // noOptions: number;
  // answer: number;
}

interface ScoreboardState {
  kind: "scoreboardState";
}

interface EndGameState {
  kind: "endGameState";
}

type ServerState =
  | PreGameState
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
  const [state, setState] = useState({ kind: "preGameState" } as ServerState);

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
          //@ts-ignore
          questions[message.questionIndex as any].answer_index == message.answer
        ) {
          setScores(
            message.connectionId!,
            (scores.get(message.connectionId!) ?? 0) + 1
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
      {state.kind == "preGameState" && <PreGame />}
      {state.kind == "registerState" && <Register />}
      {state.kind == "questionState" && <Question />}
      {state.kind == "scoreboardState" && <Scoreboard />}
      {state.kind == "endGameState" && <Endgame />}
      <button onClick={() => setState({ kind: "preGameState" })}>
        preGame
      </button>
      <button onClick={() => setState({ kind: "registerState" })}>
        Register
      </button>
      <button onClick={() => setState({ kind: "questionState" })}>
        Question
      </button>
      <button onClick={() => setState({ kind: "scoreboardState" })}>
        Scoreboard
      </button>
      <button onClick={() => setState({ kind: "endGameState" })}>
        endGameState
      </button>
      <h1>IGNORE BELOW</h1>
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
          <h1>Events</h1>
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

function PreGame() {
  return (
    <>
      <div className="caraval">
        <img src={caraval} alt="caraval!" />
      </div>
    </>
  );
}

function Register() {
  return (
    <>
      <div className="register-caraval">
        <div className="area">
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div className="header">
          <div className="header-text">Join by scanning the QR</div>
          <div className="QR">
            <QRCodeSVG
              style={{ width: "77px", height: "77px", zIndex: "1" }}
              value={`https://educraft.com/join?gameId=${gameId}`}
            />
          </div>
        </div>
        <div className="body">
          <div className="body-title">
            <h1>Caraval!</h1>
            {/* <button className="start-button">Start</button> */}
          </div>
          <div className="names-container">
            <div className="name-area">Hamad</div>
            <div className="name-area">Maram</div>
            <div className="name-area">Jaffar</div>
            <div className="name-area">May</div>
            <div className="name-area">Fajer</div>
            <div className="name-area">Salman</div>
            <div className="name-area">Rana</div>
            <div className="name-area">Lana</div>
          </div>
        </div>
      </div>
    </>
  );
}

interface QuestionOnlyState {
  kind: "questionOnlyState";
}

interface QuestionOptionsState {
  kind: "questionOptionsState";
}

interface QuestionAnswerState {
  kind: "questionAnswerState";
}

type InnerQuestionState =
  | QuestionOnlyState
  | QuestionOptionsState
  | QuestionAnswerState;

function Question() {
  const [state, _setState] = useState({
    kind: "questionOptionsState",
  } as InnerQuestionState);
  return (
    <div>
      {state.kind == "questionOnlyState" && <QuestionOnly />}
      {state.kind == "questionOptionsState" && <QuestionOptions />}
    </div>
  );
}

function QuestionOnly() {
  return (
    <>
      <div className="question-only">
        <h1>Can you clone kahoot in a weekend?</h1>
      </div>
    </>
  );
}

function QuestionOptions() {
  const [showAns, setShowAns] = useState(true);
  return (
    <>
      <div className="question-options">
        <div className="question">
          <p> Can you clone kahoot in a weekend?</p>
        </div>
        <div className="middle">
          <div className="timer">19</div>
          <div className="answers">
            <p>0</p>
            <p>Answers</p>
          </div>
        </div>
        <div className="options">
          <div className="option-area" style={{ background: "#d55e00" }}>
            <FontAwesomeIcon
              icon={faCloud}
              size="2x"
              style={{ color: "#ffffff" }}
            />
            <p>Yes</p>
            <FontAwesomeIcon
              icon={faCheck}
              size="2x"
              style={{ color: "#ffffff", margin: "0px 20px 0px auto" }}
            />
          </div>
          <div
            className="option-area"
            style={{ background: showAns ? "#f0e4429c" : "#f0e442" }}
          >
            <FontAwesomeIcon
              icon={faSun}
              size="2x"
              style={{ color: "#ffffff" }}
            />
            <p>No</p>
          </div>

          <div
            className="option-area"
            style={{ background: showAns ? "#019e746f" : "#019e73" }}
          >
            <FontAwesomeIcon
              icon={faMeteor}
              size="2x"
              style={{ color: "#ffffff" }}
            />
            <p>Idk</p>
          </div>
          <div
            className="option-area"
            style={{ background: showAns ? "#56b3e98e" : "#56b4e9" }}
          >
            <FontAwesomeIcon
              icon={faStar}
              size="2x"
              style={{ color: "#ffffff" }}
            />
            <p>Maybe</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Scoreboard() {
  return (
    <>
      <div className="scoreboard">
        <div className="header">Scoreboard</div>
        <div className="body">
          <div className="score-table">
            <div className="score-item">
              <div className="name">Maram</div>
              <div className="score">1000</div>
            </div>
            <div className="score-item">
              <div className="name">Maram</div>
              <div className="score">950</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Endgame() {
  return (
    <>
      <div className="end-game">
        <Confetti
          colors={["#f44336", "#9c27b0", "#3f51b5"]}
          wind={0.03}
          gravity={0.1}
          width={window.innerWidth - 20}
        />

        <div className="firework"></div>
        <div className="firework"></div>
        <div className="firework"></div>
        {/* <div className="header">Podium</div> */}
        <div className="ranks">
          <div className="second">
            <div className="name">Maram</div>
            <div className="details">
              <div className="medal">
                <div className="medal-icon" data-medal="S">
                  <span>Ca</span>
                </div>
              </div>
              <div className="score">8000</div>
              <div className="mark">7 out of 10</div>
            </div>
          </div>
          <div className="first">
            <div className="name">Fatima</div>
            <div className="details">
              <div className="medal">
                <div className="medal-icon" data-medal="G">
                  <span>ra</span>
                </div>
              </div>
              <div className="score">11000</div>
              <div className="mark">10 out of 10</div>
            </div>
          </div>
          <div className="third">
            <div className="name">Maram</div>
            <div className="details">
              <div className="medal">
                <div className="medal-icon" data-medal="B">
                  <span>val!</span>
                </div>
              </div>
              <div className="score">7000</div>
              <div className="mark">6 out of 10</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
