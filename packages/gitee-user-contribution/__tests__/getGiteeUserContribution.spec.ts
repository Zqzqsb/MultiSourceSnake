import { getGiteeUserContribution } from ".."; // 根据实际路径修改
import { config } from "dotenv";
config({ path: __dirname + "/../../../.env" });

describe("getGiteeUserContribution", () => {
  const promise = getGiteeUserContribution(process.env.GITEE_USER!, {
    giteeToken: process.env.GITEE_TOKEN!,
  });

  it("should resolve", async () => {
    await promise;
  });

  it("should get around 365 days of data", async () => {
    const cells = await promise;

    expect(cells.length).toBeGreaterThanOrEqual(365);
    expect(cells.length).toBeLessThanOrEqual(365 + 7);
  });

  it("cells should have x / y coords representing a 7 x (365/7) grid", async () => {
    const cells = await promise;

    expect(cells.length).toBeGreaterThan(300);

    const expectedCoords = Array.from({ length: Math.floor(365 / 7) })
      .map((_, x) => Array.from({ length: 7 }).map((_, y) => ({ x, y })))
      .flat();

    const undefinedDays = expectedCoords.filter(({ x, y }) =>
      cells.some((c: any) => c.x === x && c.y === y)
    );

    expect(undefinedDays).toEqual([]);
  });
});
