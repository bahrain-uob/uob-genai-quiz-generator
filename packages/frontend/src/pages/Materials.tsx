import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MaterialsTable from "../components/MaterialsTable";
import Navbar from "../components/Navbar";
import Titles from "../components/Title";
import { StorageManager } from "@aws-amplify/ui-react-storage";
import "@aws-amplify/ui-react/styles.css";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import {
  faX,
  faCloudArrowUp,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { getUserId } from "../lib/helpers";
import { navAtom } from "../lib/store";
import { useAtomValue } from "jotai";
import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom";

function Materials() {
  const { course_id, course_code, course_name } = useAtomValue(navAtom);
  const [uploadModal, setUploadModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    getUserId(setUserId);
  }, []);

  const navigation = useNavigate();
  const deleteCourse = async () => {
    await API.del("api", "/courses", { body: { id: course_id } });
    navigation("/courses");
  };

  return (
    <div>
      <Navbar active="none" />
      <div className="top-materials">
        <Titles title={[`${course_code} ${course_name}`, "Course Content"]} />
        <div style={{ marginLeft: "auto", display: "flex" }}>
          <button
            className="upload-button"
            onClick={() => setDeleteModal(true)}
            style={{ background: "#ac341e" }}
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="cloud-icon"
              size="xl"
              style={{ color: "white" }}
            />
            <p>Delete course</p>
          </button>
          <Modal
            isOpen={deleteModal}
            onRequestClose={() => setDeleteModal(false)}
            contentLabel="Delete course"
            style={bg}
          >
            <div className="modal-container delete">
              <h1>
                Are you sure you want to delete {` `}
                <strong>
                  {course_code} {course_name}
                </strong>
                ?
              </h1>
              <div className="modal-buttons-container">
                <button onClick={deleteCourse}>Confirm</button>{" "}
                <button onClick={() => setDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          </Modal>
          <button
            className="upload-button"
            onClick={() => setUploadModal(true)}
          >
            <FontAwesomeIcon
              icon={faCloudArrowUp}
              className="cloud-icon"
              size="xl"
              style={{ color: "white" }}
            />
            <p>Upload</p>
          </button>
        </div>
        <Modal
          isOpen={uploadModal}
          onRequestClose={() => {
            setUploadModal(false);
            window.location.reload();
          }}
          contentLabel="Upload Material Modal"
          style={bg}
        >
          <div className="modal-content">
            <div className="x">
              <FontAwesomeIcon
                icon={faX}
                onClick={() => {
                  setUploadModal(false);
                  window.location.reload();
                }}
                className="x-icon"
                size="xl"
                style={{ color: "#5c617f" }}
              />
            </div>
            <h1>Upload Course Content</h1>
            <div className="upload-container">
              <StorageManager
                maxFileCount={10}
                accessLevel="public"
                path={`${userId}/${course_id}/materials/`}
                acceptedFileTypes={[
                  "pdf",
                  "docx",
                  "pptx",
                  "mp4",
                  "txt",
                  "png",
                  "jpeg",
                  "jpg",
                ]}
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
    background: "transparent",
    borderRadius: "15px",
    border: "none",
  },
};
export default Materials;
