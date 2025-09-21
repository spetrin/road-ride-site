// Мобильное меню
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuBtn.classList.toggle("open"); // можно добавить анимацию кнопки
  });
}

// Год в футере
const year = new Date().getFullYear();
["year", "year2", "year3"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.textContent = year;
});
