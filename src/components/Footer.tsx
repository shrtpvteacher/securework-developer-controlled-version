// src/components/Footer.tsx
import React, { FC } from "react";

const Footer: FC = () => (
  <footer
    style={{
      width: "100%",
      background: "#f8fafc",
      padding: "1.5rem 2rem",
      fontSize: "1rem",
      color: "#555",
      borderTop: "1px solid #eee",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap",
      }}
    >
      {/* Left: Copyright */}
      <div style={{ flex: "1 1 auto", minWidth: "150px", textAlign: "left" }}>
        &copy; {new Date().getFullYear()} SecureWork. All rights reserved.
      </div>

      {/* Center: Social links */}
      <div
        style={{
          display: "flex",
          gap: "48px", // gap between LinkedIn and GitHub
          justifyContent: "center",
          flex: "2 1 auto",
          minWidth: "250px",
          flexWrap: "wrap",
        }}
      >
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/kelly-anne-coldren/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#0a66c2",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "600",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.039-1.852-3.039-1.853 0-2.136 1.447-2.136 2.941v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.37-1.852 3.602 0 4.268 2.369 4.268 5.455v6.288zM5.337 7.433a2.065 2.065 0 1 1 0-4.13 2.065 2.065 0 0 1 0 4.13zM6.961 20.452H3.708V9h3.253v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.778-.774 1.778-1.729V1.729C24 .774 23.204 0 22.225 0z" />
          </svg>
          LinkedIn
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/kellyannecoldren/securework-developer-controlled-version"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#171515",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "600",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 0C5.372 0 0 5.372 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.774.42-1.304.763-1.604-2.665-.3-5.466-1.332-5.466-5.933 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.042.137 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.63-5.48 5.922.431.372.815 1.102.815 2.222v3.293c0 .321.218.694.825.576C20.565 21.795 24 17.298 24 12c0-6.628-5.373-12-12-12z" />
          </svg>
          GitHub
        </a>
      </div>

      {/* Right: Bolt badge + text */}
      <div style={{ flex: "1 1 auto", minWidth: "150px", textAlign: "right", paddingRight: "12px" }}>
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "24px", // 6 gap = 24px
            background: "rgba(255,255,255,0.8)",
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: "4px 12px",
            transition: "box-shadow 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.16)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)")}
        >
          <img
            src="/bolt-badge-black_circle_360x360.png"
            alt="Built with Bolt"
            style={{ height: 40, width: "auto", display: "block" }}
          />
          <span style={{ fontWeight: 600, color: "#111" }}>Built using bolt.new</span>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
