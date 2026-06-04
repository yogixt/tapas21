import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query userPublicProfile($username: String!) {
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }
        `,
        variables: { username },
      }),
      next: { revalidate: 300 },
    });

    const data = await res.json();
    const stats = data?.data?.matchedUser?.submitStats?.acSubmissionNum;

    if (!stats) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      totalSolved: stats[0]?.count ?? 0,
      easySolved: stats[1]?.count ?? 0,
      mediumSolved: stats[2]?.count ?? 0,
      hardSolved: stats[3]?.count ?? 0,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch LeetCode stats" },
      { status: 500 }
    );
  }
}
