import MaterialsTable from "../components/MaterialsTable";
import Navbar from "../components/Navbar";
import Titles from "../components/Title";
import Upload from "../components/Upload";

function Materials() {
  return (
    <div>
      <Navbar />
      <div className="top-materials">
        <Titles title={["ITCS448 Cloud Computing", "Course Content"]} />
        <Upload />
      </div>
      <MaterialsTable isSelecting={false} />
    </div>
  );
}

export default Materials;
