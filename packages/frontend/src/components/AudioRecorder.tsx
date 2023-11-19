import { useState, useRef } from "react";
import { Storage } from "aws-amplify";
import { getUserId } from "../lib/helpers";
import { quizAtom, stageAtom } from "../lib/store";
import { useAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { useNavigate } from "react-router-dom";

const mimeType = "audio/webm";
const quizMaterialsAtom = focusAtom(quizAtom, (optic) =>
  optic.prop("materials")
);
const quizCourseIdAtom = focusAtom(quizAtom, (optic) => optic.prop("courseId"));

function AudioRecorder() {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<
    "inactive" | "recording"
  >("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [canGenerate, setCanGenerate] = useState<boolean>(false);
  async function getMicrophonePermission() {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  }

  async function startRecording() {
    setRecordingStatus("recording");
    const media = new MediaRecorder(stream!, {
      type: mimeType,
    } as MediaRecorderOptions);
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    const localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };

    setAudioChunks(localAudioChunks);
  }

  function stopRecording() {
    setRecordingStatus("inactive");
    mediaRecorder.current!.stop();
    mediaRecorder.current!.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      setAudioBlob(audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);

      setAudioChunks([]);
    };
  }

  async function uploadToS3() {
    const userId = await getUserId();
    await Storage.put(
      `${userId}/33e64777-7a00-45af-bbde-957fd6e07319/materials/ben.webm`,
      audioBlob!,
      { contentType: mimeType }
    );
    setCanGenerate(true);
  }
  const [stepNo, setStepNo] = useAtom(stageAtom);
  const navigation = useNavigate();
  const [quizMaterials, setQuizMaterials] = useAtom(quizMaterialsAtom);
  const [quizCourseId, setQuizCourseId] = useAtom(quizCourseIdAtom);
  function generateQuiz() {
    console.log("anfkdn");
    setQuizMaterials(quizMaterials.concat("ben.webm"));
    setQuizCourseId("33e64777-7a00-45af-bbde-957fd6e07319");
    setStepNo(2);
    navigation("/createQuiz");
  }

  return (
    <div className="audio-controls">
      {!permission ? (
        <button onClick={getMicrophonePermission} type="button">
          Get Microphone
        </button>
      ) : null}
      {permission && recordingStatus === "inactive" ? (
        <button onClick={startRecording} type="button">
          Start Recording
        </button>
      ) : null}
      {recordingStatus === "recording" ? (
        <button onClick={stopRecording} type="button">
          Stop Recording
        </button>
      ) : null}
      {audio ? (
        <div className="audio-container">
          <audio src={audio} controls></audio>
          <a download href={audio}>
            Download Recording
          </a>
        </div>
      ) : null}
      <button onClick={() => uploadToS3()}>Press to save in S3</button>
      {canGenerate && (
        <button onClick={() => generateQuiz()}>generate quiz</button>
      )}
    </div>
  );
}

export default AudioRecorder;
