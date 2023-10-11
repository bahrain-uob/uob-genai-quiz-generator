export async function get() {
  return {
    statusCode: 200,
    body: JSON.stringify([
      {
        // TODO: add a field to identify which material was used
        name: "Quiz 1",
        creation_date: "01-01-2023",
        questions: [
          {
            kind: "MCQ",
            stem: "What is S3?",
            choices: [
              "Simple Storage Service",
              "Simple SMS Service",
              "Smart Storage Service",
              "Scalable Storage Service",
            ],
            answer: "Simple Storage Service",
          },
        ],
      },
    ]),
  };
}

export async function post() {
  return {
    statusCode: 200,
    body: "TODO",
  };
}
