window.addEventListener("scroll", () => {
  document.querySelectorAll("section").forEach((sec) => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 100;
    const height = sec.offsetHeight;
    if (top >= offset && top < offset + height) {
      sec.classList.add("show-section");
    }
  });
});