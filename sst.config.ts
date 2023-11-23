import { SSTConfig } from "sst";
import { FrontendStack } from "./stacks/FrontendStack";
import { DBStack } from "./stacks/DBStack";
import { ApiStack } from "./stacks/ApiStack";
import { FunctionStack } from "./stacks/FunctionStack";
import { AuthStack } from "./stacks/AuthStack";
import { ImageBuilderForCodeCatalyst } from "./stacks/ImageBuilderForCodeCatalyst";

export default {
  config(_input) {
    return {
      name: "uob-genai-quiz-generator",
      region: "us-east-1",
    };
  },
  stacks(app) {
    // Remove all resources when non-prod stages are removed
    if (app.stage !== "prod") {
      app.setDefaultRemovalPolicy("destroy");
    }
    if (app.stage == "devops") {
      app.stack(ImageBuilderForCodeCatalyst)
    }
    else
    {
      app
        .stack(DBStack)
        .stack(FunctionStack)
        .stack(AuthStack)
        .stack(ApiStack)
        .stack(FrontendStack);
    }
  },
} satisfies SSTConfig;
