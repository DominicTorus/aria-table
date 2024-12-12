import axios from 'axios';

const encodeFormData = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

export const loginWithRealm = async (data) => {
  var url = `${process.env.REACT_APP_KEYCLOCK}/realms/${data.realm}/protocol/openid-connect/token`;
  var maindata = { ...data, grant_type: 'password' };
  delete maindata.realm;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeFormData(maindata),
    });

    // Parsing JSON response and returning it
    const jsonResponse = await res.json();
    if (jsonResponse.error) return 'Invalid user credentials';
    return jsonResponse;
  } catch (err) {
    return 'error';
  }
};

export const getRealm = async () => {
  const adminToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwd25RMHBFZFJDYXFUTTJvR3QwOVJjSlZJdTQyY0p2Q0RzaGpnbzBZanUwIn0.eyJleHAiOjE3MTI4MTI5NTksImlhdCI6MTcxMjgxMjg5OSwiYXV0aF90aW1lIjoxNzEyODEyODk4LCJqdGkiOiJhNTA4OGJiYS1kZWVkLTQ1MGQtOWIzYi1hMmM3NjYzZDQ2YzIiLCJpc3MiOiJodHRwOi8vMTkyLjE2OC4yLjExMDo4MDgwL3JlYWxtcy9tYXN0ZXIiLCJzdWIiOiJjY2IyYmUyOS0wNzM5LTQwMzktODQxZS0zMDhhOGMzMTEzMDYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzZWN1cml0eS1hZG1pbi1jb25zb2xlIiwibm9uY2UiOiIxMzhhNThiYS1kNWNhLTRiNDUtODE3Ny0xODk4M2ZhMTk5N2QiLCJzZXNzaW9uX3N0YXRlIjoiNjcyNjVhMzQtYzc2OC00MDY0LWE0OTUtNmIyMzgzZTI4NjU0IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vMTkyLjE2OC4yLjExMDo4MDgwIl0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJzaWQiOiI2NzI2NWEzNC1jNzY4LTQwNjQtYTQ5NS02YjIzODNlMjg2NTQiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIn0.BU1HnqP84urWAL83kBvJfko9P9qFmSHL2VjqoyKjY2P2Ae56cSHzc7dnCZURUQdCV7wZ_nLUWw3lQuKdIZL3TRWmHHZOLJajtCnNGz7eb5eP-rOQF8UtzckbbDOsAxBWOmcAe3lJ9QyP1KUkHQldCsGkpsiCGIkux627ULyfrj3fiWz7GgArV3bAi01416PiNxasovxsaiC5_C_75RSCOUfl1kfRjesPyRcVyM66VldQVAbneylE4gpkKeqzDVfDIGu0t-nCQu0GfOkXlMYcjsqGkr4CAxfOJHSQfbbND5PfSLMmAwj2r-00SVTId_qUuiIWo-6pGXhXrbEMSOkboA'; // Replace with your admin access token

  try {
    const response = await fetch(
      `${process.env.REACT_APP_KEYCLOCK}/auth/admin/realms`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + adminToken,
        },
      },
    );
    if (response.ok) {
      const realms = await response.json();
      return realms;
    } else {
      throw new Error('Failed to fetch realms');
    }
  } catch (error) {
    return null;
  }
};

export const logoutRealm = async (data, token) => {
  if (!data?.realm) return '';
  var logOutUrl = `${process.env.REACT_APP_KEYCLOCK}/realms/${data.realm}/protocol/openid-connect/logout`;
  var maindata = { ...data, refresh_token: token.refresh_token };
  delete maindata.realm;
  try {
    await fetch(logOutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeFormData(maindata),
    });

    return 'success';
  } catch (err) {
    return 'error';
  }
};

export const checkIsActive = async (data, token) => {
  var checkisAciveUrl = `${process.env.REACT_APP_KEYCLOCK}/realms/${data.realm}/protocol/openid-connect/token/introspect`;
  if (token.hasOwnProperty('access_token')) {
    var maindata = { ...data, token: token.access_token };
    delete maindata.realm;
    try {
      const res = await fetch(checkisAciveUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: encodeFormData(maindata),
      })
        .then((res) => res.json())
        .then((res) => res)
        .catch((err) => console.error(err));

      return res;
    } catch (err) {
      return 'server error';
    }
  }
  return 'token not there';
};

export const forgetPass = async (data) => {
  try {
    var maindata = {
      email: data.email,
      realmId: data.realmId,
    };

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}keycloak/resetotp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maindata),
      },
    )
      .then((res) => res.json())
      .catch((err) => console.error(err));
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const getAllRealmOnDatabase = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}keycloak/allRealm`,
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const otpCheck = async (data) => {
  var maindata = {
    email: data.email,
    realmId: data.realmId,
    otp: data.otp,
  };
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}keycloak/verifyPasswordOtp`,
      maindata,
    );
    return res.data;
  } catch (err) {
    return 'error';
  }
};

export const resetPasswordOnDatabase = async (data) => {
  var maindata = {
    userId: data.userId,
    password: data.password,
  };
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}keycloak/changepassword`,
      maindata,
    );

    return res.data;
  } catch (err) {
    return 'error';
  }
};

export const getVerifyOtp = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}keycloak/sendVerificationOTP`,
      data,
    );

    return res.data;
  } catch (err) {
    return 'error';
  }
};

export const validateOtp = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}keycloak/verifyMailId`,
      data,
    );
    return res.data;
  } catch (err) {
    return 'error';
  }
};
