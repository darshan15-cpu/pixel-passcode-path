import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import sticker from "@/assets/sticker104.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Room 104 — Binary Door Lock" },
      { name: "description", content: "A short puzzle game: decode 104 in binary to unlock the door." },
      { property: "og:title", content: "Room 104 — Binary Door Lock" },
      { property: "og:description", content: "Decode the decimal hint into binary and open the door." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TARGET = "1101000"; // 104 in binary

function Index() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "unlocked">("idle");
  const [pressed, setPressed] = useState<string | null>(null);

  const press = useCallback(
    (key: string) => {
      if (status === "unlocked") return;
      setPressed(key);
      setTimeout(() => setPressed(null), 120);

      if (key === "backspace") {
        setInput((prev) => prev.slice(0, -1));
        setStatus("idle");
      } else if (key === "enter") {
        if (input === TARGET) {
          setStatus("unlocked");
        } else {
          setStatus("error");
        }
      } else {
        setInput((prev) => (prev.length < 8 ? prev + key : prev));
        setStatus("idle");
      }
    },
    [input, status]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "0" || e.key === "1") press(e.key);
      if (e.key === "Backspace") press("backspace");
      if (e.key === "Enter") press("enter");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  const reset = () => {
    setInput("");
    setStatus("idle");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      {/* Ambient vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

      {/* Scene container */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10">
        {/* Title / clue */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-widest text-slate-100 md:text-4xl">
            LEVEL 1: THE LOCKED ROOM
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Only 1 and 0 buttons. The sticker is the decimal hint.
          </p>
        </div>

        {/* Door assembly */}
        <div className="relative">
          {/* Door frame */}
          <div className="relative h-[420px] w-[280px] rounded-t-lg border-[10px] border-amber-950 bg-amber-900 shadow-2xl md:h-[520px] md:w-[340px]">
            {/* Wood grain effect */}
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(90deg,rgba(0,0,0,0.2)_1px,transparent_1px)] bg-[length:40px_100%]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_40%,rgba(0,0,0,0.3)_100%)]" />

            {/* The door itself — splits open when unlocked */}
            <div
              className="absolute inset-0 origin-left transition-transform duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                transform: status === "unlocked" ? "perspective(900px) rotateY(-105deg)" : "rotateY(0deg)",
              }}
            >
              {/* Inner panels */}
              <div className="absolute inset-3 rounded-md border border-amber-950/50 bg-amber-800/40" />
              <div className="absolute left-6 top-16 right-6 h-24 rounded-md border border-amber-950/50 bg-amber-800/30 md:h-28" />
              <div className="absolute left-6 bottom-16 right-6 h-24 rounded-md border border-amber-950/50 bg-amber-800/30 md:h-28" />

              {/* Sticker with 104 hint */}
              <div className="absolute top-28 left-4 z-10 flex flex-col items-center gap-1.5 rotate-[-6deg] md:top-32 md:left-5">
                <img
                  src={sticker}
                  alt="Yellow sticker reading 104"
                  width={90}
                  height={60}
                  className="h-auto w-20 drop-shadow-lg md:w-24"
                />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/90">
                  Decimal Hint
                </span>
              </div>

              {/* Digital lock device */}
              <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border border-slate-600 bg-gradient-to-b from-slate-700 to-slate-800 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] md:p-6">
                <div className="mb-4 w-36 overflow-hidden rounded-md border-2 border-slate-900 bg-black px-2 py-3 text-center font-mono text-lg tracking-widest text-emerald-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] md:w-40 md:text-xl">
                  <span className={status === "error" ? "text-red-500" : status === "unlocked" ? "text-emerald-300" : "text-emerald-500"}>
                    {input.padEnd(7, "_")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <KeypadButton
                    dataKey="1"
                    label="1"
                    onClick={() => press("1")}
                    pressed={pressed === "1"}
                    variant="digit"
                  />
                  <KeypadButton
                    dataKey="0"
                    label="0"
                    onClick={() => press("0")}
                    pressed={pressed === "0"}
                    variant="digit"
                  />
                  <KeypadButton
                    dataKey="backspace"
                    label="←"
                    onClick={() => press("backspace")}
                    pressed={pressed === "backspace"}
                    variant="utility"
                  />
                  <KeypadButton
                    dataKey="enter"
                    label="ENTER"
                    onClick={() => press("enter")}
                    pressed={pressed === "enter"}
                    variant="action"
                  />
                </div>

                {status === "error" && (
                  <div className="mt-3 text-xs font-semibold tracking-wide text-red-400">
                    ACCESS DENIED
                  </div>
                )}
                {status === "unlocked" && (
                  <div className="mt-3 text-xs font-semibold tracking-wide text-emerald-300">
                    UNLOCKED
                  </div>
                )}
              </div>
            </div>

            {/* Door handle */}
            <div className="absolute top-1/2 right-5 h-4 w-16 rounded-full bg-gradient-to-b from-amber-600 to-amber-900 shadow-lg md:right-6 md:w-20" />
            <div className="absolute top-1/2 right-5 h-10 w-10 -translate-y-1/2 rounded-full bg-amber-700 shadow-md md:right-6" />

            {/* Light leaking from behind when open */}
            <div
              className="absolute inset-0 -z-10 transition-opacity duration-700"
              style={{ opacity: status === "unlocked" ? 1 : 0 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/40 via-amber-400/20 to-transparent" />
            </div>
          </div>

          {/* Floor shadow */}
          <div className="absolute -bottom-6 left-1/2 h-8 w-[90%] -translate-x-1/2 rounded-full bg-black/40 blur-md" />
        </div>

        {/* Status panel */}
        <div className="flex flex-col items-center gap-3">
          {status === "unlocked" ? (
            <>
              <p className="text-lg font-medium text-emerald-300">The door opens. You may enter.</p>
              <button
                onClick={reset}
                className="rounded-full bg-slate-700 px-5 py-2 text-sm font-medium text-slate-100 shadow hover:bg-slate-600"
              >
                Lock door again
              </button>
            </>
          ) : (
            <p className="text-sm text-slate-400">
              Hint: 104 in decimal = ? in binary
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function KeypadButton({
  label,
  onClick,
  pressed,
  variant,
}: {
  label: string;
  onClick: () => void;
  pressed: boolean;
  variant: "digit" | "utility" | "action";
}) {
  const variantClasses = {
    digit: "bg-slate-600 text-slate-50 hover:bg-slate-500 active:bg-slate-700",
    utility: "bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-800",
    action: "bg-emerald-700 text-emerald-50 hover:bg-emerald-600 active:bg-emerald-800",
  };

  return (
    <button
      onClick={onClick}
      className={[
        "flex h-12 w-16 items-center justify-center rounded-lg text-sm font-semibold shadow-md transition-transform duration-100 md:h-14 md:w-20",
        variantClasses[variant],
        pressed ? "scale-95 brightness-110" : "scale-100",
      ].join(" ")}
      aria-label={label === "←" ? "Backspace" : label}
    >
      {label}
    </button>
  );
}
