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
