#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PipelineStack } from "./codepipeline-test-stack";
import { PersonalEc2Stack } from "./personal-ec2-stack";

const app = new cdk.App();
new PipelineStack(app, "PipelineStack", {});
new PersonalEc2Stack(app, "PersonalEc2Stack", {});
app.synth();
