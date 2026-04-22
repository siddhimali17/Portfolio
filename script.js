const state = {
  data: null,
  activeCategory: "All"
};

const elements = {
  brandName: document.getElementById("brandName"),
  heroEyebrow: document.getElementById("heroEyebrow"),
  heroTitle: document.getElementById("heroTitle"),
  heroRole: document.getElementById("heroRole"),
  heroDescription: document.getElementById("heroDescription"),
  heroHighlights: document.getElementById("heroHighlights"),
  heroSocials: document.getElementById("heroSocials"),
  aboutText: document.getElementById("aboutText"),
  aboutPills: document.getElementById("aboutPills"),
  projectFilters: document.getElementById("projectFilters"),
  projectsGrid: document.getElementById("projectsGrid"),
  skillsGrid: document.getElementById("skillsGrid"),
  experienceTimeline: document.getElementById("experienceTimeline"),
  resumeTitle: document.getElementById("resumeTitle"),
  resumeDescription: document.getElementById("resumeDescription"),
  resumeDownload: document.getElementById("resumeDownload"),
  resumePreview: document.getElementById("resumePreview"),
  contactIntro: document.getElementById("contactIntro"),
  contactList: document.getElementById("contactList"),
  footerText: document.getElementById("footerText"),
  navToggle: document.getElementById("navToggle"),
  siteNav: document.getElementById("siteNav"),
  contactForm: document.getElementById("contactForm")
};

async function initPortfolio() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error("Could not load portfolio data.");
    }

    state.data = await response.json();
    applySiteContent();
    setupNavigation();
    setupContactForm();
    setupSectionSpy();
  } catch (error) {
    console.error(error);
    document.body.innerHTML = `
      <main class="section">
        <div class="container">
          <div class="resume-card">
            <div>
              <p class="eyebrow">Content Error</p>
              <h2>Portfolio data could not be loaded.</h2>
              <p>Please make sure <strong>data.json</strong> is present in the same folder as this page.</p>
            </div>
          </div>
        </div>
      </main>
    `;
  }
}

function applySiteContent() {
  const { site, hero, about, projects, skills, experience, resume, contact } = state.data;

  document.title = site.title;
  elements.brandName.textContent = site.brandName;
  elements.footerText.textContent = site.footerText;

  elements.heroEyebrow.textContent = hero.eyebrow;
  elements.heroTitle.textContent = hero.title;
  elements.heroRole.textContent = hero.role;
  elements.heroDescription.textContent = hero.description;

  elements.heroHighlights.innerHTML = hero.highlights
    .map(
      ({ value, label }) => `
        <article class="highlight-card">
          <strong>${escapeHtml(value)}</strong>
          <span>${escapeHtml(label)}</span>
        </article>
      `
    )
    .join("");

  elements.heroSocials.innerHTML = hero.socials
    .map(
      ({ label, value, url }) => `
        <a class="social-link" href="${url}" target="_blank" rel="noreferrer">
          <span>
            <strong>${escapeHtml(label)}</strong>
            ${escapeHtml(value)}
          </span>
          <span aria-hidden="true">Open</span>
        </a>
      `
    )
    .join("");

  elements.aboutText.innerHTML = about.paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  elements.aboutPills.innerHTML = about.pills
    .map((pill) => `<span class="pill">${escapeHtml(pill)}</span>`)
    .join("");

  renderProjectFilters(projects);
  renderProjects(projects);

  elements.skillsGrid.innerHTML = skills
    .map(
      (group) => `
        <article class="skill-card">
          <h3>${escapeHtml(group.title)}</h3>
          <div class="skill-list">
            ${group.items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");

  elements.experienceTimeline.innerHTML = experience
    .map(
      (item) => `
        <article class="timeline-item">
          <h3>${escapeHtml(item.role)}</h3>
          <div class="timeline-meta">
            <span>${escapeHtml(item.company)}</span>
            <span>${escapeHtml(item.duration)}</span>
            <span>${escapeHtml(item.location)}</span>
          </div>
          <p>${escapeHtml(item.description)}</p>
          <div class="tag-row">
            ${item.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
          </div>
          <ul class="timeline-list">
            ${item.highlights.map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");

  elements.resumeTitle.textContent = resume.title;
  elements.resumeDescription.textContent = resume.description;
  elements.resumeDownload.href = resume.downloadUrl;
  elements.resumePreview.href = resume.previewUrl;

  elements.contactIntro.textContent = contact.intro;
  elements.contactList.innerHTML = contact.items
    .map(
      ({ label, value, url }) => `
        <a class="contact-item" href="${url}" target="_blank" rel="noreferrer">
          <span>
            <strong>${escapeHtml(label)}</strong>
            ${escapeHtml(value)}
          </span>
          <span aria-hidden="true">Open</span>
        </a>
      `
    )
    .join("");
}

function renderProjectFilters(projects) {
  const categories = ["All", ...new Set(projects.map((project) => project.category))];

  elements.projectFilters.innerHTML = categories
    .map(
      (category) => `
        <button
          class="filter-button ${category === state.activeCategory ? "active" : ""}"
          type="button"
          data-category="${escapeHtml(category)}"
        >
          ${escapeHtml(category)}
        </button>
      `
    )
    .join("");

  elements.projectFilters.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category;
      renderProjectFilters(projects);
      renderProjects(projects);
    });
  });
}

function renderProjects(projects) {
  const filteredProjects = state.activeCategory === "All"
    ? projects
    : projects.filter((project) => project.category === state.activeCategory);

  elements.projectsGrid.innerHTML = filteredProjects
    .map(
      (project) => `
        <article class="project-card">
          <div class="project-media">
            <img src="${project.image}" alt="${escapeHtml(project.title)} preview">
          </div>
          <div class="project-content">
            <span class="eyebrow">${escapeHtml(project.category)}</span>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <div class="tag-row">
              ${project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
            <div class="link-row">
              ${project.links
                .map(
                  (link) => `
                    <a class="text-link" href="${link.url}" target="_blank" rel="noreferrer">
                      ${escapeHtml(link.label)}
                    </a>
                  `
                )
                .join("")}
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function setupNavigation() {
  elements.navToggle.addEventListener("click", () => {
    const isOpen = elements.siteNav.classList.toggle("is-open");
    elements.navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  elements.siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      elements.siteNav.classList.remove("is-open");
      elements.navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupSectionSpy() {
  const sectionIds = ["about", "projects", "skills", "experience", "resume", "contact"];
  const navLinks = [...elements.siteNav.querySelectorAll("a")];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    {
      threshold: 0.4,
      rootMargin: "-10% 0px -45% 0px"
    }
  );

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) {
      observer.observe(section);
    }
  });
}

function setupContactForm() {
  elements.contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const { contact } = state.data;
    const formData = new FormData(elements.contactForm);
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const subject = formData.get("subject")?.toString().trim() ?? "";
    const message = formData.get("message")?.toString().trim() ?? "";

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message
    ].join("\n");

    const mailtoUrl = `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

initPortfolio();
styles.css
