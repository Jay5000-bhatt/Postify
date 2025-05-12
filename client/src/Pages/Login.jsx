import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthContext from "../Context/AuthContext";
import PostContext from "../Context/PostContext";

import MainLogo from "../assets/Main_Logo.png";
import isTokenValid from "../Utils/Auth";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { fetchPosts } = useContext(PostContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenValid("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await login(values.email, values.password);
        await fetchPosts();

        navigate("/dashboard");
      } catch (error) {
        if (error.response?.data?.message) {
          setStatus(error.response.data.message);
        } else {
          setStatus("Login failed. Please try again.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-green-50 h-screen flex-1 flex-col justify-center px-6 py-6 lg:px-20">
      <div className="bg-white border rounded-xl p-5 md:p-10 sm:p-6 mx-auto lg:mx-60 xl:mx-[26rem]">
        <div className="flex flex-col justify-center">
          <img
            alt="Your Company"
            src={MainLogo}
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to Postify account
          </h2>
        </div>

        <div className="mt-10 flex flex-col justify-center">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-60"
              >
                {formik.isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>

            {formik.status && (
              <p className="text-center text-sm text-red-500">
                {formik.status}
              </p>
            )}
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member? &nbsp;
            <a
              href="/"
              className="font-semibold text-emerald-600 hover:text-emerald-500"
            >
              Sign up Now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
