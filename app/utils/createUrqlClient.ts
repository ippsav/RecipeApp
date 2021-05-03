import {
  ClientOptions,
  dedupExchange,
  fetchExchange,
  makeOperation,
  Operation,
} from "@urql/core";
import { authExchange } from "@urql/exchange-auth";
import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { useStore } from "../store";


const refreshToken =async () =>{
        const response = await fetch("http://localhost:7001/refresh_token", {
          credentials: "include" as const,
          method: "POST",
        });
        return (await response.json()).accessToken;
}

export const createUrqlClient = (ssrExchange: any): ClientOptions => ({
  url: "http://localhost:7001/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({}),
    authExchange({
      addAuthToOperation({
        authState,
        operation,
      }: {
        authState: { token: string };
        operation: Operation<any, any>;
      }) {
        if (!authState || !authState.token) {
          return operation;
        }
        const fetchOptions = operation.context.fetchOptions || {};
        return makeOperation(operation.kind, operation, {
          ...operation.context,
          fetchOptions: {
            ...fetchOptions,
            headers: {
              authorization: `bearer ${authState.token}`,
            },
          },
        });
      },
      didAuthError: ({ error }) => {
        return error.graphQLErrors.some(
          (e) => e.extensions?.code === "FORBIDDEN"
        );
      },
      getAuth: async ({ authState }) => {
        if (!authState) {
          const token = useStore.getState().token || await refreshToken();
          if (token) {
            return { token };
          }
          return null;
        }
        const token = await refreshToken();
        if(token){
          return {token}
        }
        return null;
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
