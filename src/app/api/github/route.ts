import { NextRequest, NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

async function gh(path: string, init?: RequestInit) {
  const base = new Headers(init?.headers);
  base.set("Accept", "application/vnd.github+json");
  if (process.env.GITHUB_TOKEN) {
    base.set("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`);
  }
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: base,
    // Cache for 1 hour on the server to avoid rate limits
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("u") || "octocat").trim();
  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  try {
    const [profile, repos] = await Promise.all([
      gh(`/users/${encodeURIComponent(username)}`),
      gh(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`),
    ]);

    // Compute totals
    let totalStars = 0;
    let totalForks = 0;
    const languageCounts: Record<string, number> = {};

    const reposFiltered = (repos as any[])
      .filter((r) => !r.fork)
      .map((r) => {
        totalStars += r.stargazers_count || 0;
        totalForks += r.forks_count || 0;
        const lang = r.language as string | null;
        if (lang) languageCounts[lang] = (languageCounts[lang] || 0) + 1;
        return {
          name: r.name,
          html_url: r.html_url,
          description: r.description,
          language: r.language,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          updated_at: r.updated_at,
        };
      });

    const topRepos = [...reposFiltered]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    // Build response
    const data = {
      profile: {
        login: profile.login,
        name: profile.name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        blog: profile.blog,
        company: profile.company,
        followers: profile.followers,
        following: profile.following,
        public_repos: profile.public_repos,
        html_url: profile.html_url,
        location: profile.location,
        twitter_username: profile.twitter_username,
      },
      totals: { totalStars, totalForks },
      languages: languageCounts,
      topRepos,
    };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
