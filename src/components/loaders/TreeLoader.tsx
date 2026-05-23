import styles from "./TreeLoader.module.css";

/**
 * A small CSS-only 3D tree loader. Three crossed SVG planes spin on the Y axis
 * so the silhouette stays readable from any angle. Honors prefers-reduced-motion.
 *
 * Use in any loading boundary:
 *   <TreeLoader />
 *
 * Or as a full-screen overlay:
 *   <div className="fixed inset-0 grid place-items-center bg-background">
 *     <TreeLoader />
 *   </div>
 */
export function TreeLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className={styles.root} role="status" aria-label={label}>
      <div className={styles.stage}>
        <div className={styles.ground} />
        <div className={styles.rig}>
          <div className={`${styles.plane} ${styles.p1}`}>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <use href="#tree-loader-symbol" />
            </svg>
          </div>
          <div className={`${styles.plane} ${styles.p2}`}>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <use href="#tree-loader-symbol" />
            </svg>
          </div>
          <div className={`${styles.plane} ${styles.p3}`}>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <use href="#tree-loader-symbol" />
            </svg>
          </div>
        </div>
        <TreeSymbol />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

function TreeSymbol() {
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="tree-loader-symbol" viewBox="0 0 200 200">
        {/* Trunk */}
        <path
          d="M 92 158 L 92 96 Q 92 90 96 88 L 104 88 Q 108 90 108 96 L 108 158 Z"
          fill="#e9e6e0"
          stroke="#1a1a1a"
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
        {/* Bark hints */}
        <path
          d="M 96 104 Q 100 114 96 124 Q 100 134 96 144"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={1.2}
          opacity={0.55}
          strokeLinecap="round"
        />
        <path
          d="M 104 100 Q 100 112 104 122 Q 100 132 104 142"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={1.2}
          opacity={0.4}
          strokeLinecap="round"
        />
        {/* Branches into the crown */}
        <g stroke="#1a1a1a" strokeWidth={2} strokeLinecap="round" fill="none">
          <line x1={100} y1={94} x2={74} y2={64} />
          <line x1={100} y1={96} x2={126} y2={66} />
          <line x1={100} y1={92} x2={100} y2={44} />
        </g>
        {/* Crown lobes */}
        <g stroke="#1a1a1a" strokeWidth={2.2} strokeLinejoin="round">
          <circle cx={70} cy={62} r={22} fill="#e9e6e0" />
          <circle cx={130} cy={62} r={22} fill="#e9e6e0" />
          <circle cx={100} cy={42} r={24} fill="#e9e6e0" />
          <circle cx={55} cy={82} r={20} fill="#e9e6e0" />
          <circle cx={145} cy={82} r={20} fill="#e9e6e0" />
          <circle cx={80} cy={86} r={20} fill="#e9e6e0" />
          <circle cx={120} cy={86} r={20} fill="#e9e6e0" />

          <circle cx={100} cy={66} r={22} fill="oklch(0.58 0.13 150)" />
          <circle cx={78} cy={50} r={18} fill="oklch(0.70 0.10 150)" />
          <circle cx={124} cy={52} r={16} fill="oklch(0.42 0.11 150)" />
          <circle cx={62} cy={72} r={14} fill="oklch(0.58 0.13 150)" />
          <circle cx={138} cy={72} r={14} fill="oklch(0.70 0.10 150)" />
        </g>
        {/* Foliage flecks */}
        <g fill="#1a1a1a">
          <circle cx={72} cy={54} r={2.2} />
          <circle cx={92} cy={46} r={2.2} />
          <circle cx={112} cy={54} r={2.2} />
          <circle cx={64} cy={80} r={2.2} />
          <circle cx={136} cy={80} r={2.2} />
          <circle cx={86} cy={78} r={2.2} />
          <circle cx={116} cy={76} r={2.2} />
        </g>
        <g fill="oklch(0.42 0.11 150)">
          <circle cx={100} cy={62} r={2.6} />
          <circle cx={80} cy={64} r={2.4} />
          <circle cx={120} cy={68} r={2.4} />
        </g>
      </symbol>
    </svg>
  );
}
