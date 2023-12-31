#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PipelineStack } from "./pipeline/pipeline-stack";

const app = new cdk.App();
new PipelineStack(app, "PipelineStack", {
  env: {
    account: "513627050200",
    region: "us-east-1",
  },
});
app.synth();
