import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faTrash } from "@fortawesome/free-solid-svg-icons";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      draft[courseId] = results;
    });
  };

  const deleteMaterial = async (index: number) => {
    const fileName = materials[courseId][index].key;
    setMaterials((draft) => {
      draft[courseId].splice(index, 1);
    });

    toast("Successfully deleted", { type: "success" });
    const userId = await getUserId();
    const key = `${userId}/${courseId}/materials/${fileName}`;
    await Storage.remove(key);
  };

  const downloadMaterial = async (index: number) => {
    const name = materials[courseId][index].key;
    const userId = await getUserId();
    const key = `${userId}/${courseId}/materials/${name}`;
    toast("Download is in progress", { type: "info" });
    const result = await Storage.get(key, { download: true });
    downloadBlob(await result.Body!.blob(), name);
  };

  const downloadSummary = async (index: number) => {
    const name = materials[courseId][index].key + ".summary";
    const userId = await getUserId();
    const key = `${userId}/${courseId}/summaries/${name}`;
    try {
      const result = await Storage.get(key, {
        download: true,
      });
      downloadBlob(result.Body, name + ".txt");
    } catch (err) {
      toast("This might take a while, try again later", {
        type: "error",
      });
    }
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
    if (!isSelecting) return;
    const target: any = document.getElementById(key);
    target.checked = !target.checked;
    if (target.checked) setQuizMaterials(quizMaterials.concat(target.id));
    else setQuizMaterials(quizMaterials.filter((m) => m != key));
  };

  return (
    <div className="materials">
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

      {(materials[courseId] ?? []).length > 0 && (
        <table className={!isSelecting ? "course-content-table" : ""}>
          <thead>
            <tr className="heading">
              {isSelecting && <th></th>}
              <th>FILE NAME</th>
              <th>SIZE</th>
              <th>DATE</th>
              {!isSelecting && <th>ACTION</th>}
            </tr>
          </thead>
          <tbody>
            {(materials[courseId] ?? []).map((material: any, index: number) => (
              <tr
                key={`${courseId}${material.key}`}
                onClick={() => selectMaterial(material.key)}
              >
                {isSelecting && (
                  <td>
                    <input
                      type="checkbox"
                      id={material.key}
                      onClick={() => selectMaterial(material.key)}
                    />
                  </td>
                )}
                <td
                  className={!isSelecting ? "td" : ""}
                  style={{
                    borderRadius: !isSelecting ? "15px 0px 0px 15px" : "",
                  }}
                >
                  {isSelecting ? (
                    material.key
                  ) : (
                    <>
                      <details style={{ textAlign: "left" }}>
                        <summary>{material.key}</summary>
                        <button onClick={() => downloadSummary(index)}>
                          Download Summary
                        </button>
                      </details>
                    </>
                  )}
                </td>
                <td className={!isSelecting ? "td" : ""}>{material.size}</td>
                <td className={!isSelecting ? "td" : ""}>
                  {material.lastModified}
                </td>
                <td
                  className={!isSelecting ? "td" : ""}
                  style={{
                    borderRadius: !isSelecting ? "0px 15px 15px 0px" : "",
                  }}
                >
                  <FontAwesomeIcon
                    style={{
                      cursor: "pointer",
                      padding: "0.5rem 0.7rem",
                      background: "white",
                      borderRadius: "50px",
                      color: "#4a4e69",
                    }}
                    icon={faFileArrowDown}
                    size="lg"
                    onClick={() => downloadMaterial(index)}
                  />

                  {!isSelecting && (
                    <FontAwesomeIcon
                      style={{
                        cursor: "pointer",
                        padding: "0.5rem 0.6rem",
                        background: "white",
                        borderRadius: "50px",
                        color: "#4a4e69",
                        marginLeft: "0.7rem",
                      }}
                      icon={faTrash}
                      size="lg"
                      onClick={() => {
                        deleteMaterial(index);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ToastContainer />
    </div>
  );
}

export default MaterialsTable;
