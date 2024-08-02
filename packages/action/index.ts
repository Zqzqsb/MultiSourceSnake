import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";
import { parseOutputsOption } from "./outputsOptions";

(async () => {
  try {
    // const outputs = parseOutputsOption(
    //   core.getMultilineInput("outputs") ?? [
    //     core.getInput("gif_out_path"),
    //     core.getInput("svg_out_path"),
    //   ]
    // );

    const entries = [
      path.join(__dirname, "output/out.svg"),

      path.join(__dirname, "output/out-dark.svg") +
        "?palette=github-dark&color_snake=orange",

      path.join(__dirname, "output/out.gif") +
        "?color_snake=orange&color_dots=#d4e0f0,#8dbdff,#64a1f4,#4b91f1,#3c7dd9",
    ];

    const outputs = parseOutputsOption(entries);

    const githubUserName = process.env.INPUT_GITHUB_USER || "";
    const giteeUserName = process.env.INPUT_GITEE_USER || "";
    const githubToken = process.env.INPUT_GITHUB_TOKEN || "";
    const giteeToken = process.env.INPUT_GITEE_TOKEN || "";

    console.log("UserInfo:");
    console.log(githubUserName, giteeUserName, githubToken, giteeToken);

    const { generateContributionSnake } = await import(
      "./generateContributionSnake"
    );
    const results = await generateContributionSnake(
      githubUserName,
      giteeUserName,
      outputs,
      {
        githubToken,
        giteeToken,
      }
    );
    console.log("Done Computing Result.");
    console.log(results.length);

    outputs.forEach((out, i) => {
      const result = results[i];
      if (out?.filename && result) {
        console.log(`💾 writing to ${out?.filename}`);
        fs.mkdirSync(path.dirname(out?.filename), { recursive: true });
        fs.writeFileSync(out?.filename, result);
      }
    });
  } catch (e: any) {
    core.setFailed(`Action failed with "${e.message}"`);
  }
})();
