export const getGiteeUserContribution = async (
  userName: string,
  o: { giteeToken: string }
) => {
  const res = await fetch(
    `https://gitee.com/api/v5/users/${userName}/events?access_token=${o.giteeToken}&limit=1000`
  );

  if (!res.ok) throw new Error(res.statusText);

  const data = await res.json();

  const contributionsByDate: Record<string, number> = {};
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  data.forEach((event: any) => {
    if (event.type === "PushEvent") {
      const eventDate = new Date(event.created_at);
      if (eventDate >= oneYearAgo) {
        const date = eventDate.toISOString().split("T")[0];
        const commitCount = event.payload.commits.length;
        contributionsByDate[date] =
          (contributionsByDate[date] || 0) + commitCount;
      }
    }
  });

  // 填充没有提交的日期
  const currentDate = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    const dateString = date.toISOString().split("T")[0];

    if (!contributionsByDate[dateString]) {
      contributionsByDate[dateString] = 0;
    }
  }

  // 计算贡献等级
  const result = Object.entries(contributionsByDate).map(([date, count]) => {
    let level:
      | "FOURTH_QUARTILE"
      | "THIRD_QUARTILE"
      | "SECOND_QUARTILE"
      | "FIRST_QUARTILE"
      | "NONE" = "NONE";
    if (count > 20) level = "FOURTH_QUARTILE";
    else if (count > 10) level = "THIRD_QUARTILE";
    else if (count > 5) level = "SECOND_QUARTILE";
    else if (count > 0) level = "FIRST_QUARTILE";

    return {
      date,
      count,
      level,
    };
  });

  console.log(result); // 打印结果结构
  return result;
};

export type Res = Awaited<ReturnType<typeof getGiteeUserContribution>>;

export type Cell = Res[number];
