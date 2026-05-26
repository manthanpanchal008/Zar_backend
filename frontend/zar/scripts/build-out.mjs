import { spawn } from "node:child_process";
import process from "node:process";

const nextBin = process.platform === "win32" ? "next.cmd" : "next";
const env = {
  ...process.env,
  NODE_OPTIONS: [process.env.NODE_OPTIONS, "--max-old-space-size=8192"].filter(Boolean).join(" "),
};

const child = spawn(nextBin, ["build", "--webpack"], {
  stdio: "inherit",
  shell: true,
  env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
