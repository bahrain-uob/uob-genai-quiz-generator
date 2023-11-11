import Excel from "exceljs";

export const exportKahoot = async (quiz: any) => {
  // start from cell 9
  // B    : stem
  // C..F : answers
  // G    : time limit
  // H    : correct answer index starting from 1
  const kahootFile = await (
    await fetch("/kahootTemplate.xlsx", {
      cache: "force-cache",
    })
  ).arrayBuffer();
  const book = new Excel.Workbook();
  await book.xlsx.load(kahootFile);
  const sheet = book.getWorksheet(1)!;

  let cursor = 9; // the questions start from row 9
  for (const mcq of quiz.mcqArr) {
    sheet.getCell(`B${cursor}`).value = mcq.question; // stem

    let char = 67; // ascii C
    for (const choice of mcq.choices) {
      sheet.getCell(`${String.fromCharCode(char++)}${cursor}`).value = choice; // each choice
    }

    sheet.getCell(`G${cursor}`).value = 15; // TODO: allow for setting variable time limit
    sheet.getCell(`H${cursor}`).value = mcq.answer_index + 1; // anwser index starting from 1
    cursor++;
  }
  const buffer = await book.xlsx.writeBuffer();
  downloadBlob(new Blob([buffer]), `${quiz.name}-kahoot.xlsx`);
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener("click", clickHandler);
    }, 150);
  };
  a.addEventListener("click", clickHandler, false);
  a.click();
  return a;
};
