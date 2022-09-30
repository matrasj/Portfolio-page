// Navigation

const navigationContainer = document.getElementById("navigation");
const seeProjectsBtn = document.getElementById("see-projects-btn");
const portfolioSection = document.getElementById("portfolio");

navigationContainer.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.closest(".icon-link")) {
    const elementId = e.target.closest(".icon-link").getAttribute("href");
    document.querySelector(`${elementId}`).scrollIntoView({
      behavior: "smooth",
    });
  }
});

seeProjectsBtn.addEventListener("click", (e) => {
  portfolioSection.scrollIntoView({
    behavior: "smooth",
  });
});
