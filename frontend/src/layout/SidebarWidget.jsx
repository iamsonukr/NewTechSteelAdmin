import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function SidebarWidget() {
  const {  subscriptionData="Cat" } = useAuth();

  const plan = subscriptionData?.plan || null;
  const endDate = subscriptionData?.endDate
    ? new Date(subscriptionData.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      className="absolute bottom-10 mx-auto w-60 rounded-2xl px-4 py-5 text-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
        boxShadow: "0 8px 32px rgba(99, 102, 241, 0.25)",
      }}
    >
      {/* Decorative glow orb */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Badge */}
      <span
        className="inline-block mb-3 px-2 py-0.5 rounded-full text-xs font-semibold tracking-widest uppercase"
        style={{
          background: "rgba(167,139,250,0.2)",
          color: "#c4b5fd",
          border: "1px solid rgba(167,139,250,0.3)",
        }}
      >
        Active Plan
      </span>

      <h3
        className="mb-1 text-lg font-bold capitalize tracking-wide"
        style={{ color: "#f5f3ff" }}
      >
        {plan?.planName ?? "No Plan"}
      </h3>

      <p
        className="mb-4 text-xs"
        style={{ color: "#a78bfa" }}
      >
        {endDate ? `Expires on · ${endDate}` : "No subscription found."}
      </p>

      
    
    </div>
  );
}