import Excel from "exceljs";
import { Mcq } from "./store";

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
export const convertXML = (data) => {
  const quiz = data;
  let xml = "<quiz>\n";
  xml += '  <question type="category">\n';
  xml += "    <category>\n";
  xml += `     <text>${quiz.name}</text>\n`;
  xml += "    </category>\n";
  xml += "  </question>\n";

  // Convert mcqArr
  quiz.mcqArr.forEach((mcq: Mcq) => {
    xml += '  <question type="multichoice">\n';
    xml += "    <name>\n";
    xml += `      <text><![CDATA[question]]></text>\n`;
    xml += "    </name>\n";
    xml += '    <questiontext format="html">\n';
    xml += `      <text><![CDATA[${mcq.question}]]></text>\n`;
    xml += "    </questiontext>\n";

    mcq.choices.forEach((choice, index) => {
      xml += `    <answer fraction="${
        index === mcq.answer_index ? "100" : "0"
      }">\n`;
      xml += `      <text><![CDATA[${choice}]]></text>\n`;
      xml += "    </answer>\n";
    });

    xml += "    <shuffleanswers>0</shuffleanswers>\n";
    xml += "    <single>true</single>\n";
    xml += "    <answernumbering>none</answernumbering>\n";
    xml += "  </question>\n";
  });

  // Convert TfArr
  quiz.TfArr.forEach((tf) => {
    xml += '  <question type="truefalse">\n';
    xml += "    <name>\n";
    xml += `      <text><![CDATA[question]]></text>\n`;
    xml += "    </name>\n";
    xml += '    <questiontext format="html">\n';
    xml += `      <text><![CDATA[${tf.question}]]></text>\n`;
    xml += "    </questiontext>\n";

    xml += `    <answer fraction="100">\n`;
    xml += "      <text><![CDATA[true]]></text>\n";
    xml += "    </answer>\n";
    xml += `    <answer fraction="0">\n`;
    xml += "      <text><![CDATA[false]]></text>\n";
    xml += "    </answer>\n";

    xml += "  </question>\n";
  });

  // Convert fibArr
  quiz.fibArr.forEach((fib) => {
    xml += '  <question type="shortanswer">\n';
    xml += "    <name>\n";
    xml += `      <text><![CDATA[question]]></text>\n`;
    xml += "    </name>\n";
    xml += '    <questiontext format="html">\n';
    xml += `      <text><![CDATA[${fib.question}]]></text>\n`;
    xml += "    </questiontext>\n";

    xml += `    <answer fraction="100">\n`;
    xml += `      <text><![CDATA[${fib.answer}]]></text>\n`;
    xml += "    </answer>\n";

    xml += "  </question>\n";
  });

  xml += "</quiz>";
  return xml;
};
