export const handleErrorLog = async (
  errObj,
  token,
  key,
  errorMessage,
  statusCode,
) => {
  const BASE_URL = `${process.env.REACT_APP_API_URL}`;
  try {
    let url;
    let body;
    url = `${BASE_URL}tm/errorlog/?errObj=${errObj}&token=${token}&key=${key}&errorMessage=${errorMessage}&statusCode=${statusCode}`;

    body = {
      errObj,
      token,
      key,
      errorMessage,
      statusCode,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      //throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error handling:', error);
  }
};
