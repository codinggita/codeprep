import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");

    } catch {
      alert("Login failed");
    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-[#0f172a] via-[#0b1320] to-[#020617] text-white">

      {/* Title Section */}

      <div className="absolute top-24 text-center">

        <h1 className="text-3xl font-bold tracking-wide">
          Code <span className="text-blue-400">Prep</span>
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Master your technical interviews
        </p>

      </div>


      {/* Login Card */}

      <div className="bg-[#1e293b]/60 backdrop-blur-md border border-white/10 rounded-xl w-[420px] p-8 shadow-xl">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>


        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}

          <div>

            <label className="text-sm text-gray-300">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-md bg-[#0f172a] border border-gray-600 focus:border-blue-500 outline-none"
            />

          </div>


          {/* Password */}

          <div>

            <div className="flex justify-between text-sm text-gray-300">

              <label>Password</label>

              <span className="text-blue-400 cursor-pointer">
                Forgot password?
              </span>

            </div>

            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-md bg-[#0f172a] border border-gray-600 focus:border-blue-500 outline-none"
            />

          </div>


          {/* Login Button */}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 transition p-3 rounded-md font-semibold"
          >
            Log In
          </button>

        </form>


        {/* Divider */}

        <div className="flex items-center gap-3 my-6 text-gray-400 text-sm">

          <div className="flex-1 h-px bg-gray-700"></div>

          NEW TO CODE PREP?

          <div className="flex-1 h-px bg-gray-700"></div>

        </div>


        {/* Helper Text */}

        <p className="text-center text-gray-400 text-sm">
          Create an account to track your coding practice and stay consistent.
        </p>

      </div>


      {/* Register Link */}

      <div className="absolute bottom-16 text-gray-400 text-sm">

        Don't have an account?{" "}

        <span
          className="text-blue-400 font-medium cursor-pointer hover:underline"
          onClick={() => navigate("/register")}
        >
          Create an account
        </span>

      </div>

    </div>

  );
}

export default Login;