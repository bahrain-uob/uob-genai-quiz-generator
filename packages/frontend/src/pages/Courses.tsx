import Navbar from "../components/Navbar";
import Course from "../components/Course";
import Title from "../components/Title";

function Courses() {
  const courses = [
    {
      id: "1",
      code: "ITCS448",
      name: "Cloud Computing",
    },
    {
      id: "2",
      code: "ITCS441",
      name: "Parallel and Distributed Systems",
    },
    {
      id: "3",
      code: "ITCS440",
      name: "Intelligent Systems",
    },
    {
      id: "4",
      code: "ITCS496",
      name: "Physical Implementation of DBMS",
    },
    {
      id: "5",
      code: "ITCS444",
      name: "Mobile Application",
    },
    {
      id: "6",
      code: "ITCS453",
      name: "Multimedia",
    },
  ];

  return (
    <>
      <Navbar />

      <Title title={["My Courses"]} />

      <div className="courses-container">
        {courses.map((c) => (
          <Course id={c.id} code={c.code} name={c.name} />
        ))}
      </div>
    </>
  );
}

export default Courses;
