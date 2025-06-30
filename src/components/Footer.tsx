import React, { FC } from "react";

const Footer: FC = () => (
  <>
    <footer
      style={{
        width: "100%",
        background: "#f8fafc",
        padding: "1.5rem 0",
        fontSize: "1rem",
        color: "#555",
        position: "relative",
        zIndex: 2,
        borderTop: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "1200px",
        margin: "0 auto",
        paddingLeft: "2rem",
        paddingRight: "2rem",
      }}
    >
      {/* Left: Copyright */}
      <div style={{ flex: "1", textAlign: "left" }}>
        &copy; {new Date().getFullYear()} SecureWork. All rights reserved.
      </div>

      {/* Center: Links */}
      <div
        style={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          fontWeight: "600",
        }}
      >
        <a
          href="https://www.linkedin.com/in/kelly-anne-coldren/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0a66c2", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}
        >
          {/* LinkedIn SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.039-1.852-3.039-1.853 0-2.136 1.447-2.136 2.941v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.37-1.852 3.602 0 4.268 2.369 4.268 5.455v6.288zM5.337 7.433a2.065 2.065 0 1 1 0-4.13 2.065 2.065 0 0 1 0 4.13zM6.961 20.452H3.708V9h3.253v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.778-.774 1.778-1.729V1.729C24 .774 23.204 0 22.225 0z" />
          </svg>
          LinkedIn
        </a>

        <a
          href="https://github.com/shrtpvteacher/securework-developer-controlled-version"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#333", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}
        >
          {/* GitHub SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 0C5.372 0 0 5.372 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577v-2.234c-3.338.724-4.033-1.415-4.033-1.415-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.238 1.838 1.238 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.304.76-1.605-2.665-.304-5.466-1.334-5.466-5.93 0-1.311.47-2.382 1.236-3.222-.124-.304-.536-1.524.116-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.77.84 1.235 1.91 1.235 3.222 0 4.61-2.804 5.624-5.475 5.921.43.37.815 1.1.815 2.222v3.293c0 .319.217.694.825.576C20.565 21.796 24 17.3 24 12c0-6.628-5.372-12-12-12z" />
          </svg>
          GitHub
        </a>
      </div>

      {/* Right: Bolt badge */}
      <div style={{ flex: "1", textAlign: "right", paddingRight: "1.5rem" }}>
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "rgba(255,255,255,0.9)",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: "6px 10px",
            transition: "box-shadow 0.2s",
            marginRight: "1rem",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.16)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)")
          }
        >
          <img
            src="/bolt-badge-black_circle_360x360.png"
            alt="Built with Bolt"
            style={{ height: 40, width: "auto", display: "block" }}
          />
          <span>Built with Bolt.new</span>
        </a>
      </div>
    </footer>
  </>
);

export default Footer;
