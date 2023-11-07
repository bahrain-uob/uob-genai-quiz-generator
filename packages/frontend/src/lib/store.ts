import { atomWithStorage } from "jotai/utils";

export const navAtom = atomWithStorage("nav", {
  course_id: "",
  course_code: "",
  course_name: "",
});

export interface Course {
  id: string;
  code: string;
  name: string;
}

export const coursesAtom = atomWithStorage("coursesList", [] as Course[]);

export interface Mcq {
  question: string;
  choices: string[];
  answer_index: number;
}

export const quizAtom = atomWithStorage("quiz", {
  courseId: "",
  materials: [] as string[],
  name: "",
  versions: 1,
  mcq: 0,
  tf: 0,
  fillBlank: 0,
  mcqArr: [
    // {
    //   question: "S3?",
    //   choices: ["s", "simple", "stotage", "service"],
    //   answer_index: 0,
    // },
  ] as Mcq[],
});

export const stageAtom = atomWithStorage("stage", 0);
