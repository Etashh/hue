"use client";

import { useState } from "react";
import Link from "next/link";

export default function ShareButtons({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://github-analyzer-etash.vercel.app/?u=${encodeURIComponent(username)}`;
  const shareText = `Check out ${username}'s GitHub stats on GitHub Portfolio Analyzer!`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="flex gap-2 items-center">
      <button 
        onClick={copyToClipboard}
        className="text-xs px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center gap-1 transition-all"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
      
      <Link 
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 transition-all"
      >
        Share on Twitter
      </Link>
      
      <Link 
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent("GitHub Portfolio Analyzer")}&summary=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-3 py-1.5 rounded-md bg-[#0077b5] hover:bg-[#00669c] text-white flex items-center gap-1 transition-all"
      >
        Share on LinkedIn
      </Link>
    </div>
  );
}
