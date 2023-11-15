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
export const materialsAtom = atomWithStorage("materialsList", {});
export const quizzesAtom = atomWithStorage("quizzesList", {});

export interface Mcq {
  id: string;
  question: string;
  choices: string[];
  answer_index: number;
}

export interface Tf {
  id: string;
  question: string;
  answer: boolean;
}

export interface FillBlank {
  id: string;
  question: string;
  answer: string;
}

export const quizAtom = atomWithStorage("quiz", {
  courseId: "",
  materials: [] as string[],
  name: "",
  versions: 1,
  mcq: 0,
  tf: 0,
  fillBlank: 0,
  mcqArr: [] as Mcq[],
  TfArr: [] as Tf[],
  fibArr: [] as FillBlank[],
});

export const stageAtom = atomWithStorage("stage", 0);
