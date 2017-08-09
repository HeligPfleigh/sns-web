export const checkYoutubeUrl = (url) => {
  const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  const regex = new RegExp(p);
  return regex.test(url);
};
