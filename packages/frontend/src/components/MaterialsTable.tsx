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
import { materialsAtom, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";
import { useAtom } from "jotai";
import emptymaterials from "../assets/Cool Kids - Bust-comp.svg";
import koala from "../assets/Sweet Koala-comp.svg";

const quizMaterialsAtom = focusAtom(quizAtom, (optic) =>
  optic.prop("materials")
);

function MaterialsTable({
  isSelecting,
  courseId,
}: {
  isSelecting: boolean;
  courseId: string;
}) {
  const [materials, setMaterials] = useImmerAtom(materialsAtom);
  const [quizMaterials, setQuizMaterials] = useAtom(quizMaterialsAtom);
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
    const userId = await getUserId();
    let { results: response } = await Storage.list(
      `${userId}/${courseId}/materials/`,
      {
        pageSize: 1000,
      }
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

  const selectMaterial = (key: string) => {
    const target: any = document.getElementById(key);
    target.checked = !target.checked;
    if (target.checked) setQuizMaterials(quizMaterials.concat(target.id));
    else setQuizMaterials(quizMaterials.filter((m) => m != key));
  };

  return (
    <div className="materials">
      {/* @ts-ignore*/}
      {(materials[courseId] ?? []).length == 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            margin: isSelecting ? "0px auto auto auto" : "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: !isSelecting ? "80px" : undefined,
            }}
          >
            <img
              src={isSelecting ? koala : emptymaterials}
              alt="nothing to see here"
              width={!isSelecting ? "250px" : undefined}
            />
            <p
              style={{
                color: "#4a4e69",
                fontSize: isSelecting ? "medium" : "large",
              }}
            >
              {isSelecting
                ? "This course does not have any content!"
                : "Add content to this course"}
            </p>
          </div>
        </div>
      )}

      {/* @ts-ignore*/}
      {(materials[courseId] ?? []).length > 0 && (
        <table style={{ marginTop: "5em" }}>
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
              <tr
                key={`${courseId}${material.key}`}
                onClick={() => selectMaterial(material.key)}
              >
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
      )}
    </div>
  );
}

export default MaterialsTable;
