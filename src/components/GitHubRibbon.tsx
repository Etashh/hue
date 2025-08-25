"use client";

import { useState } from "react";
import Link from "next/link";

export default function GitHubRibbon() {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "150px",
        height: "150px",
        overflow: "hidden",
        zIndex: 50,
      }}
    >
      <Link
        href="https://github.com/Etashh/hue"
        target="_blank"
        rel="noopener noreferrer"
        style={{ 
          display: "block",
          position: "absolute",
          right: -50,
          top: -50,
          transform: "rotate(45deg)",
          transformOrigin: "bottom left",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div 
          style={{
            width: "200px",
            background: hovered ? "#000" : "#333",
            color: "#fff",
            textAlign: "center",
            lineHeight: "2.5em",
            letterSpacing: "1px",
            boxShadow: "0 5px 10px rgba(0,0,0,.3)",
            transition: "all 0.25s ease-in-out",
            fontWeight: "bold",
          }}
        >
          Fork on GitHub
        </div>
      </Link>
    </div>
  );
}
