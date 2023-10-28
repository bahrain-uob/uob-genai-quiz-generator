import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import { getUserId } from "../lib/helpers";
import { filesize } from "filesize";

function MaterialsTable({
  isSelecting,
  courseId,
}: {
  isSelecting: boolean;
  courseId: string;
}) {
  const [materials, setMaterials] = useState([] as any);
  useEffect(() => {
    updateMaterial();
  }, []);

  const updateMaterial = async () => {
    let userId = await getUserId();
    let { results } = await Storage.list(`${userId}/${courseId}/materials/`, {
      pageSize: 1000,
    });
    const prefix_len = userId.length + courseId.length + 9 + 3;
    results.forEach((obj) => {
      obj.key = obj.key!.slice(prefix_len);
      obj.lastModified = obj.lastModified!.toLocaleDateString("en-GB") as any;
      obj.size = filesize(obj.size!, { round: 0 }) as any;
    });

    setMaterials(results);
  };

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
          {materials.map((material: any) => (
            <tr>
              <td>
                {isSelecting ? (
                  <input type="checkbox" />
                ) : (
                  <FontAwesomeIcon icon={faFile} size="xl" />
                )}
              </td>
              <td>{material.key}</td>
              <td>{material.size}</td>
              <td>{material.lastModified}</td>
              <td>
                {!isSelecting && <FontAwesomeIcon icon={faTrash} size="xl" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaterialsTable;
