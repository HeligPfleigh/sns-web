import config from '../config';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
const uploadImage = async (file) => {
  const url = 'http://api-sns.mttjsc.com/upload/image';

  const token = getCookie('id_token');
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(url, {
    headers: new Headers({
      authorization: token,
    }),
    method: 'post',
    body: formData,
  });
  if (!response.ok) {
    throw Error(response.statusText);
  }

  const result = await response.json();
  return result;
};

export default uploadImage;
