export async function get() {
  return {
    statusCode: 200,
    body: JSON.stringify([
      { id: 1, code: "ITCS441", name: "Parallel" },
      { id: 2, code: "ITCS453", name: "Multimedia" },
    ]),
  };
}
