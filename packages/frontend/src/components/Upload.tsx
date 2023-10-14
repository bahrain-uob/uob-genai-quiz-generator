import { StorageManager } from "@aws-amplify/ui-react-storage";
import "@aws-amplify/ui-react/styles.css";

function Upload() {
  return (
    <div className="upload-container">
      <StorageManager maxFileCount={5} accessLevel="public" />
    </div>
  );
}

export default Upload;
