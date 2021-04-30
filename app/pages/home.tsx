import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const [{ data, error, fetching }] = useMeQuery();
  if (error) {
    console.log(error);
    return (
      <Layout>
        <div>Error</div>
      </Layout>
    );
  }
  if (fetching)
    return (
      <Layout>
        <div>Loading ...</div>
      </Layout>
    );
  if (data)
    return (
      <Layout>
        <div>{data.me?.username}</div>
      </Layout>
    );
  return (
    <Layout>
      <div>Home</div>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Home);
