import { pageTransition, pageSlide } from './variants';

export const MOTION = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit'
};

// export type FlipOptions = {
//   x?: number;
//   y?: number;
//   duration?: number;
//   staggerChildren?: number;
// };

// export function validateMotion(motion: FlipOptions): FlipOptions {
//   return {
//     x: motion.x || 0,
//     y: motion.y || 0,
//     duration: motion.duration || 0.3,
//     staggerChildren: motion.staggerChildren || 0
//   }
// }

// /**
//  * Convert FLIP options to motion configurations for initial, animate, exit
//  */
// export const makeFLIP = (motion: FlipOptions = {}) => {
//   const {x, y, duration, staggerChildren} = validateMotion(motion);
//   return ({
//     [MOTION.initial]: { opacity: 0, x, y },
//     [MOTION.animate]: { opacity: 1, x: 0, y: 0, transition: {duration, staggerChildren} },
//     [MOTION.exit]: { opacity: 0, x, y},
//   });
// }

/**
 * Create `motion` properties for initial, animate, exit WITH `variants`
 * Create attribu
 */
export const animateWith = (variant?: any) => ({
  ...MOTION,
  variants: variant || pageTransition
});

export const slideIn = (x = 0, y = 0) => ({
  ...MOTION,
  variants: pageSlide(x, y)
});
