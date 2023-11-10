import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
query Repositories($orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, $searchKeyword: String, $after: String, $first: Int) {
  repositories(orderBy: $orderBy, orderDirection: $orderDirection, searchKeyword: $searchKeyword, after: $after, first: $first) {
      edges {
        cursor
        node {
          fullName
          ownerAvatarUrl
          description
          language
          ratingAverage
          reviewCount
          stargazersCount
          ownerName
          forksCount
          id
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const GET_REPOSITORY = gql`
query Query($repositoryId: ID!, $first: Int, $after: String) {
  repository(id: $repositoryId) {
    fullName
    ownerAvatarUrl
    description
    language
    ratingAverage
    reviewCount
    stargazersCount
    ownerName
    forksCount
    id
    url
    reviews(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
      }
      totalCount
      edges {
        node {
          id
          text
          rating
          createdAt
          user {
            id
            username
          }
        }
      }
    }
  }
}
`;

export const GET_CURRENT_USER = gql`
query getCurrentUser($includeReviews: Boolean = false) {
  me {
    id
    username
    reviews @include(if: $includeReviews) {
      edges {
        node {
          id
          createdAt
          rating
          text
          repositoryId
        }
      }
    }
  }
}
`;