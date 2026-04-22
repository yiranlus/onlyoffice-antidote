import os from "os";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { access } from "node:fs/promises";
import path from "path";

const execFileAsync = promisify(execFile);

async function getRegistryData(key: string, value: string): Promise<string> {
  const queryArgs = ["QUERY", key, "/v", value];
  let stdout = (await execFileAsync("REG", queryArgs)).stdout;
  stdout = stdout.substring(stdout.indexOf("REG_"));

  const data = stdout.substring(stdout.indexOf(" ")).trim();
  return data;
}

async function getDossierConnectix(): Promise<string> {
  if (!os.platform().startsWith("win")) return "";

  let data = await getRegistryData(
    "HKEY_LOCAL_MACHINE\\SOFTWARE\\Druide informatique inc.\\Connectix",
    "DossierConnectix",
  );
  return data && typeof data == "string" ? data : "";
}

async function canAccessPath(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
async function getAgentConnectixConsole(): Promise<string> {
  let executable = "";
  if (os.platform().startsWith("darwin")) {
    executable =
      "/Applications/Antidote/Connectix 12.app/Contents/SharedSupport/AgentConnectixConsole";
    if (!(await canAccessPath(executable)))
      executable =
        "/Applications/Antidote/Connectix 11.app/Contents/SharedSupport/AgentConnectixConsole";
  } else if (os.platform().startsWith("linux")) {
    executable = "/usr/local/bin/AgentConnectixConsole";
  } else if (os.platform().startsWith("win")) {
    executable = path.join(
      await getDossierConnectix(),
      "AgentConnectixConsole.exe",
    );
  }

  if (await canAccessPath(executable)) return executable;
  throw new Error("Impossible to get the path to AgentConnectixConsole");
}

export async function getWebSocketPort(): Promise<number> {
  let agentConnectixConsole = await getAgentConnectixConsole();
  const output = await execFileAsync(agentConnectixConsole, ["--api"], {
    timeout: 2000,
    windowsHide: true,
  });
  const json = JSON.parse(output.stdout.toString());
  if ("port" in json) return json.port;

  throw new Error("Impossible to get the port with AgentConnectixConsole");
}
