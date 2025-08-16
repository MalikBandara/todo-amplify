/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getToDo = /* GraphQL */ `
  query GetToDo($id: ID!) {
    getToDo(id: $id) {
      id
      name
      description
      category
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listToDos = /* GraphQL */ `
  query ListToDos(
    $filter: ModelToDoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listToDos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        category
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listToDosByCategory = /* GraphQL */ `
  query ListToDosByCategory(
    $category: String!
    $sortDirection: ModelSortDirection
    $filter: ModelToDoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listToDosByCategory(
      category: $category
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        description
        category
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
