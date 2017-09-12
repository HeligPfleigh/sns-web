export default (url, {
  fileName,
} = {}) => {
  const anchor = document.createElement('a');

  if ('download' in anchor) {
    // html5 A[download]
    anchor.href = url;
    if (fileName) {
      anchor.setAttribute('download', fileName);
    }
    anchor.innerHTML = 'downloading...';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    setTimeout(() => {
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => {
        self.URL.revokeObjectURL(anchor.href);
      }, 250);
    }, 66);
    return true;
  }

  // handle non-a[download] safari as best we can:
  if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
    if (!window.open(url, `download-${Math.random()}`, [
      'toolbar=yes',
      'scrollbars=yes',
      'location=yes',
      'menubar=yes',
      'resizable=yes',
      'fullscreen=yes',
      'status=yes',
      `width=${window.outerWidth}`,
      `height=${window.outerHeight}`,
      'left=0',
      'top=0',
    ].join(','))) { // popup blocked, offer direct download:
      if (window.confirm('Displaying New Document\n\nUse Save As... to download, then click back to return to this page.')) {
        location.href = url;
      }
    }
    return true;
  }

  // do iframe dataURL download (old ch+FF):
  const f = document.createElement('iframe');
  document.body.appendChild(f);
  f.src = url;
  setTimeout(() => {
    document.body.removeChild(f);
  }, 333);

  return true;
};
