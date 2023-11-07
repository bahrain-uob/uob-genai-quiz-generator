import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFileArrowDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import { getUserId } from "../lib/helpers";
import { filesize } from "filesize";
import { quizAtom } from "../lib/store";
import { useAtom } from "jotai";
import { focusAtom } from "jotai-optics";

const materialsAtom = focusAtom(quizAtom, (optic) => optic.prop("materials"));

function MaterialsTable({
  isSelecting,
  courseId,
}: {
  isSelecting: boolean;
  courseId: string;
}) {
  const [materials, setMaterials] = useState([] as any);
  const [quizMaterials, setQuizMaterials] = useAtom(materialsAtom);
  useEffect(() => {
    updateMaterial().then(preCheck);
  }, []);

  const preCheck = () => {
    for (let material of quizMaterials) {
      let target: any = document.getElementById(material);
      if (target) target.checked = true;
    }
  };

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

  const deleteMaterial = async (index: number) => {
    const name = materials[index].key;
    const copy = [...materials];
    copy.splice(index, 1);
    setMaterials(copy);

    const userId = await getUserId();
    const key = `${userId}/${courseId}/materials/${name}`;
    await Storage.remove(key);
  };

  const downloadMaterial = async (index: number) => {
    const name = materials[index].key;
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

  const selectMaterial = (key: string) => {
    const target: any = document.getElementById(key);
    target.checked = !target.checked;
    if (target.checked) setQuizMaterials(quizMaterials.concat(target.id));
    else setQuizMaterials(quizMaterials.filter((m) => m != key));
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
          {materials.map((material: any, index: number) => (
            <tr onClick={() => selectMaterial(material.key)}>
              <td>
                {isSelecting ? (
                  <input type="checkbox" id={material.key} />
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
