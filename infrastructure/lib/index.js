import S3Stack from "./S3Stack";
import CognitoStack from "./CognitoStack";
import DynamoDBStack from "./DynamoDBStack";
import Product_DynamoDBStack from "./Product_DynamoDBStack";


// Add stacks
export default function main(app) {
  new DynamoDBStack(app, "dynamodb");

  new Product_DynamoDBStack(app, "productDynamodb");

  const s3 = new S3Stack(app, "s3");

  new CognitoStack(app, "cognito", { bucketArn: s3.bucket.bucketArn });
}