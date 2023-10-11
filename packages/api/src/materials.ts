export async function get() {
  return {
    statusCode: 200,
    body: JSON.stringify([
      { name: "Chapter 1", size: 120, upload_date: "01-01-2023" },
      { name: "Chapter 2", size: 240, upload_date: "02-02-2023" },
    ]),
  };
}

export async function post() {
  return {
    statusCode: 200,
    body: "TODO",
  };
}
