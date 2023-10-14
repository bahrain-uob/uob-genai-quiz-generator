import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faTrash } from "@fortawesome/free-solid-svg-icons";

function MaterialsTable(props: { isSelecting: boolean }) {
  return (
    <div className="materials">
      <table>
        <thead>
          <tr className="heading">
            <th></th>
            <th>FILE NAME</th>
            <th>SIZE</th>
            <th>DATE</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              {props.isSelecting ? (
                <input type="checkbox" />
              ) : (
                <FontAwesomeIcon icon={faFile} size="xl" />
              )}
            </td>
            <td>Chapter 1.pdf</td>
            <td>5 MB</td>
            <td>29/09/2023</td>
            <td>
              {!props.isSelecting && (
                <FontAwesomeIcon icon={faTrash} size="xl" />
              )}
            </td>
          </tr>

          <tr>
            <td>
              {props.isSelecting ? (
                <input type="checkbox" />
              ) : (
                <FontAwesomeIcon icon={faFile} size="xl" />
              )}
            </td>
            <td>Chapter 2.docx</td>
            <td>10 MB</td>
            <td>06/10/2023</td>
            <td>
              {!props.isSelecting && (
                <FontAwesomeIcon icon={faTrash} size="xl" />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MaterialsTable;
