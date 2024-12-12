const BASE_URL = `${process.env.REACT_APP_API_URL}df-erd`;

/**
 * Function to fetch the default version.
 *
 * @return {Promise} A Promise that resolves to the JSON response of the default version fetch.
 */
export const getdefaultVersion = async () => {
  try {
    return await fetch(`${BASE_URL}/defaultVersion`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error(error));
  } catch (error) {
    console.error(error);
  }
};
