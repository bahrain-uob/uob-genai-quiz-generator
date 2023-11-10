import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFileArrowDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { Storage } from "aws-amplify";
import { getUserId } from "../lib/helpers";
import { filesize } from "filesize";
import { useImmerAtom } from "jotai-immer";
import { materialsAtom } from "../lib/store";

function MaterialsTable({
  isSelecting,
  courseId,
}: {
  isSelecting: boolean;
  courseId: string;
}) {
  const [materials, setMaterials] = useImmerAtom(materialsAtom);
  useEffect(() => {
    updateMaterial();
  }, []);

  const updateMaterial = async () => {
    const userId = await getUserId();
    let { results: response } = await Storage.list(
      `${userId}/${courseId}/materials/`,
      {
        pageSize: 1000,
      },
    );
    const prefix_len = userId.length + courseId.length + 9 + 3;
    const results = response.map((obj) => {
      return {
        key: obj.key!.slice(prefix_len),
        lastModified: obj.lastModified!.toLocaleDateString("en-GB") as any,
        size: filesize(obj.size!, { round: 0 }) as any,
      };
    });

    setMaterials((draft) => {
      // @ts-ignore
      draft[courseId] = results;
    });
  };

  const deleteMaterial = async (index: number) => {
    // @ts-ignore
    const fileName = materials[courseId][index].key;
    setMaterials((draft) => {
      // @ts-ignore
      draft[courseId].splice(index, 1);
    });

    const userId = await getUserId();
    const key = `${userId}/${courseId}/materials/${fileName}`;
    await Storage.remove(key);
  };

  const downloadMaterial = async (index: number) => {
    // @ts-ignore
    const name = materials[courseId][index].key;
    const userId = await getUserId();
    const key = `${userId}/${courseId}/materials/${name}`;
    const result = await Storage.get(key, { download: true });
    downloadBlob(result.Body, name);
  };

  const downloadBlob = (blob: any, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener("click", clickHandler);
      }, 150);
    };
    a.addEventListener("click", clickHandler, false);
    a.click();
    return a;
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
            {!isSelecting && <th></th>}
          </tr>
        </thead>
        <tbody>
          {/* @ts-ignore*/}
          {(materials[courseId] ?? []).map((material: any, index: number) => (
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
                <FontAwesomeIcon
                  style={{ cursor: "pointer" }}
                  icon={faFileArrowDown}
                  size="xl"
                  onClick={() => downloadMaterial(index)}
                />
              </td>
              {!isSelecting && (
                <td>
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    icon={faTrash}
                    size="xl"
                    onClick={() => {
                      deleteMaterial(index);
                    }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaterialsTable;
