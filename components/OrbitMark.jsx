export default function OrbitMark() {
  return (
    <div className="orbit-mark" aria-hidden="true">
      <svg viewBox="0 0 240 240" role="presentation">
        <circle className="orbit-ring orbit-ring-a" cx="120" cy="120" r="94" />
        <ellipse
          className="orbit-ring orbit-ring-b"
          cx="120"
          cy="120"
          rx="42"
          ry="104"
          transform="rotate(38 120 120)"
        />
        <path
          className="orbit-path"
          d="M35 92c23-57 92-83 144-50 39 25 39 84 3 114-43 37-112 24-133-26-16-39 8-79 46-89 32-9 68 9 76 40"
        />
        <circle className="orbit-dot" cx="35" cy="92" r="8" />
      </svg>
      <span>S</span>
    </div>
  );
}

