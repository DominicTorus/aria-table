export const handlepath = (paths) => {
  try {
    let result;

    result = paths.split('.');
    result.shift();
    result = result.join('.');
    return result;
  } catch (error) {
    console.error(error);
  }
};
