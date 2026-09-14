(() => {
  document.querySelectorAll('[data-motion-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const paused=document.body.classList.toggle('motion-paused');
      button.setAttribute('aria-pressed',String(paused));
      button.textContent=paused?'繼續人物動態 ▷':'暫停人物動態 Ⅱ';
    });
  });
})();
