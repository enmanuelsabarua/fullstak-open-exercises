import { gql } from '@apollo/client';

export const SIGN_IN = gql`
mutation($credentials: AuthenticateInput) {
    authenticate(credentials: $credentials) {
      accessToken
    }
  }
`;

export const SIGN_UP = gql`
mutation ($user: CreateUserInput) {
  createUser(user: $user) {
    createdAt
    username
    id
    reviewCount
  }
}
`;

export const ADD_REVIEW = gql`
mutation ($review: CreateReviewInput) {
  createReview(review: $review) {
    text
    id
    rating
    createdAt
    repositoryId
    userId
  }
}
`;

export const DELETE_REVIEW = gql`
mutation Mutation($deleteReviewId: ID!) {
  deleteReview(id: $deleteReviewId)
}
`;