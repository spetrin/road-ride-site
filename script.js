// Меню для мобильных
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

menuBtn.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Обновление года в футере
document.querySelectorAll('#year, #year2, #year3').forEach(el => {
  el.textContent = new Date().getFullYear();
});
