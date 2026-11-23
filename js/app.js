(function () {
  const data = window.PORTFOLIO_DATA;

  // 1. Render Projects
  const projectsEl = document.getElementById("projects-list");
  data.projects.forEach((p) => {
    const article = document.createElement("article");
    article.className = "project-card scroll-reveal";
    article.setAttribute("data-interactive", "true");
    article.innerHTML = `
      <div>
        <div class="project-meta">${p.year} / ${p.role}</div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-summary">${p.summary}</p>
        <p class="project-stack">${p.stack}</p>
        <div class="project-actions">
          <button class="text-link open-case-study" data-id="${p.id}" data-interactive="true">Inspect Architecture →</button>
          <a class="text-link" href="${p.repoUrl}" target="_blank" rel="noreferrer" data-interactive="true">GitHub Repository →</a>
        </div>
      </div>
      <div class="project-visual open-case-study" data-id="${p.id}" data-interactive="true">
        <span class="visual-label">System Module</span>
        <div class="visual-title">${p.title}</div>
        <span class="visual-hint">Click to inspect architecture</span>
      </div>
    `;
    projectsEl.appendChild(article);
  });

  // 2. Render Experience
  const expEl = document.getElementById("experience-list");
  data.experience.forEach((item) => {
    const card = document.createElement("div");
    card.className = "timeline-card scroll-reveal";
    const bullets = item.points.map((pt) => `<li>${pt}</li>`).join("");
    card.innerHTML = `
      <div class="timeline-period">${item.period}</div>
      <div>
        <h3 class="timeline-org">${item.org}</h3>
        <div class="timeline-role">${item.role}</div>
        <div class="timeline-meta">${item.meta}</div>
        <ul class="timeline-points">${bullets}</ul>
      </div>
    `;
    expEl.appendChild(card);
  });

  // 3. Render Skills
  const skillsEl = document.getElementById("skills-grid");
  data.skills.forEach((s) => {
    const card = document.createElement("div");
    card.className = "skill-card scroll-reveal";
    card.innerHTML = `
      <h3 class="skill-category">${s.category}</h3>
      <p class="skill-items">${s.items}</p>
    `;
    skillsEl.appendChild(card);
  });

  // 4. Render Education
  const eduEl = document.getElementById("education-list");
  data.education.forEach((e) => {
    const card = document.createElement("div");
    card.className = "timeline-card scroll-reveal";
    card.innerHTML = `
      <div class="timeline-period">${e.period}</div>
      <div>
        <h3 class="timeline-org">${e.institution}</h3>
        <div class="timeline-role">${e.degree} — ${e.score}</div>
        ${e.detail ? `<p class="project-summary">${e.detail}</p>` : ""}
      </div>
    `;
    eduEl.appendChild(card);
  });

  // 5. Render Certifications
  const certsEl = document.getElementById("certs-grid");
  data.certifications.forEach((c) => {
    const card = document.createElement("div");
    card.className = "cert-card scroll-reveal";
    card.innerHTML = `
      <div class="cert-title">${c.title}</div>
      <div class="cert-issuer">${c.issuer}</div>
    `;
    certsEl.appendChild(card);
  });

  // 6. Case Study Drawer
  const drawer = document.getElementById("drawer-backdrop");
  const drawerBody = document.getElementById("drawer-body");
  const drawerClose = document.getElementById("drawer-close");

  function openDrawer(projectId) {
    const project = data.projects.find((x) => x.id === projectId);
    if (!project) return;
    const archItems = project.architecture.map((line) => `<li>${line}</li>`).join("");
    drawerBody.innerHTML = `
      <div class="project-meta">${project.year} / ${project.role}</div>
      <h2 class="section-title">${project.title}</h2>
      <p class="project-summary" style="margin-top: 20px;">${project.summary}</p>
      <p class="project-stack" style="margin-top: 16px;">${project.stack}</p>
      <h3 class="skill-category" style="margin-top: 36px;">System Architecture & Execution</h3>
      <ul class="drawer-arch-list">${archItems}</ul>
      <div class="action-row" style="margin-top: 36px;">
        <a href="${project.repoUrl}" target="_blank" rel="noreferrer" class="btn btn-primary" data-interactive="true">View Source on GitHub</a>
      </div>
    `;
    drawer.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".open-case-study");
    if (trigger) {
      openDrawer(trigger.getAttribute("data-id"));
    }
    if (e.target === drawer) {
      closeDrawer();
    }
  });

  drawerClose.addEventListener("click", closeDrawer);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // 7. Preloader & GSAP Choreography
  const preloader = document.getElementById("preloader");
  const preloaderBar = document.querySelector(".preloader-bar");
  const preloaderPct = document.getElementById("preloader-pct");

  function finishPreloader() {
    if (typeof gsap !== "undefined") {
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.85,
        ease: "power4.inOut",
        onComplete: () => {
          preloader.style.display = "none";
          initAnimations();
        }
      });
    } else {
      preloader.style.display = "none";
    }
  }

  let progress = 0;
  const loadTimer = setInterval(() => {
    progress = Math.min(100, progress + Math.floor(Math.random() * 18) + 12);
    preloaderBar.style.width = progress + "%";
    preloaderPct.textContent = progress + "%";
    if (progress >= 100) {
      clearInterval(loadTimer);
      setTimeout(finishPreloader, 180);
    }
  }, 45);

  function initAnimations() {
    if (typeof Lenis !== "undefined" && typeof gsap !== "undefined") {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });
      if (typeof ScrollTrigger !== "undefined") {
        lenis.on("scroll", ScrollTrigger.update);
      }
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    if (typeof gsap === "undefined") return;
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    gsap.from(".hero-stagger", {
      y: 36,
      opacity: 0,
      duration: 0.85,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "transform,opacity"
    });

    // Kinetic Marquee Loop
    const marqueeTrack = document.querySelector(".marquee-track");
    if (marqueeTrack) {
      gsap.to(marqueeTrack, {
        xPercent: -50,
        repeat: -1,
        duration: 24,
        ease: "none"
      });
    }

    // Scroll Reveals (safe: immediateRender false so nothing stays hidden)
    if (typeof ScrollTrigger !== "undefined") {
      gsap.utils.toArray(".scroll-reveal").forEach((el) => {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          immediateRender: false,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true
          }
        });
      });
    }
  }

  // 8. Dual-Element Custom Cursor + Magnetic Buttons
  const dot = document.getElementById("cursor-dot");
  const reticle = document.getElementById("cursor-reticle");

  if (!window.matchMedia("(pointer: coarse)").matches) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let isHover = false;
    let isDown = false;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
    });

    document.addEventListener("mouseover", (e) => {
      isHover = Boolean(e.target.closest("a, button, [data-interactive]"));
      reticle.classList.toggle("is-hover", isHover);
    });

    window.addEventListener("mousedown", () => { isDown = true; });
    window.addEventListener("mouseup", () => { isDown = false; });

    function cursorLoop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      const scale = isDown ? 0.75 : isHover ? 1.55 : 1;
      const rot = isHover ? 45 : 0;
      reticle.style.transform = `translate3d(${rx - 15}px, ${ry - 15}px, 0) scale(${scale}) rotate(${rot}deg)`;
      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();

    // Magnetic Pull on Primary Buttons
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.18;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.18;
        btn.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate3d(0, 0, 0)";
      });
    });
  }
})();
