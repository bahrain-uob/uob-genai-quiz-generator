import {
  faCheck,
  faCloud,
  faMeteor,
  faStar,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { Mcq } from "../lib/store";
import { atom, useAtomValue } from "jotai";
import { QRCodeSVG } from "qrcode.react";
import { useState, useCallback, useEffect, useRef } from "react";
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

const qIndexAtom = atom(0);
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

const gameId = crypto.randomUUID();
const gameUrl = `${import.meta.env.VITE_APP_SOCKET_URL}?gameId=${gameId}`;
const socketUrl = `${gameUrl}&master=true`;

export function GameServer() {
  const [state, setState] = useState({ kind: "preGameState" } as ServerState);

  const {
    sendMessage: innerSendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl);
  const [events, setEvents] = useState([] as string[]);

  // const questions = useAtomValue(questionsAtom);

  const [usernames, innerSetUsernames] = useState(new Map());
  const setUsernames = (k: string, v: string) =>
    innerSetUsernames(new Map(usernames.set(k, v)));

  const answers = useRef([] as sendAnswer[]);
  const scores = useRef(new Map());

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data) as ClientMessage;
      console.log(message);
      if (message.action == "sendUsername") {
        setUsernames(message.connectionId!, message.username);
        setEvents([`${message.username} joined!`, ...events]);
      }
      if (message.action == "sendAnswer") {
        answers.current.push({ ...message });
        setEvents([
          `${usernames.get(message.connectionId)} answered "${message.answer}"`,
          ...events,
        ]);
      }
    }
  }, [lastMessage]);

  const send = useCallback((message: ServerMessage) => {
    if (message.action)
      innerSendMessage(JSON.stringify({ ...message, gameId }));
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
      {state.kind == "registerState" && (
        <Register usernames={usernames} setState={setState} />
      )}
      {state.kind == "questionState" && (
        <Question
          send={send}
          answers={answers}
          setGlobalState={setState}
          scores={scores}
        />
      )}
      {state.kind == "scoreboardState" && (
        <Scoreboard usernames={usernames} scores={scores} />
      )}
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
      <h1>{gameId}</h1>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <div style={{ display: "flex" }}>
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
            <div key={crypto.randomUUID()}>
              <span>{message}</span>
              <br />
            </div>
          ))}
        </div>
      </div>
    </div>
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

