import { PrimitiveAtom, atom, useAtom, useAtomValue } from "jotai";
import { FillBlank, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";
import FillBlankQuestionArea from "./FillBlankQuestionArea";
import { splitAtom } from "jotai/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";

const FillBlanksAtom = focusAtom(quizAtom, (optic) => optic.prop("fibArr"));
const FillBlanksAtomsAtom = splitAtom(FillBlanksAtom);
const generatedAtom = atom([] as FillBlank[]);
const generatedAtomsAtom = splitAtom(generatedAtom);

const courseIdAtom = focusAtom(quizAtom, (optic) => optic.prop("courseId"));
const materialsAtom = focusAtom(quizAtom, (optic) => optic.prop("materials"));
const noQuestionAtom = focusAtom(quizAtom, (optic) => optic.prop("fillBlank"));

function FillBlankQuestionsSetup(props: { inFlight: any }) {
  const [generated, generatedDispatch] = useAtom(generatedAtomsAtom);
  const [selected, selectedDispatch] = useAtom(FillBlanksAtomsAtom);
  const gArr = useAtomValue(generatedAtom);
  const sArr = useAtomValue(FillBlanksAtom);

  const courseId = useAtomValue(courseIdAtom);
  const materials = useAtomValue(materialsAtom);
  const no_questions = useAtomValue(noQuestionAtom);
  const [maybeGen, setMaybeGen] = useState({});

  // generating question using AI, MAGIC
  useEffect(() => {
    if (props.inFlight.current) return;
    if (gArr.length + sArr.length < no_questions) {
      props.inFlight.current = true;
      (async () => {
        try {
          const question = await API.post("api", "/fib", {
            body: {
              materials: materials,
              course_id: courseId,
            },
          });
          generatedDispatch({
            type: "insert",
            value: { id: crypto.randomUUID(), ...question },
          });
        } catch {}
        props.inFlight.current = false;
        setMaybeGen({});
      })();
    }
  }, [maybeGen, gArr, sArr]);

  const [parent] = useAutoAnimate();

  const selectQuestion = (question: PrimitiveAtom<FillBlank>) => {
    return (q: FillBlank) => {
      generatedDispatch({ type: "remove", atom: question });
      selectedDispatch({ type: "insert", value: q });
    };
  };

  const removeSelected = (question: PrimitiveAtom<FillBlank>) => {
    return () => selectedDispatch({ type: "remove", atom: question });
  };

  const removeGenerated = (question: PrimitiveAtom<FillBlank>) => {
    return () => generatedDispatch({ type: "remove", atom: question });
  };

  return (
    <div className="questions-setup" style={{ backgroundColor: "#F2E9E4" }}>
      <h3>Customize the Fill-in Blank Questions</h3>

      <div className="questions">
        <div ref={parent} className="generated">
          <h4 style={{ textAlign: "center" }}>Generated Questions</h4>
          {generated.length + selected.length < no_questions && (
            <div className="loading-state">
              <div className="lds-dual-ring"></div>
              <p>generating..</p>
            </div>
          )}
          {generated.map((question, index) => (
            <FillBlankQuestionArea
              key={gArr[index].id}
              question={question}
              isSelected={false}
              add={selectQuestion(question)}
              remove={removeGenerated(question)}
            />
          ))}
        </div>

        <div ref={parent} className="selected">
          <h4 style={{ textAlign: "center" }}>Selected Questions</h4>

          {selected.map((question, index) => (
            <FillBlankQuestionArea
              key={sArr[index].id}
              question={question}
              isSelected={true}
              remove={removeSelected(question)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default FillBlankQuestionsSetup;
