#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from './codepipeline-test-stack';

const app = new cdk.App();
new PipelineStack(app, 'PipelineStack', {});

app.synth();