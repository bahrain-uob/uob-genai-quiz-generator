import AudioRecorder from "../components/AudioRecorder";
import Navbar from "../components/Navbar";

function Record() {
  return (
    <>
      <Navbar active="record" />
      <AudioRecorder />
    </>
  );
}

export default Record;
