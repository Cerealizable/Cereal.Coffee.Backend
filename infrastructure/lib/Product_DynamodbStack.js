import { CfnOutput } from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as sst from "@serverless-stack/resources";

export default class Product_DynamoDBStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const app = this.node.root;

    const table = new dynamodb.Table(this, "Products", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use on-demand billing mode
      sortKey: { name: "productId", type: dynamodb.AttributeType.STRING },
      partitionKey: { name: "companyId", type: dynamodb.AttributeType.STRING },
    });

    // Output values
    new CfnOutput(this, "Product-TableName", {
      value: table.tableName,
      exportName: app.logicalPrefixedName("Product-TableName"),
    });
    new CfnOutput(this, "Product-TableArn", {
      value: table.tableArn,
      exportName: app.logicalPrefixedName("Product-TableArn"),
    });
  }
}