import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: UserResponse;
  register: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  options: UserInputLogin;
};


export type MutationRegisterArgs = {
  options: UserInputRegister;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
};

export type Recipe = {
  __typename?: 'Recipe';
  id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  ingredients: Array<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  owner: User;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type ResponseData = {
  __typename?: 'ResponseData';
  user: User;
  token: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  recipes?: Maybe<Array<Recipe>>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserInputLogin = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type UserInputRegister = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  data?: Maybe<ResponseData>;
};

export type LoginMutationVariables = Exact<{
  options: UserInputLogin;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { data?: Maybe<(
      { __typename?: 'ResponseData' }
      & Pick<ResponseData, 'token'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username' | 'createdAt' | 'updatedAt'>
      ) }
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'createdAt' | 'updatedAt'>
  )> }
);


export const LoginDocument = gql`
    mutation Login($options: UserInputLogin!) {
  login(options: $options) {
    data {
      user {
        id
        username
        createdAt
        updatedAt
      }
      token
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    createdAt
    updatedAt
  }
}
    `;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};