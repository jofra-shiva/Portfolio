"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #0a0a0f 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "2rem",
        fontFamily: "var(--font-satoshi, system-ui, sans-serif)",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", maxWidth: 560 }}
      >
        {/* Glowing 404 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            fontSize: "clamp(5rem, 20vw, 9rem)",
            fontWeight: 800,
            lineHeight: 1,
            background: "linear-gradient(135deg, #00ff87, #60efff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 40px rgba(0,255,135,0.3))",
          }}
        >
          404
        </motion.div>

        <h1 style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)", color: "white", fontWeight: 600, margin: 0 }}>
          Page Not Found
        </h1>

        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>
          This page doesn&apos;t exist in my portfolio workspace. Head back to the home page to explore my projects,
          skills, and more.
        </p>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/"
            aria-label="Return to Sivaprakash M portfolio homepage"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.9rem 2rem",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #00ff87, #60efff)",
              color: "#000",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(0,255,135,0.3)",
            }}
          >
            ← Back to Portfolio
          </Link>
        </motion.div>

        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", margin: 0 }}>
          Sivaprakash M — Full Stack Developer •{" "}
          <a href="https://www.sivaprakashm.in" style={{ color: "rgba(96,239,255,0.6)", textDecoration: "none" }}>
            sivaprakashm.in
          </a>
        </p>
      </motion.div>
    </main>
  );
}
