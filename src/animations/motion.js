export const page = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export const list = {
  show: {
    transition: { staggerChildren: 0.08 }
  }
};

export const card = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};
