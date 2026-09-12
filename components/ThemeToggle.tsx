"use client";

import { useEffect, useState } from "react";

type Choice = "light" | "dark" | null;

/**
 * The site already had a three-state theme system in CSS — bare :root, an OS
 * preference query, and a [data-theme] stamp that beats both. This is the
 * control that was missing.
 *
 * It stamps data-theme on <html> and remembers the choice. "null" means follow
 * the OS, which is the default and what most people actually want, so the
 * toggle cycles only between the two explicit states once the viewer has
 * expressed a preference.
 */
export function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const initial = stored === "light" || stored === "dark" ? stored : null;
    setChoice(initial);
    setReady(true);
  }, []);

  function resolved(): "light" | "dark" {
    if (choice) return choice;
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function flip() {
    const next: Choice = resolved() === "dark" ? "light" : "dark";
    setChoice(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // Private browsing. The stamp still applies for this page view.
    }
  }

  // Rendered but inert until mounted, so the header does not reflow and the
  // button never claims a state it has not read yet.
  const isDark = ready && resolved() === "dark";

  return (
    <button
      type="button"
      className="toggle"
      onClick={flip}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      suppressHydrationWarning
    >
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        {isDark ? (
          <path
            d="M10.3 7.6A4.6 4.6 0 0 1 4.4 1.7 4.6 4.6 0 1 0 10.3 7.6Z"
            fill="currentColor"
          />
        ) : (
          <>
            <circle cx="6" cy="6" r="2.5" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
              <path d="M6 .8v1.4M6 9.8v1.4M.8 6h1.4M9.8 6h1.4" />
              <path d="M2.3 2.3l1 1M8.7 8.7l1 1M9.7 2.3l-1 1M3.3 8.7l-1 1" />
            </g>
          </>
        )}
      </svg>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

/**
 * Applies the stored choice before first paint.
 *
 * Without this the page renders in the OS theme and then snaps to the stored
 * one — a flash on every navigation. It has to be inline and synchronous in
 * <head>, which is the one legitimate use of dangerouslySetInnerHTML here: the
 * string is a literal, with no interpolation of anything external.
 */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
