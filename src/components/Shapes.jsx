import React from "react";

export default function Shapes() {
  return (
    <>
      <div className="grain-overlay" />
      <div style={{ 
        position: 'fixed', inset: 0, zIndex: -1, 
        background: `linear-gradient(160deg, #080C0D 60%, #111D20 100%)` 
      }}>
        {/* The sharp "Swoosh" from your image style */}
        <div style={{
          position: 'absolute', width: '100%', height: '2px',
          top: '20%', left: '-10%', transform: 'rotate(-5deg)',
          background: 'linear-gradient(90deg, transparent, #FF5F1F, transparent)',
          opacity: 0.4
        }} />
      </div>
    </>
  );
}