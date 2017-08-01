

const fetchAPI = async (url, data) => {
  const response = await fetch(url, {
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    credentials: 'same-origin',
    method: 'post',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw Error(response.statusText);
  }

  const result = await response.json();
  return result;
};


export default fetchAPI;
