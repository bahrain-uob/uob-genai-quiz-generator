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

export const quizAtom = atomWithStorage("quiz", {
  courseId: "",
  name: "",
  versions: 1,
  mcq: 0,
  tf: 0,
  fillBlank: 0,
});

export const stageAtom = atomWithStorage("stage", 0);
