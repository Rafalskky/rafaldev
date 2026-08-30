"use client";

export default function Inverter({ children, invertSource = false, className = "", style = {} }) {
  return (
    <div 
      className={className} 
      style={{ 
        ...style, 
        mixBlendMode: 'difference',
        filter: invertSource ? 'invert(1)' : 'none'
      }}
    >
      {children}
    </div>
  );
}
