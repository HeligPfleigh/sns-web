export default (url) => {
  function isYoutube() {
    return /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/.test(url);
  }

  function isVimeo() {
    return /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/.test(url);
  }

  function isDailymotion() {
    return /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/.test(url);
  }

  function isSoundCloud() {
    return /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/.test(url);
  }

  function isFacebookVideo() {
    return /^https:\/\/www\.facebook\.com\/([^/?].+\/)?video(s|\.php)[/?].*$/.test(url);
  }

  function isVidme() {
    return /^https?:\/\/vid.me\/([a-z0-9]+)$/i.test(url);
  }

  function isWistia() {
    return /^https?:\/\/(.+)?(wistia.com|wi.st)\/(medias|embed)\/(.*)$/.test(url);
  }

  function isStreamable() {
    return /^https?:\/\/streamable.com\/([a-z0-9]+)$/.test(url);
  }

  function isFilePlayer() {
    return /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i.test(url);
  }

  return isYoutube() || isVimeo() || isDailymotion() || isSoundCloud() || isFacebookVideo() || isVidme() || isWistia() || isStreamable() || isFilePlayer();
};
