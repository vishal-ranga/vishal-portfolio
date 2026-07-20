"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const lines: { prompt?: boolean; text: string }[] = [
  { prompt: true, text: "whoami" },
  { text: "vishal-ranga · cloud & devops engineer" },
  { prompt: true, text: "systemctl status career" },
  { text: "● active (running) · Gurugram, IN" },
  { prompt: true, text: "terraform apply --target=portfolio" },
  { text: "3 resources shipped, 0 downtime" },
  { prompt: true, text: "./launch-portfolio.sh" },
  { text: "booting interface... done" },
];

export function BootSequence() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("boot-seen")) return;
    sessionStorage.setItem("boot-seen", "1");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only read of sessionStorage, no SSR equivalent
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    if (count >= lines.length) {
      const t = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c + 1), 230);
    return () => clearTimeout(t);
  }, [show, count]);

  useEffect(() => {
    if (!show) {
      document.body.style.overflow = "";
      return;
    }
    function skip() {
      setShow(false);
    }
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[200] bg-ink flex items-center justify-center px-6"
        >
          <div className="w-full max-w-md font-mono text-[13px] leading-relaxed">
            {lines.slice(0, count).map((l, i) => (
              <p key={i} className={l.prompt ? "text-emerald-bright mt-3 first:mt-0" : "text-white/65 pl-3"}>
                {l.prompt ? `$ ${l.text}` : l.text}
              </p>
            ))}
            {count < lines.length && (
              <span className="inline-block w-2 h-3.5 bg-emerald-bright align-middle ml-3 animate-pulse" />
            )}
          </div>
          <p className="absolute bottom-10 text-white/25 text-xs font-mono">
            click or press any key to skip
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
