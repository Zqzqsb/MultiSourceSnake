import { getGithubUserContribution } from "@snk/github-user-contribution";
import { getGiteeUserContribution } from "@snk/gitee-user-contribution";
import { userContributionToGrid } from "./userContributionToGrid";
import { getBestRoute } from "@snk/solver/getBestRoute";
import { snake4 } from "@snk/types/__fixtures__/snake";
import { getPathToPose } from "@snk/solver/getPathToPose";
import type { DrawOptions as DrawOptions } from "@snk/svg-creator";
import type { AnimationOptions } from "@snk/gif-creator";

export const generateContributionSnake = async (
  githubUserName: string,
  giteeUserName: string,
  outputs: ({
    format: "svg" | "gif";
    drawOptions: DrawOptions;
    animationOptions: AnimationOptions;
  } | null)[],
  options: { githubToken: string; giteeToken: string }
) => {
  console.log("🚀 Outputs:", outputs);
  console.log("🚀 giteeUsername:", giteeUserName);
  console.log("🚀 githubUsername:", githubUserName);

  // 可能是这里 await 的问题
  console.log("🎣 fetching github user contribution");
  const githubCells = await getGithubUserContribution(githubUserName, options);

  console.log("🎣 fetching gitee user contribution");
  const giteeCells = await getGiteeUserContribution(giteeUserName, options);

  const cells = githubCells;
  console.log(giteeCells.length);
  console.log(githubCells.length);

  const giteeContributionMap: Record<string, number> = {};

  giteeCells.forEach((cell) => {
    giteeContributionMap[cell.date] = cell.count;
  });

  cells.forEach((cell) => {
    cell.count += giteeContributionMap[cell.date] ?? 0;
  });

  cells.forEach((cell) => {
    let level: number = 0;

    if (cell.count > 10) {
      level = 4; // 表示 "FOURTH_QUARTILE"
    } else if (cell.count > 6) {
      level = 3; // 表示 "THIRD_QUARTILE"
    } else if (cell.count > 3) {
      level = 2; // 表示 "SECOND_QUARTILE"
    } else if (cell.count > 0) {
      level = 1; // 表示 "FIRST_QUARTILE"
    }
    // 将计算出的 level 赋值给 cell.level
    cell.level = level;
  });

  const grid = userContributionToGrid(cells);
  const snake = snake4;

  console.log("📡 computing best route");
  const chain = getBestRoute(grid, snake)!;
  chain.push(...getPathToPose(chain.slice(-1)[0], snake)!);

  return Promise.all(
    outputs.map(async (out, i) => {
      if (!out) return;
      const { format, drawOptions, animationOptions } = out;
      switch (format) {
        case "svg": {
          console.log(`🖌 creating svg (outputs[${i}])`);
          const { createSvg } = await import("@snk/svg-creator");
          return createSvg(grid, cells, chain, drawOptions, animationOptions);
        }
        case "gif": {
          console.log(`📹 creating gif (outputs[${i}])`);
          const { createGif } = await import("@snk/gif-creator");
          return await createGif(
            grid,
            cells,
            chain,
            drawOptions,
            animationOptions
          );
        }
      }
    })
  );
};
