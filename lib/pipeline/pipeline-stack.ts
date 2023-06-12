import { App, SecretValue, Stack, StackProps } from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { PersonalEc2DeploymentStage } from "./personal-ec2-deployment-stage";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export class PipelineStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipelineRole = new Role(this, "PipelineRole", {
      roleName: "PipelineRole",
      assumedBy: new ServicePrincipal("codepipeline.amazonaws.com"),
    });
    pipelineRole.addManagedPolicy({
      managedPolicyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
    });

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
      role: pipelineRole,
      synth: synthStep,
      codeBuildDefaults: {
        rolePolicy: [
          new PolicyStatement({
            actions: ["ssm:GetParameter"],
            resources: ["*"],
          }),
        ],
      },
    });

    pipeline.addStage(new PersonalEc2DeploymentStage(this, "Deploy", props));
  }
}
