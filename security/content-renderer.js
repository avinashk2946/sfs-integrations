(async function renderSecurityPage(){
  const root = document.getElementById("page-root");

  function esc(value){
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function attr(value){
    return esc(value).replace(/`/g, "&#96;");
  }

  function showError(message){
    root.innerHTML = `<main style="font-family:system-ui,sans-serif;padding:32px;max-width:760px;margin:auto"><h1>Content could not be loaded</h1><p>${esc(message)}</p></main>`;
  }

  function sectionHead(section){
    return `
      <div class="sec-head">
        <div class="kicker">${esc(section.kicker)}</div>
        <h2>${esc(section.title)}</h2>
        ${section.description ? `<p>${esc(section.description)}</p>` : ""}
      </div>
    `;
  }

  function renderHeader(page){
    return `
      <div class="topbar">
        <div class="wrap">
          <img src="${attr(page.assets.logo)}" alt="Smart Food Safe">
          <nav class="navlinks">
            ${page.navigation.links.map(link => `<a href="${attr(link.href)}">${esc(link.label)}</a>`).join("")}
          </nav>
        </div>
      </div>
    `;
  }

  function renderHero(hero){
    return `
      <header class="hero">
        <div class="wrap">
          <span class="eyebrow">${esc(hero.eyebrow)}</span>
          <h1>${esc(hero.title)}</h1>
          <p>${esc(hero.description)}</p>
          <div class="cta">
            ${hero.buttons.map(button => `<a class="btn ${button.style === "primary" ? "btn-mint" : "btn-ghost"}" href="${attr(button.href)}">${esc(button.label)}</a>`).join("")}
          </div>
        </div>
      </header>
    `;
  }

  const iconPaths = {
    shield: '<path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/>',
    lock: '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6"/>',
    clock: '<path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9"/><path d="M3 12a9 9 0 0 0 9 9 9 9 0 0 0 9-9"/><path d="M12 7v5l3 2"/>',
    box: '<path d="M12 3v18"/><path d="M5 8l7-5 7 5"/><path d="M5 8v8l7 5 7-5V8"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>'
  };

  function renderDefinitionCard(card){
    return `
      <div class="card reveal">
        <h3>${esc(card.title)}</h3>
        <dl>
          ${card.items.map(([term, definition]) => `<dt>${esc(term)}</dt><dd>${esc(definition)}</dd>`).join("")}
        </dl>
      </div>
    `;
  }

  function renderSection(section){
    const body = section.specs
      ? `<div class="specs">${section.specs.map(([key, value]) => `<div class="row reveal"><div class="k">${esc(key)}</div><div class="v">${esc(value)}</div></div>`).join("")}</div>`
      : `<div class="detail">${section.cards.map(renderDefinitionCard).join("")}</div>${section.note ? `<p style="margin-top:18px;color:var(--grey)">${esc(section.note)}</p>` : ""}`;

    return `
      <section id="${attr(section.id)}"${section.style ? ` class="${attr(section.style)}"` : ""}>
        <div class="wrap">
          ${sectionHead(section)}
          ${body}
        </div>
      </section>
    `;
  }

  function renderPage(page){
    return `
      <div class="page-loader" id="pageLoader" role="status" aria-label="Loading Smart Food Safe">
        <img src="${attr(page.assets.loader)}" alt="">
      </div>
      ${renderHeader(page)}
      ${renderHero(page.hero)}
      <div class="strip">
        <div class="wrap">${page.trustStrip.map(item => `<span>${esc(item)}</span>`).join("")}</div>
      </div>
      <section id="${attr(page.pillars.id)}">
        <div class="wrap">
          ${sectionHead(page.pillars)}
          <div class="pillars">
            ${page.pillars.items.map(item => `
              <div class="pillar reveal">
                <div class="ic"><svg viewBox="0 0 24 24">${iconPaths[item.icon] || iconPaths.shield}</svg></div>
                <h3>${esc(item.title)}</h3>
                <p>${esc(item.description)}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </section>
      ${page.sections.map(renderSection).join("")}
      <section id="${attr(page.faq.id)}">
        <div class="wrap">
          ${sectionHead(page.faq)}
          <div class="faq-groups">
            ${page.faq.groups.map(group => `
              <div class="faq-group reveal">
                <h3>${esc(group.title)}</h3>
                <div class="faq-list">
                  ${group.items.map(([question, answer]) => `<details class="faq-item"><summary>${esc(question)}</summary><div class="faq-answer"><p>${esc(answer)}</p></div></details>`).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </section>
      <section id="${attr(page.contact.id)}" class="contact">
        <div class="wrap">
          <h2>${esc(page.contact.title)}</h2>
          <p>${esc(page.contact.description)}</p>
          <a class="mail" href="mailto:${attr(page.contact.email)}">${esc(page.contact.email)}</a>
        </div>
      </section>
      <footer>
        <div class="wrap">
          <img src="${attr(page.assets.logo)}" alt="Smart Food Safe">
          <div class="meta">${page.footer.meta.map(item => `<span>${esc(item)}</span>`).join("")}</div>
        </div>
      </footer>
    `;
  }

  function bindInteractions(){
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: .12 });
      document.querySelectorAll(".reveal").forEach(node => io.observe(node));
    } else {
      document.querySelectorAll(".reveal").forEach(node => node.classList.add("in"));
    }

    const finishLoading = () => {
      setTimeout(() => {
        document.querySelectorAll(".reveal:not(.in)").forEach(node => {
          if (node.getBoundingClientRect().top < window.innerHeight) node.classList.add("in");
        });
      }, 400);
      const loader = document.getElementById("pageLoader");
      if (loader) {
        loader.classList.add("is-hidden");
        setTimeout(() => loader.remove(), 250);
      }
    };

    if (document.readyState === "complete") finishLoading();
    else window.addEventListener("load", finishLoading, { once: true });
  }

  try {
    const response = await fetch("content.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const page = await response.json();
    document.title = page.page.title || document.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && page.page.description) description.setAttribute("content", page.page.description);
    root.innerHTML = renderPage(page);
    bindInteractions();
  } catch (error) {
    showError("Serve this folder over HTTP so the page can fetch content.json.");
    console.error(error);
  }
})();
