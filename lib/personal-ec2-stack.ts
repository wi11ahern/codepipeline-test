import { App, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  Peer,
  Port,
  SecurityGroup,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class PersonalEc2Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const defaultVpc = Vpc.fromLookup(this, "DefaultVpc", {
      isDefault: true,
    });

    const instanceRole = new Role(this, "InstanceRole", {
      roleName: "InstanceRole",
      assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
    });

    const instanceSecurityGroup = new SecurityGroup(
      this,
      "InstanceSecurityGroup",
      {
        vpc: defaultVpc,
        allowAllOutbound: true,
        securityGroupName: "InstanceSecurityGroup",
      }
    );
    instanceSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(22),
      "Allow SSH access from the internet."
    );
    instanceSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(80),
      "Allow HTTP access from the internet."
    );
    instanceSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(443),
      "Allow HTTPS access from the internet."
    );

    const instance = new Instance(this, "Instance", {
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.NANO),
      vpc: defaultVpc,
      securityGroup: instanceSecurityGroup,
      role: instanceRole,
      machineImage: MachineImage.latestAmazonLinux2(),
    });

    new CfnOutput(this, "InstancePublicIp", {
      value: instance.instancePublicIp,
    });
  }
}
