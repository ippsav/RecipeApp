import { withUrqlClient } from "next-urql";
import React, { SyntheticEvent, useState } from "react";
import { Layout } from "../components/Layout";
import { useLoginMutation, UserInputLogin } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useStore } from "../store/index";
import { useRouter } from "next/router";

const Login = () => {
  const initialState: UserInputLogin = {
    password: "",
    usernameOrEmail: "",
  };
  const router = useRouter();
  const { setUserState } = useStore();
  const [_, login] = useLoginMutation();
  const [state, setState] = useState(initialState);
  const { usernameOrEmail, password } = state;
  const handleChange = (e: SyntheticEvent<any>) => {
    if (e.currentTarget.name === "username") {
      setState({ ...state, usernameOrEmail: e.currentTarget.value });
    } else {
      setState({ ...state, password: e.currentTarget.value });
    }
  };
  const handleSubmit = async (e: SyntheticEvent<any>) => {
    e.preventDefault();
    console.log(state);
    const { data } = await login({ options: state });
    if (data) {
      const { login } = data;
      if (login.errors) {
        console.log(login.errors);
      } else if (login.data) {
        const { user, token } = login.data;
        setUserState({ user, token });
        router.push("/home");
      }
    }
  };
  return (
    <Layout>
      <div className="flex items-center justify-center h-full w-full ">
        <div className=" w-1/3 h-auto bg-white rounded-3xl p-8 ">
          <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
            Sign Into Your Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 ">
              <div>
                <label className="block" htmlFor="username">
                  Username:{" "}
                </label>
                <input
                  name="username"
                  type="text"
                  className=" w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none"
                  placeholder="username"
                  value={usernameOrEmail}
                  onChange={handleChange}
                ></input>
              </div>
              <div>
                <label className="block" htmlFor="password">
                  Password:{" "}
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={handleChange}
                  className=" w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none"
                ></input>
              </div>
              <button
                type="submit"
                className="block border border-gray-300 w-2/4 mx-auto py-4 bg-gray-700 text-white rounded-3xl"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient)(Login);
