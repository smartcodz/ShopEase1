import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Mail } from "lucide-react";
import Button from "../ui/Button";

type NewsletterStatus = "idle" | "error" | "success";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

function Newsletter() {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      return;
    }

    // Demo only: no API call yet.
    setStatus("success");
    setEmail("");
  };

  const hasError = status === "error";

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="rounded-3xl border border-indigo-100 bg-indigo-50 px-6 py-12 text-center sm:px-12 sm:py-16"
    >
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
        <Mail className="h-6 w-6" aria-hidden="true" />
      </span>

      <h2
        id="newsletter-heading"
        className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
      >
        Join our newsletter
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-slate-600">
        Get new arrivals, special offers, and shopping tips in your inbox. No
        spam, and you can leave any time.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={handleChange}
          aria-invalid={hasError}
          aria-describedby={hasError ? "newsletter-message" : undefined}
          className={[
            "h-12 w-full rounded-lg border bg-white px-4 text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2",
            hasError
              ? "border-red-500 focus:ring-red-500/30"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/30",
          ].join(" ")}
        />
        <Button type="submit" size="lg" className="shrink-0">
          Subscribe
        </Button>
      </form>

      <div
        id="newsletter-message"
        aria-live="polite"
        className="mt-3 min-h-6 text-sm"
      >
        {status === "error" && (
          <p className="text-red-600">Please enter a valid email address.</p>
        )}
        {status === "success" && (
          <p className="text-green-700">
            Thanks for subscribing! Check your inbox soon.
          </p>
        )}
      </div>
    </section>
  );
}

export default Newsletter;
