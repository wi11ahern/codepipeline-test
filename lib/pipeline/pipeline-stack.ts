import { App, SecretValue, Stack, StackProps, Stage } from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { PersonalEc2DeploymentStage } from "./personal-ec2-deployment-stage";

export class PipelineStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const synthStep = new ShellStep("Synth", {
      input: CodePipelineSource.gitHub("wi11ahern/codepipeline-test", "main", {
        authentication: SecretValue.secretsManager("GITHUB_TOKEN", {
          jsonField: "GITHUB_TOKEN",
        }),
      }),
      commands: ["npm ci", "npm run build", "npx cdk synth"],
      primaryOutputDirectory: "cdk.out",
    });

    const pipeline = new CodePipeline(this, "MyPipeline", {
      pipelineName: "Codepipeline-Test",
      synth: synthStep,
    });

    pipeline.addStage(new PersonalEc2DeploymentStage(this, "Deploy"));
  }
}
