import { Stage, StageProps } from "aws-cdk-lib";
import { PersonalEc2Stack } from "../personal-ec2-stack";
import { Construct } from "constructs";

export class PersonalEc2DeploymentStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new PersonalEc2Stack(this, "PersonalEc2Stack", {});
  }
}
