import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#111211",
        color: "#e4e5dc",
        padding: "42px 58px",
        fontFamily: "sans-serif",
        border: "1px solid #363a2f",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 22,
          color: "#a4bc8a",
          borderBottom: "1px solid #363a2f",
          paddingBottom: 25,
        }}
      >
        <span style={{ color: "#ddb078", marginRight: 16 }}>{">_"}</span>{" "}
        prit@portfolio: ~
        <span style={{ marginLeft: "auto", fontSize: 18, color: "#888d80" }}>
          pprit.me
        </span>
      </div>
      <div
        style={{
          display: "flex",
          color: "#888d80",
          fontSize: 20,
          marginTop: 42,
        }}
      >
        HELLO, WORLD. I&apos;M
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 94,
          fontWeight: 700,
          letterSpacing: -4,
          lineHeight: 1.15,
          marginTop: 12,
        }}
      >
        Prit Panchal<span style={{ color: "#ddb078" }}>_</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "#ddb078",
          fontSize: 32,
          marginTop: 18,
        }}
      >
        {">"} AI Engineer
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 23,
          color: "#b4baaa",
          marginTop: 23,
        }}
      >
        Generative AI · Multi-agent systems · RAG · Python
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 18,
          color: "#888d80",
          marginTop: "auto",
          borderTop: "1px solid #363a2f",
          paddingTop: 24,
        }}
      >
        <span>Vadodara, India</span>
        <span style={{ marginLeft: "auto", color: "#a4bc8a" }}>
          Building intelligent, working systems.
        </span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
