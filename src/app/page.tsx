"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

type ApiData = {
  profile: {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    blog: string | null;
    company: string | null;
    followers: number;
    following: number;
    public_repos: number;
    html_url: string;
    location: string | null;
    twitter_username: string | null;
  };
  totals: { totalStars: number; totalForks: number };
  languages: Record<string, number>;
  topRepos: Array<{
    name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
  }>;
};

export default function Home() {
  const [username, setUsername] = useState<string>("octocat");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiData | null>(null);

  const fetchData = async (user: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github?u=${encodeURIComponent(user)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch");
      setData(json);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const langChart = useMemo(() => {
    if (!data || !data.languages) return null;
    const entries = Object.entries(data.languages).sort((a, b) => b[1] - a[1]);
    const top = entries.slice(0, 8);
    const labels = top.map(([k]) => k);
    const values = top.map(([, v]) => v);
    const colors = [
      "#60a5fa",
      "#f472b6",
      "#facc15",
      "#34d399",
      "#f87171",
      "#a78bfa",
      "#fb923c",
      "#22d3ee",
    ];
    return {
      labels,
      datasets: [
        {
          label: "Repos",
          data: values,
          backgroundColor: labels.map((_, i) => colors[i % colors.length]),
          borderWidth: 0,
        },
      ],
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
      <header className="sticky top-0 z-10 backdrop-blur border-b border-zinc-200 bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-4">
          <Image src="/next.svg" alt="Logo" width={120} height={26} className="dark:invert" />
          <span className="ml-2 font-medium">GitHub Portfolio Analyzer</span>
          <div className="ml-auto flex items-center gap-2">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchData(username)}
              placeholder="github username"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400 bg-white"
            />
            <button
              onClick={() => fetchData(username)}
              disabled={loading}
              className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 text-red-800 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {data && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-1 rounded-xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.profile.avatar_url} alt="avatar" className="size-16 rounded-full" />
                  <div>
                    <div className="text-lg font-semibold">{data.profile.name || data.profile.login}</div>
                    <Link href={data.profile.html_url} className="text-zinc-500 text-sm hover:underline" target="_blank">
                      @{data.profile.login}
                    </Link>
                    {data.profile.location && (
                      <div className="text-xs text-zinc-500 mt-1">{data.profile.location}</div>
                    )}
                  </div>
                </div>
                {data.profile.bio && (
                  <p className="mt-4 text-sm text-zinc-700">{data.profile.bio}</p>
                )}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Stat label="Repos" value={data.profile.public_repos} />
                  <Stat label="Followers" value={data.profile.followers} />
                  <Stat label="Following" value={data.profile.following} />
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 gap-6">
                <div className="rounded-xl border border-zinc-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">Top Languages</h2>
                  </div>
                  <div className="mt-4">
                    {langChart ? (
                      <div className="max-w-md">
                        <Doughnut data={langChart} options={{ plugins: { legend: { position: "bottom" } } }} />
                      </div>
                    ) : (
                      <div className="text-sm text-zinc-500">No language data</div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-6">
                  <h2 className="font-semibold mb-3">Totals</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Kpi label="Total Stars" value={data.totals.totalStars} />
                    <Kpi label="Total Forks" value={data.totals.totalForks} />
                    <Kpi label="Top Langs" value={Object.keys(data.languages).length} />
                    <Kpi label="Top Repos" value={data.topRepos.length} />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="font-semibold mb-3">Top Repositories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.topRepos.map((r) => (
                  <a
                    key={r.html_url}
                    href={r.html_url}
                    target="_blank"
                    className="rounded-lg border border-zinc-200 p-4 hover:border-zinc-300 transition shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate mr-2">{r.name}</div>
                      {r.language && (
                        <span className="text-xs rounded-full bg-zinc-100 px-2 py-1 text-zinc-700">
                          {r.language}
                        </span>
                      )}
                    </div>
                    {r.description && (
                      <p className="mt-2 text-sm text-zinc-600 line-clamp-3">{r.description}</p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-zinc-600">
                      <span>⭐ {r.stargazers_count}</span>
                      <span>⑂ {r.forks_count}</span>
                      <span>Last update {new Date(r.updated_at).toLocaleDateString()}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </>
        )}

        {!data && !loading && !error && (
          <div className="text-sm text-zinc-500">Search a GitHub username to get started.</div>
        )}
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500">
        Built with Next.js App Router + Tailwind on {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-zinc-50 border border-zinc-200 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-zinc-200 p-3 text-center">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
