const md = window.markdownit();
const mdInputContainer = document.querySelector('#markdown');
const mdOutputContainer = document.querySelector('#output');

mdInputContainer.addEventListener('input', (e) => {
    let val = md.render(e.target.value);
    mdOutputContainer.innerHTML = '';
    mdOutputContainer.insertAdjacentHTML('beforeEnd', val);
})