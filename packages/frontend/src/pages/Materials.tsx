import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MaterialsTable from "../components/MaterialsTable";
import Navbar from "../components/Navbar";
import Titles from "../components/Title";
import { StorageManager } from "@aws-amplify/ui-react-storage";
import "@aws-amplify/ui-react/styles.css";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import { faX, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { getUserId } from "../lib/helpers";
import { navAtom } from "../lib/store";
import { useAtomValue } from "jotai";

function Materials() {
  const { course_id, course_code, course_name } = useAtomValue(navAtom);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    getUserId(setUserId);
  }, []);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <Navbar active="none" />
      <div className="top-materials">
        <Titles title={[`${course_code} ${course_name}`, "Course Content"]} />
        <button className="upload-button" onClick={openModal}>
          <FontAwesomeIcon
            icon={faCloudArrowUp}
            className="cloud-icon"
            size="xl"
            style={{ color: "white" }}
          />
          <p>Upload</p>
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
              style={{ color: "#5c617f" }}
            />
          </div>
          <div className="modal-content">
            <h1>Upload Course Content</h1>
            <div className="upload-container">
              <StorageManager
                maxFileCount={5}
                accessLevel="public"
                path={`${userId}/${course_id}/materials/`}
              />
            </div>
          </div>
        </Modal>
      </div>
      <MaterialsTable courseId={course_id} isSelecting={false} />
    </div>
  );
}
const bg = {
  content: {
    background: "#f5efec",
    borderRadius: "15px",
    border: "none",
  },
};
export default Materials;