function Register(props: {
  usernames: any;
  setState: (s: QuestionState) => void;
}) {
  const start = () => {
    props.setState({ kind: "questionState" });
  };
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
          <button onClick={start} className="start-button">
            Start
          </button>
          <div className="body-title">
            <h1>Caraval!</h1>
          </div>
          <div className="names-container">
            {[...props.usernames.values()].map((username) => (
              <div key={crypto.randomUUID()} className="name-area">
                {username}
              </div>
            ))}
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

type InnerQuestionState = QuestionOnlyState | QuestionOptionsState;

function Question(props: {
  send: (m: any) => void;
  answers: any;
  setGlobalState: (s: ScoreboardState) => void;
  scores: any;
}) {
  const [state, setState] = useState({
    kind: "questionOnlyState",
  } as InnerQuestionState);
  return (
    <div>
      {state.kind == "questionOnlyState" && (
        <QuestionOnly send={props.send} setState={setState} />
      )}
      {state.kind == "questionOptionsState" && (
        <QuestionOptions
          send={props.send}
          setGlobalState={props.setGlobalState}
          answers={props.answers}
          scores={props.scores}
        />
      )}
    </div>
  );
}

function QuestionOnly(props: {
  send: (m: pubQuestion) => void;
  setState: (s: QuestionOptionsState) => void;
}) {
  const qIndex = useAtomValue(qIndexAtom);
  const questions = useAtomValue(questionsAtom);
  const currentQuestion = questions[qIndex];

  const [timer, setTimer] = useState(1);
  useEffect(() => {
    if (timer <= 0) {
      props.setState({ kind: "questionOptionsState" });
      props.send({
        action: "pubQuestion",
        noOptions: currentQuestion.choices.length,
        questionIndex: qIndex,
        totalQuestions: questions.length,
      });
    }
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
  }, [timer]);

  return (
    <>
      <div className="question-only">
        <h1>{currentQuestion.question}</h1>
      </div>
    </>
  );
}

function QuestionOptions(props: {
  send: (m: pubResult) => void;
  setGlobalState: (s: ScoreboardState) => void;
  answers: any;
  scores: any;
}) {
  const qIndex = useAtomValue(qIndexAtom);
  const questions = useAtomValue(questionsAtom);
  const currentQuestion = questions[qIndex];

  const [timer, setTimer] = useState(10);
  useEffect(() => {
    if (timer == 0) {
      const min = Math.min(
        ...props.answers.current.map((obj: any) => obj.time),
      );
      const max = Math.max(
        ...props.answers.current.map((obj: any) => obj.time),
      );
      const range = max - min + 1;

      const calculateScore = (t: number) =>
        Math.floor(700 + 300 * (1 - (t - min) / range));

      const currentScore = new Map();

      for (let answer of props.answers.current) {
        const score =
          answer.answer == currentQuestion.answer_index
            ? calculateScore(answer.time)
            : 0;
        currentScore.set(answer.connectionId, score);
        props.scores.current.set(
          answer.connectionId,
          (props.scores.current.get(answer.connectionId) ?? 0) + score,
        );
      }

      const rankMap = new Map(
        [...props.scores.current.entries()].sort((a, b) => b[1] - a[1]),
      );

      let i = 0;
      rankMap.forEach((_totalScore, connId) => {
        props.send({
          action: "pubResult",
          connectionId: connId as string,
          rank: i + 1,
          score: currentScore.get(connId) ?? 0,
        });
        i++;
      });
    }
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
  }, [timer]);

  const icons = [faCloud, faSun, faMeteor, faStar];
  const ogColors = ["#d55e00", "#f0e442", "#019e73", "#56b4e9"];
  const fadedColors = ["#d55c008e", "#f0e4429c", "#019e746f", "#56b3e98e"];

  return (
    <>
      <div className="question-options">
        <div className="question">
          <p> Can you clone kahoot in a weekend?</p>
        </div>
        <div className="middle">
          <div className="timer">
            <div className="back"></div>
            {timer}
          </div>
          <div className="answers">
            <p>0</p>
            <p>Answers</p>
          </div>

          <div
            style={{
              position: "absolute",
              right: "2rem",
              bottom: "1rem",
            }}
          >
            {timer == 0 && (
              <div className="next-wrapper">
                <div className="link_wrapper">
                  <a href="#">Next</a>
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 268.832 268.832"
                    >
                      <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="options">
          {[...Array(currentQuestion.choices.length).keys()].map((i) => {
            return (
              <div
                key={i}
                className={"option-area"}
                style={{
                  backgroundColor:
                    timer > 0 || currentQuestion.answer_index == i
                      ? ogColors[i]
                      : fadedColors[i],
                }}
              >
                <FontAwesomeIcon
                  icon={icons[i]}
                  size="2x"
                  style={{ color: "#ffffff" }}
                />
                <p>{currentQuestion.choices[i]}</p>
                {timer == 0 && i == currentQuestion.answer_index && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    size="2x"
                    style={{ color: "#ffffff", margin: "0px 20px 0px auto" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Scoreboard(props: { usernames: any; scores: any }) {
  const rankMap = new Map(
    [...props.scores.current.entries()].sort((a, b) => b[1] - a[1]),
  );

  return (
    <>
      <div className="scoreboard">
        <div className="header">Scoreboard</div>
        <div className="body">
          <div className="score-table">
            {[...rankMap].map(([connId, score]) => {
              return (
                <div key={connId as string} className="score-item">
                  <div className="name">{`${
                    props.usernames.get(connId) ?? connId
                  }`}</div>
                  <div className="score">{`${score}`}</div>
                </div>
              );
            })}
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
            <div className="name">Jaffar</div>
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
