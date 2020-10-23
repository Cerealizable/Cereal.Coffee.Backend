import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

// TODO: create the products table
// TODO: set table name in params
// TODO: set the filter on the params by companyId


export const main = handler(async (event, context) => {
  console.log("tableName ", process.env.tableName);
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    KeyConditionExpression: "companyId = :companyId",
    ExpressionAttributeValues: {
      ":companyId": event.requestContext.identity.companyId
    }
  };

  const result = await dynamoDb.query(params);

  // Return the matching list of items in response body
  return result.Items;
});