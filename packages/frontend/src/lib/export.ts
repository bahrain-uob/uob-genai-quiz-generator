import Excel from "exceljs";
import { FillBlank, Mcq, Tf } from "./store";
// @ts-ignore
import * as br from "braille";

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

  for (const tf of quiz.TfArr) {
    sheet.getCell(`B${cursor}`).value = tf.question; // stem

    let char = 67; // ascii C
    sheet.getCell(`${String.fromCharCode(char++)}${cursor}`).value = "True";
    sheet.getCell(`${String.fromCharCode(char++)}${cursor}`).value = "False";

    sheet.getCell(`G${cursor}`).value = 15; // TODO: allow for setting variable time limit
    sheet.getCell(`H${cursor}`).value = tf.answer ? 1 : 2;
    cursor++;
  }

  const buffer = await book.xlsx.writeBuffer();
  downloadBlob(new Blob([buffer]), `${quiz.name}-kahoot.xlsx`);
};

export const exportMoodle = (quiz: any) => {
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
  quiz.TfArr.forEach((tf: Tf) => {
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
  quiz.fibArr.forEach((fib: FillBlank) => {
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

  downloadBlob(new Blob([xml]), `${quiz.name}.xml`);
};

export const exportMarkdown = (quiz: any) => {
  let question_number = 1;
  let md = `# ${quiz.name}\n\n`;
  const letter = ["a", "b", "c", "d"];

  // Convert TfArr
  md += "### True or False\n\n";
  quiz.TfArr.forEach((q: Tf) => {
    md += `${question_number}. **${q.question}**\n\n`;
    md += `    Answer:  **${q.answer}**\n\n`;
    question_number++;
  });
  md += "---\n";

  // Convert mcqArr
  md += "### Multiple Choices\n\n";
  quiz.mcqArr.forEach((q: Mcq) => {
    md += `${question_number}. **${q.question}**\n\n`;

    q.choices.forEach((choice, index) => {
      md += `    - ${letter[index]}) ${choice}\n`;
    });

    md += `  - Answer: **(${letter[q.answer_index]})**\n\n`;
    question_number++;
  });
  md += "---\n";

  // Convert fibArr
  md += "### Fill in the Blank\n\n";
  quiz.fibArr.forEach((q: FillBlank) => {
    md += `${question_number}. **${q.question}**\n\n`;
    md += `    Answer:  **${q.answer}**\n\n`;
    question_number++;
  });
  md += "---\n";

  downloadBlob(new Blob([md]), `${quiz.name}.txt`);
};

export const exportBraille = (quiz: any) => {
  let question_number = 1;
  let braille = br.toBraille(`${quiz.name}`) + "\n\n";
  const letter = ["a", "b", "c", "d"];

  // Convert TfArr
  braille += br.toBraille("True or False") + "\n\n";
  quiz.TfArr.forEach((q: Tf) => {
    braille += br.toBraille(`${question_number}. ${q.question}`) + "\n\n";
    braille += br.toBraille(`    Answer  ${q.answer}`) + "\n\n";
    question_number++;
  });
  braille += br.toBraille("--------------------") + "\n\n";

  // Convert mcqArr
  braille += br.toBraille("Multiple Choices") + "\n\n";
  quiz.mcqArr.forEach((q: Mcq) => {
    braille += br.toBraille(`${question_number}. ${q.question}`) + "\n\n";
    q.choices.forEach((choice, index) => {
      braille += br.toBraille(`    - ${letter[index]} ${choice}`) + "\n\n";
    });

    braille += br.toBraille(`  - Answer (${letter[q.answer_index]})`) + "\n\n";
    question_number++;
  });
  braille += br.toBraille("--------------------") + "\n\n";

  // Convert fibArr
  braille += br.toBraille("Fill in the Blank") + "\n\n";
  quiz.fibArr.forEach((q: FillBlank) => {
    braille += br.toBraille(`${question_number}. ${q.question}`) + "\n\n";
    braille += br.toBraille(`    Answer  ${q.answer}`) + "\n\n";
    question_number++;
  });
  braille += br.toBraille("--------------------") + "\n\n";

  downloadBlob(new Blob([braille]), `${quiz.name}.braille.txt`);
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
