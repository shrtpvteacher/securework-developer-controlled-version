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
        &copy; {new Date().getFullYear()} Your Project Name. All rights reserved.
        <span style={{ marginLeft: 16 }}>
          <a
            href="https://www.linkedin.com/in/your-linkedin-username/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0a66c2", marginRight: 12, textDecoration: "none" }}
          >
            LinkedIn
        
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
        transition: "box-shadow 0.2s"
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.16)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)")}
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