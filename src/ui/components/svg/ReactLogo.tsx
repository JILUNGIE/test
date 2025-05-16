function ReactLogo() {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 841.9 595.3"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 타원 1 */}
      <g fill="none" stroke="#61DAFB" strokeWidth="30">
        <ellipse
          rx="300"
          ry="115"
          cx="420.9"
          cy="296.5"
          transform="rotate(0 420.9 296.5)"
        />
        <ellipse
          rx="300"
          ry="115"
          cx="420.9"
          cy="296.5"
          transform="rotate(60 420.9 296.5)"
        />
        <ellipse
          rx="300"
          ry="115"
          cx="420.9"
          cy="296.5"
          transform="rotate(120 420.9 296.5)"
        />
      </g>
      {/* 중심 원 */}
      <circle cx="420.9" cy="296.5" r="45.7" fill="#61DAFB" />
    </svg>
  );
}

export default ReactLogo;
