import {
  faCheck,
  faCloud,
  faMeteor,
  faStar,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { caravalAtom, caravalQuestion } from "../lib/store";
import { atom, useAtom, useAtomValue } from "jotai";
import { QRCodeSVG } from "qrcode.react";
import { useState, useCallback, useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import caraval from "../assets/Caraval-comp.svg";
import Confetti from "react-confetti";
import "../caraval.css";
import Modal from "react-modal";

interface PreGameState {
  kind: "preGameState";
}

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
  | PreGameState
  | RegisterState
  | QuestionState
  | ScoreboardState
  | EndGameState;

const qIndexAtom = atom(0);

const gameId = crypto.randomUUID();
const gameUrl = `${import.meta.env.VITE_APP_SOCKET_URL}?gameId=${gameId}`;
const socketUrl = `${gameUrl}&master=true`;

export function GameServer() {
  const [state, setState] = useState({ kind: "preGameState" } as ServerState);
  const questions = useAtomValue(caravalAtom);

  const { sendMessage: innerSendMessage, lastMessage } =
    useWebSocket(socketUrl);
  const [events, setEvents] = useState([] as string[]);

  const [usernames, innerSetUsernames] = useState(new Map());
  const setUsernames = (k: string, v: string) =>
    innerSetUsernames(new Map(usernames.set(k, v)));

  const answers = useRef([] as sendAnswer[]);
  const scores = useRef(new Map());
  const marks = useRef(new Map());

  const [qIndex, setQIndex] = useAtom(qIndexAtom);
  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data) as ClientMessage;
      console.log(message);
      if (message.action == "sendUsername") {
        setUsernames(message.connectionId!, message.username);
        scores.current.set(message.connectionId!, 0);
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

  return (
    <div>
      {state.kind == "preGameState" && <PreGame setState={setState} />}
      {state.kind == "registerState" && (
        <Register usernames={usernames} setState={setState} />
      )}
      {state.kind == "questionState" && (
        <Question
          send={send}
          answers={answers}
          setGlobalState={setState}
          scores={scores}
          marks={marks}
          qIndex={qIndex}
          questions={questions}
        />
      )}
      {state.kind == "scoreboardState" && (
        <Scoreboard
          usernames={usernames}
          scores={scores}
          setGlobalState={setState}
          setState={setState}
          send={send}
          setQIndex={setQIndex}
          qIndex={qIndex}
          questions={questions}
        />
      )}
      {state.kind == "endGameState" && (
        <Endgame
          usernames={usernames}
          scores={scores}
          marks={marks}
          send={send}
        />
      )}
    </div>
  );
}

function PreGame(props: { setState: (s: RegisterState) => void }) {
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    if (timer <= 0) {
      props.setState({ kind: "registerState" });
    }
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000);
  }, [timer]);
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

  const [modal, setModal] = useState(false);

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
          <div
            className={`header-text ${modal ? "modal" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => setModal(true)}
          >
            Join by scanning the QR
          </div>
          <div
            title="CLICK ME!"
            className={`QR ${modal ? "modal" : ""}`}
            onClick={() => setModal(true)}
          >
            <QRCodeSVG
              style={{
                width: "100px",
                height: "100px",
                cursor: "pointer",
              }}
              value={`${window.location.origin}/join?gameId=${gameId}`}
            />
          </div>
        </div>
        <div className="body">
          <div
            className={`start-wrapper ${modal ? "modal" : ""}`}
            onClick={start}
          >
            <div className="start-game">
              <a>start</a>
            </div>
          </div>

          <div className={`body-title ${modal ? "modal" : ""}`}>
            <h1>Caraval!</h1>
          </div>
          <div className="names-container">
            {[...props.usernames.values()].map((username) => (
              <div key={crypto.randomUUID()} className="name-area">
                <p>{username}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        contentLabel="QR modal"
        style={bg}
      >
        <div className="close-QR" onClick={() => setModal(false)}>
          <p>close</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "5%",
          }}
        >
          <QRCodeSVG
            style={{
              width: "450px",
              height: "450px",
            }}
            value={`${window.location.origin}/join?gameId=${gameId}`}
          />
        </div>
      </Modal>
    </>
  );
}

const bg = {
  content: {
    background: "#f2e9e4",
    borderRadius: "15px",
    border: "none",
  },
};

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
  marks: any;
  qIndex: number;
  questions: caravalQuestion[];
}) {
  const [state, setState] = useState({
    kind: "questionOnlyState",
  } as InnerQuestionState);
  return (
    <div>
      {state.kind == "questionOnlyState" && (
        <QuestionOnly
          send={props.send}
          setState={setState}
          qIndex={props.qIndex}
          questions={props.questions}
        />
      )}
      {state.kind == "questionOptionsState" && (
        <QuestionOptions
          send={props.send}
          setGlobalState={props.setGlobalState}
          answers={props.answers}
          scores={props.scores}
          marks={props.marks}
          setState={props.setGlobalState}
          qIndex={props.qIndex}
          questions={props.questions}
        />
      )}
    </div>
  );
}

function QuestionOnly(props: {
  send: (m: pubQuestion) => void;
  setState: (s: QuestionOptionsState) => void;
  qIndex: number;
  questions: caravalQuestion[];
}) {
  const currentQuestion = props.questions[props.qIndex];

  const [timer, setTimer] = useState(5);
  useEffect(() => {
    if (timer <= 0) {
      props.setState({ kind: "questionOptionsState" });
      props.send({
        action: "pubQuestion",
        noOptions: currentQuestion.choices.length,
        questionIndex: props.qIndex,
        totalQuestions: props.questions.length,
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
  marks: any;
  setState: (s: ScoreboardState) => void;
  qIndex: number;
  questions: caravalQuestion[];
}) {
  const next = () => {
    props.setState({ kind: "scoreboardState" });
    props.answers.current = [];
  };
  const currentQuestion = props.questions[props.qIndex];

  const [timer, setTimer] = useState(10);
  useEffect(() => {
    if (timer == 0) {
      const min = Math.min(
        ...props.answers.current.map((obj: any) => obj.time),
      );
      const max = Math.max(
        ...props.answers.current
          .filter(
            (answer: sendAnswer) =>
              answer.answer == currentQuestion.answer_index,
          )
          .map((obj: sendAnswer) => obj.time),
      );
      const range = max - min + 1;

      const calculateScore = (t: number) =>
        Math.floor(700 + 300 * (1 - (t - min) / range));

      const currentScore = new Map();

      for (let answer of props.answers.current) {
        const correct = answer.answer == currentQuestion.answer_index;
        const score = correct ? calculateScore(answer.time) : 0;
        currentScore.set(answer.connectionId, score);
        props.scores.current.set(
          answer.connectionId,
          (props.scores.current.get(answer.connectionId) ?? 0) + score,
        );
        props.marks.current.set(
          answer.connectionId,
          (props.marks.current.get(answer.connectionId) ?? 0) +
            (correct ? 1 : 0),
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

    const skipTime = props.answers.current.length == props.scores.current.size;
    timer > 0 && setTimeout(() => setTimer(skipTime ? 0 : timer - 1), 1000);
  }, [timer]);

  const icons = [faCloud, faSun, faMeteor, faStar];
  const ogColors = ["#d55e00", "#f0e442", "#019e73", "#56b4e9"];
  const fadedColors = ["#d55c008e", "#f0e4429c", "#019e746f", "#56b3e98e"];

  return (
    <>
      <div className="question-options">
        <div className="question">
          <p> {currentQuestion.question}</p>
        </div>
        <div className="middle">
          <div className="timer">
            <div className="back"></div>
            {timer}
          </div>
          <div className="answers">
            <p>{props.answers.current.length}</p>
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
                <div className="link_wrapper" onClick={next}>
                  <a>Next</a>
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

function Scoreboard(props: {
  usernames: any;
  scores: any;
  setGlobalState: (s: QuestionState | EndGameState) => void;
  setState: (s: QuestionState | EndGameState) => void;
  send: (m: pubQuestion) => void;
  qIndex: number;
  setQIndex: any;
  questions: caravalQuestion[];
}) {
  const nextQuestion = () => {
    if (props.questions.length == props.qIndex + 1) {
      props.setState({ kind: "endGameState" });
    } else {
      props.setQIndex(props.qIndex + 1);
      props.setState({ kind: "questionState" });
    }
  };

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
          <div className="next-question-wrapper" onClick={nextQuestion}>
            <div className="next-question">
              <a>Next</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Endgame(props: {
  scores: any;
  marks: any;
  usernames: any;
  send: (m: pubEnd) => void;
}) {
  const rankMap = new Map(
    [...props.scores.current.entries()].sort((a, b) => b[1] - a[1]),
  );
  const totalQuestions = useAtomValue(caravalAtom).length;

  useEffect(() => {
    let i = 0;
    rankMap.forEach((_totalScore, connId) => {
      props.send({
        action: "pubEnd",
        connectionId: connId as string,
        rank: i + 1,
        correctQuestions: props.marks.current.get(connId) ?? 0,
        totalQuestions,
      });
      i++;
    });
  }, []);

  const medals = ["G", "S", "B"];
  const medalWord = ["ra", "Ca", "val!"];

  return (
    <>
      <div className="end-game">
        <Confetti
          colors={["#f44336", "#9c27b0", "#3f51b5"]}
          wind={0.03}
          gravity={0.1}
          width={window.innerWidth - 30}
        />

        <div className="firework"></div>
        <div className="firework"></div>
        <div className="firework"></div>
        <div className="ranks">
          {[...rankMap].slice(0, 3).map(([connId, score], index) => {
            return (
              <div
                key={connId as string}
                className={`rank-${String(index + 1)}`}
              >
                <div className="name">{`${
                  props.usernames.get(connId) ?? connId
                }`}</div>
                <div className="details">
                  <div className="medal">
                    <div className="medal-icon" data-medal={medals[index]}>
                      <span>{medalWord[index]}</span>
                    </div>
                  </div>
                  <div className="score"> {`${score}`}</div>
                  <div className="mark">
                    {props.marks.current.get(connId) ?? 0} out of{" "}
                    {totalQuestions}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
