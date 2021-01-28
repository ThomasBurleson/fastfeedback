export const pageTransition = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7
    }
  },
  exit: {
    opacity: 0,
    y: -20
  }
};

export const links = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: 20
  }
};

export const delayedFadeIn = {
  initial: {
    opacity: 0,
    right: 10
  },
  animate: {
    opacity: 1,
    right: 0,
    transition: {
      delay: 1
    }
  }
};

export const pageSlide = (x = 0, y = 0) => {
  return {
    initial: {
      ...pageTransition.initial,
      x,
      y
    },
    animate: {
      ...pageTransition.animate,
      x: 0,
      y: 0
    },
    exit: {
      ...pageTransition.exit,
      x: -x,
      y: -y
    }
  };
};
