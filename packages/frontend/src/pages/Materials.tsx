import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MaterialsTable from "../components/MaterialsTable";
import Navbar from "../components/Navbar";
import Titles from "../components/Title";
import Upload from "../components/Upload";
import Modal from "react-modal";
import { useState } from "react";
import { faX, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

function Materials() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { course_id, course_code, course_name } = useLocation().state as any;

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <Navbar />
      <div className="top-materials">
        <Titles title={[`${course_code} ${course_name}`, "Course Content"]} />
        <button className="upload-button-1" onClick={openModal}>
          <FontAwesomeIcon
            icon={faCloudArrowUp}
            onClick={closeModal}
            className="x-icon"
            size="xl"
            style={{ color: "white" }}
          />
        </button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Upload Material Modal"
          style={bg}
        >
          <div className="x">
            <FontAwesomeIcon
              icon={faX}
              onClick={closeModal}
              className="x-icon"
              size="xl"
              style={{ color: "#C7C7C7" }}
            />
          </div>
          <div className="modal-content">
            <h3>Upload Course Content</h3>
            <Upload />
            <button className="upload-button-2">Upload</button>
          </div>
        </Modal>
      </div>
      <MaterialsTable isSelecting={false} />
    </div>
  );
}
const bg = {
  content: {
    background: "#F5F5F5",
  },
  // overlay: {
  //   top: 40,
  //   left: 280,
  //   right: 280,
  //   bottom: 40,
  //   background: "rgba(245, 39, 145, 0)",
  // },
};
export default Materials;
