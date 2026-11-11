import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import {
  Eye,
  EyeOff,
  ShoppingBag,
  Mail,
  LockKeyhole,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useLogin } from "../hooks/useLogin";
import type { LoginInput } from "../types/auth";

function getRedirectTarget(state: unknown): string {
  if (!state || typeof state !== "object" || !("from" in state)) {
    return "/";
  }

  const from = state.from;
  const pathname =
    typeof from === "string"
      ? from
      : from && typeof from === "object" && "pathname" in from
        ? from.pathname
        : "/";

  return typeof pathname === "string" && pathname.startsWith("/") && !pathname.startsWith("//")
    ? pathname
    : "/";
}

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { mutate, isPending, isError, error: loginError } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setValidationError("");
    setSuccess(false);

    if (!email.trim() || !password) {
      setValidationError("Please enter your email and password.");
      return;
    }

    const values: LoginInput = {
      email: email.trim(),
      password,
    };

    mutate(values, {
      onSuccess: () => {
        setSuccess(true);
        navigate(getRedirectTarget(location.state), {
          replace: true,
        });
      },
    });
  };

  const errorMessage = validationError
    ? validationError
    : isError
      ? loginError instanceof Error
        ? loginError.message
        : "Incorrect email or password. Please try again."
      : "";

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      {/* Left: Brand panel */}
      <section className="relative hidden overflow-hidden bg-indigo-700 px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />

        <Link to="/" className="relative flex w-fit items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-700 shadow-lg">
            <ShoppingBag size={27} />
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            ShopEase
          </span>
        </Link>

        <div className="relative max-w-lg py-12">
          <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium">
            Your shopping, made easier
          </span>

          <h1 className="mt-7 text-5xl font-extrabold leading-tight xl:text-6xl">
            Good to see you again.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-8 text-indigo-100">
            Sign in to explore products, discover new favourites, and enjoy a
            smoother shopping experience.
          </p>

          <div className="mt-10 flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <CheckCircle2 size={25} />
            </div>
            <div>
              <p className="font-semibold">Your shop, your way</p>
              <p className="mt-1 text-sm text-indigo-100">
                Browse products and find what you love.
              </p>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-indigo-200">
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </p>
      </section>

      {/* Right: Login form */}
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-12 flex w-fit items-center gap-2 lg:hidden"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <ShoppingBag size={24} />
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              ShopEase
            </span>
          </Link>

          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Welcome back
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Sign in to your account
            </h2>

            <p className="mt-3 leading-6 text-slate-500">
              Enter your details below to continue shopping.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700"
              >
                <CheckCircle2 size={20} />
                Signed in successfully!
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                <Mail size={19} className="shrink-0 text-slate-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="min-w-0 flex-1 bg-transparent py-4 text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide password" : "Show password"}
                </button>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                <LockKeyhole size={19} className="shrink-0 text-slate-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="min-w-0 flex-1 bg-transparent py-4 text-slate-900 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                />
                Remember me
              </label>

              <span className="text-xs text-slate-400">
                Forgot password? Coming soon
              </span>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" />
                  Signing you in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              ShopEase
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-bold text-indigo-600 hover:text-indigo-800"
            >
              Create an account
            </Link>
          </p>

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            By signing in, you agree to the terms and privacy policy of
            ShopEase.
          </p>
        </div>
      </section>
    </main>
  );
}
