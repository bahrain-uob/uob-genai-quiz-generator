# Educraft

EduCraft is an AI-powered tool designed to help instructors generate high-quality questions from their course material.
Whether you're creating quizzes, exams, or practice questions,
EduCraft streamlines the process, saving time and ensuring the questions are relevant and engaging.

## Features

- Supports All Formats: Generate questions from PDFs, Word documents, text files, and even videos. EduCraft transforms any content into engaging Multiple-Choice, Fill in the Blanks, and True/False questions.
- Customizable Quizzes: Adjust quiz settings effortlessly. Change question types, names, and quantities to match your assessment needs.
- Editable Questions: Fine-tune AI-generated questions to align perfectly with your learning objectives, ensuring clarity and relevance.
- Save and Reuse: Save your quizzes for future edits or reuse, streamlining your question bank management.
- Caraval Interactive Sessions: Host live, competitive quiz sessions with students. Join via QR code, compete for top scores, and enjoy real-time feedback with podium displays.
- Instant Summaries: Automatically generate concise summaries of uploaded materials, providing quick access to key information.

## Images Demo

### Course Material Page

![Image of course material page](/docs/images/material.png)

### Quiz Creation

![Image of quiz creation](/docs/images/generate_quiz.png)

### Saved Quiz

![Image of saved quiz](/docs/images/quiz.png)

### Caraval Interactive Game

![Image of caraval interactive game](/docs/images/caraval.png)

## Technologies Used

EduCraft leverages cutting-edge technologies to deliver a seamless and powerful experience. Here's what drives its innovation:

### Programming Languages

- TypeScript: Used in Frontend and API development
- Python: Used in backend processing

### Frameworks

- SST: Simplifying Infrastructure as Code (IaC) and DevOps
- React: Crafting an intuitive and dynamic frontend

### Services

- Bedrock: Enabling lightning-fast cross-region AI inference
- CloudFront: Accelerating frontend delivery with top-notch CDN capabilities
- S3: Reliable and secure website and content hosting
- DynamoDB: A blazing-fast, fully managed NoSQL database
- Lambda Functions:
  - Transcribing and extracting text with precision (Transcribe & Textract)
  - Powering API backends and real-time WebSocket connections
- API Gateway: Seamless API and WebSocket management
- Cognito: Effortless and secure user authentication with granular AWS permissions

## Development

After cloning run

```sh
npm install
npm run dev
```

To install dependencies and run your own development environment of the app.

For running the development environment for the frontend

```sh
cd packages/frontend
npm install
npm start
```

### More Commands

- `npm run build` Build your app and synthesize your stacks.
- `npm run deploy [stack]` Deploy all your stacks to AWS. Or optionally deploy, a specific stack.
- `npm run remove [stack]` Remove all your stacks and all of their resources from AWS. Or optionally removes, a specific stack.

## Documentation

Learn more.

- Cloud Architecture in `/docs/cloud-architecture.svg`
- [SST V2 Docs](https://v2.sst.dev/)
