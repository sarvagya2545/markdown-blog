const md = window.markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
});
const mdInputContainer = document.querySelector('#markdown');
const mdOutputContainer = document.querySelector('#output');

mdInputContainer.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
  
      // set textarea value to: text before caret + tab + text after caret
      this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);
  
      // put caret at right position again
      this.selectionStart =
        this.selectionEnd = start + 1;
    }
});

mdInputContainer.addEventListener('input', e => updatePreview(e))

function updatePreview(e, text) {
  let val = md.render(e ? e.target.value : text);
  mdOutputContainer.innerHTML = '';
  mdOutputContainer.insertAdjacentHTML('beforeEnd', val);
}

updatePreview(null, mdInputContainer.value)