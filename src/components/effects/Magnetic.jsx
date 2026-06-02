import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/**
 * Magnetic hover — element gently drifts toward the cursor, then springs back.
 * Premium micro-interaction (motion.page style) for buttons / CTAs.
 * Desktop only (mousemove driven); honors prefers-reduced-motion.
 *
 * Usage — wrap a button/link in an inline-block magnet:
 *   <Magnetic><a className="btn">Call</a></Magnetic>
 */
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Magnetic({
  children,
  strength = 0.35, // how strongly it follows the cursor (0-1)
  className,
  style,
  ...props
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spring = { stiffness: 200, damping: 15, mass: 0.3 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  if (prefersReducedMotion) {
    return (
      <span className={className} style={{ display: 'inline-block', ...style }} {...props}>
        {children}
      </span>
    );
  }

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ display: 'inline-block', x: sx, y: sy, willChange: 'transform', ...style }}
      {...props}
    >
      {children}
    </motion.span>
  );
}
