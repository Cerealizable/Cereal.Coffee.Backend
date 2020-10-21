import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const create = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  console.log("Tablename: ", process.env.tableName);
  const params = {
      TableName : process.env.tableName,
      // 'Item' attributes
      // - 'companyId': company identities are federated through the Cognito Identity Pool,
      //          identity id = company id of the authenticated company
      // - 'productId': a unique uuid
      // - 'content': parsed from request body
      // - 'attachment': parsed from request body
      // - 'createdAt': current Unix timestamp

      Item: {
          companyId: event.requestContext.identity.cognitoIdentityId,
          productId: uuid.v1(),
          content: data.content,
          attachment: data.attachment,
          price: data.price,
          createdAt: Date.now()
      }
  };

  await dynamoDb.put(params);

  return params.Product;
});

export const get = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'companyId': Identity Pool identity id of the authenticated user
    // TODO: update companyId to be the companyId of the authenticated user
    // - 'productId': path parameter
    Key: {
      companyId: event.requestContext.identity.cognitoIdentityId,
      productId: event.pathParameters.id
    }
  };

  const result = await dynamoDb.get(params);
  if ( ! result.Item) {
    throw new Error("Item not found.");
  }
  // Return the retrieved item
  return result.Item;
});

export const list = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'companyId = :companyId': only return items with matching 'companyId' partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id of the authenticated user
    KeyConditionExpression: "companyId = :companyId",
    ExpressionAttributeValues: {
      ":companyId": event.requestContext.identity.cognitoIdentityId
    }
  };
  const result = await dynamoDb.query(params);
  // Return the matching list of items in response body
  return result.Items;
});

export const update = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'companyId': Identity Pool identity id of the authenticated users company
    // - 'productId': path parameter
    Key: {
      companyId: event.requestContext.identity.cognitoIdentityId,
      productId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":content": data.content || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };
  await dynamoDb.update(params);
  return { status: true };
});

export const del = handler(async (event, context) => {
  const params = {
      TableName: process.env.tableName,
      // 'Key' defines the partition key and sort key of the item to be removed
      // - 'companyId': Identity Pool identity id of the authenticated users company
      // - 'productId': path parameter
      Key: {
        companyId: event.requestContext.identity.cognitoIdentityId,
        productId: event.pathParameters.id
      }
  };
  await dynamoDb.delete(params);
  return { status: true };
});