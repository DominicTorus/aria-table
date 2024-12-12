export const getClientDetails = async (token) => {
  try {
    const BASE_URL = `${process.env.REACT_APP_API_URL}tp/userDetails`;
    return await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  }
};
