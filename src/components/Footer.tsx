import React, { FC } from "react";

const Footer: FC = () => (
  <>
    <footer
      style={{
        width: "100%",
        background: "#f8fafc",
        padding: "1.5rem 0",
        textAlign: "center",
        fontSize: "1rem",
        color: "#555",
        position: "relative",
        zIndex: 2,
        borderTop: "1px solid #eee",
      }}
    >
      <div>
        &copy; {new Date().getFullYear()} SecureWork. All rights reserved.
        <span
          style={{
            marginLeft: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            justifyContent: "center",
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
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ verticalAlign: "middle" }}
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.039-1.852-3.039-1.853 0-2.136 1.447-2.136 2.941v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.37-1.852 3.602 0 4.268 2.369 4.268 5.455v6.288zM5.337 7.433a2.065 2.065 0 1 1 0-4.13 2.065 2.065 0 0 1 0 4.13zM6.961 20.452H3.708V9h3.253v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.778-.774 1.778-1.729V1.729C24 .774 23.204 0 22.225 0z" />
            </svg>
            LinkedIn
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/shrtpvteacher/securework-developer-controlled-version "
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#333",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ verticalAlign: "middle" }}
            >
              <path d="M12 0C5.372 0 0 5.372 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.084-.729.084-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.776.418-1.305.76-1.605-2.665-.303-5.466-1.335-5.466-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.47 11.47 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.815 1.103.815 2.222 0 1.606-.015 2.896-.015 3.286 0 .32.217.694.825.576C20.565 21.795 24 17.3 24 12c0-6.628-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </span>
      </div>
    </footer>

    {/* Fixed Bolt Badge in bottom right */}
    <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000,
        background: "rgba(255,255,255,0.8)",
        borderRadius: 8,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        padding: 4,
        transition: "box-shadow 0.2s",
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
    </a>
  </>
);

export default Footer;
