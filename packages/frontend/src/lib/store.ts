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
export const materialsAtom = atomWithStorage(
  "materialsList",
  {} as { [courseId: string]: any[] },
);
export const quizzesAtom = atomWithStorage(
  "quizzesList",
  {} as { [courseId: string]: any[] },
);

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
  mcq: 0,
  tf: 0,
  fillBlank: 0,
  mcqArr: [] as Mcq[],
  TfArr: [] as Tf[],
  fibArr: [] as FillBlank[],
});

export const stageAtom = atomWithStorage("stage", 0);

export type caravalQuestion = Omit<Mcq, "id">;
export const caravalAtom = atomWithStorage(
  "caravalQuestions",
  [] as caravalQuestion[],
);
