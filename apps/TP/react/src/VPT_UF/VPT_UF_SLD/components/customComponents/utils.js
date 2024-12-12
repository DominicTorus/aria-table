export const jsonData = [
  { id: 1, type: 'nav', top: '6%', left: '0%', height: '50px', width: '100%' },
  {
    id: 2,
    type: 'table',
    top: '50%',
    left: '20%',
    height: '100px',
    width: '60%',
  },
];

export const getWidth = (width, totalWidth) => {
  return (width / 100) * totalWidth;
};
