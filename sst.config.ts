import { SSTConfig } from "sst";
import { FrontendStack } from "./stacks/FrontendStack";
import { ApiStack } from "./stacks/ApiStack";
import { CoreStack } from "./stacks/CoreStack";
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
      app.stack(ImageBuilderForCodeCatalyst);
    } else {
      app
        .stack(CoreStack)
        .stack(AuthStack)
        .stack(ApiStack)
        .stack(FrontendStack);
    }
  },
} satisfies SSTConfig;
