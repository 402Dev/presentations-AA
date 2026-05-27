(function () {
  function safeStorageGet(key) {
    if (!key) {
      return null;
    }

    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    if (!key) {
      return;
    }

    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  }

  function safeStorageRemove(key) {
    if (!key) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      return;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function slugify(value) {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function truncateText(value, maxLength) {
    const text = String(value ?? "").trim();

    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
  }

  function normalizeChoice(value) {
    const slug = slugify(value);

    if (slug === "valuable" || slug === "high-value") {
      return {
        key: "valuable",
        label: "Valuable",
        shortLabel: "Value",
      };
    }

    if (slug === "not-useful" || slug === "not-useful-now") {
      return {
        key: "not-useful",
        label: "Not useful",
        shortLabel: "Drop",
      };
    }

    if (slug === "not-sure" || slug === "needs-evidence") {
      return {
        key: "not-sure",
        label: "Not sure",
        shortLabel: "Hold",
      };
    }

    return {
      key: "pending",
      label: "Pending",
      shortLabel: "Pending",
    };
  }

  function initializeDeck() {
    const slides = Array.from(document.querySelectorAll(".slide-container"));

    if (!slides.length) {
      return;
    }

    const counter = document.getElementById("slide-counter");
    const sidebarNodes = Array.from(
      document.querySelectorAll(
        ".sidebar-item[data-slide], .sidebar-item[data-slides]",
      ),
    );
    const sidebarNav = document.getElementById("sidebarNav");
    const sidebarPinBtn = document.getElementById("sidebarPinBtn");
    const sidebarSections = Array.from(
      document.querySelectorAll(".sidebar-section"),
    );
    const sidebarSubsections = Array.from(
      document.querySelectorAll(".sidebar-subsection"),
    );
    const sidebarCurrentSection = document.getElementById(
      "sidebar-current-section",
    );
    const sidebarCurrentTitle = document.getElementById(
      "sidebar-current-title",
    );
    const historyBackBtn = document.getElementById("historyBackBtn");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;
    const themeStorageKey =
      document.body.dataset.themeStorageKey || "presentation-theme";
    const feedbackStorageKey = document.body.dataset.feedbackStorageKey || null;
    const feedbackForms = Array.from(
      document.querySelectorAll("[data-feedback-form][data-feature-key]"),
    );
    const navigationHistory = [];
    let current = 0;

    slides[slides.length - 1]?.classList.add("last-slide");

    const featureEntries = feedbackForms
      .map((form) => {
        const featureKey = form.dataset.featureKey;

        if (!featureKey) {
          return null;
        }

        const feedbackSlide = form.closest(".slide-container");

        return {
          key: featureKey,
          title: form.dataset.featureTitle || featureKey,
          category: form.dataset.featureCategory || "Unassigned",
          definition: form.dataset.featureDefinition || "",
          utility: form.dataset.featureUtility || "",
          slideIndex: slides.indexOf(feedbackSlide),
        };
      })
      .filter(Boolean);

    const feedbackState = {};

    function getStoredTheme() {
      const storedTheme = safeStorageGet(themeStorageKey);

      return storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : null;
    }

    function setStoredTheme(theme) {
      safeStorageSet(themeStorageKey, theme);
    }

    function updateThemeToggleButton(theme) {
      if (!themeToggleBtn) {
        return;
      }

      const nextActionLabel =
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

      themeToggleBtn.setAttribute("aria-label", nextActionLabel);
      themeToggleBtn.setAttribute("title", nextActionLabel);
      themeToggleBtn.setAttribute("aria-pressed", String(theme === "dark"));

      const icon = themeToggleBtn.querySelector("i");
      if (icon) {
        icon.className =
          theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
      }
    }

    function applyTheme(theme) {
      const nextTheme = theme === "dark" ? "dark" : "light";

      document.body.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
      updateThemeToggleButton(nextTheme);
    }

    function toggleTheme() {
      const nextTheme =
        document.body.dataset.theme === "dark" ? "light" : "dark";

      setStoredTheme(nextTheme);
      applyTheme(nextTheme);
    }

    function enterPdfExportMode() {
      document.body.classList.add("pdf-exporting");
    }

    function exitPdfExportMode() {
      document.body.classList.remove("pdf-exporting");
    }

    function exportPresentationToPDF() {
      enterPdfExportMode();

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.print();
        });
      });
    }

    function updateCounter() {
      if (!counter) {
        return;
      }

      counter.textContent = `${current + 1} / ${slides.length}`;
    }

    function updateHistoryBackButton() {
      if (!historyBackBtn) {
        return;
      }

      historyBackBtn.hidden = navigationHistory.length === 0;
    }

    function setSidebarPinned(isPinned) {
      if (!sidebarNav || !sidebarPinBtn) {
        return;
      }

      sidebarNav.classList.toggle("pinned", isPinned);
      sidebarPinBtn.classList.toggle("active", isPinned);
      sidebarPinBtn.setAttribute("aria-pressed", String(isPinned));
    }

    function toggleSidebarPin() {
      if (!sidebarNav) {
        return;
      }

      setSidebarPinned(!sidebarNav.classList.contains("pinned"));
    }

    function updateSidebar() {
      if (!sidebarNodes.length) {
        return;
      }

      let activeNode = null;

      sidebarNodes.forEach((element) => {
        const targetSlides = (element.dataset.slides || element.dataset.slide)
          .split(",")
          .map((value) => parseInt(value.trim(), 10))
          .filter((value) => !Number.isNaN(value));
        const isActive = targetSlides.includes(current);

        element.classList.toggle("active", isActive);
        element.setAttribute("aria-current", isActive ? "true" : "false");

        if (isActive) {
          activeNode = element;
        }
      });

      sidebarSections.forEach((section) => {
        const isActive = activeNode ? section.contains(activeNode) : false;

        section.classList.toggle("active", isActive);
        section.open = isActive;
      });

      sidebarSubsections.forEach((subsection) => {
        const isActive = activeNode ? subsection.contains(activeNode) : false;

        subsection.classList.toggle("active", isActive);
        subsection.open = isActive;
      });

      if (!activeNode) {
        return;
      }

      const activeSection = activeNode.closest(".sidebar-section");
      const activeSubsection = activeNode.closest(".sidebar-subsection");
      const sectionParts = [];

      if (activeSection?.dataset.sectionTitle) {
        sectionParts.push(activeSection.dataset.sectionTitle);
      }

      if (activeSubsection?.dataset.sectionTitle) {
        sectionParts.push(activeSubsection.dataset.sectionTitle);
      }

      if (sidebarCurrentSection) {
        sidebarCurrentSection.textContent = sectionParts.join(" / ");
      }

      if (sidebarCurrentTitle) {
        sidebarCurrentTitle.textContent = activeNode.textContent.trim();
      }
    }

    function setActiveSlide(index, options = {}) {
      const { recordHistory = false } = options;

      if (index < 0 || index >= slides.length) {
        return;
      }

      if (index === current) {
        updateHistoryBackButton();
        return;
      }

      if (recordHistory) {
        navigationHistory.push(current);
      }

      slides[current]?.classList.remove("active");
      current = index;
      slides[current]?.classList.add("active");

      updateCounter();
      updateSidebar();
      updateHistoryBackButton();
    }

    function goToSlide(index, options = {}) {
      setActiveSlide(index, { recordHistory: true, ...options });
    }

    function goBackInHistory() {
      const previousSlide = navigationHistory.pop();

      if (typeof previousSlide !== "number") {
        updateHistoryBackButton();
        return;
      }

      setActiveSlide(previousSlide);
    }

    function changeSlide(direction) {
      setActiveSlide((current + direction + slides.length) % slides.length);
    }

    function loadFeedbackState() {
      if (!feedbackStorageKey) {
        return;
      }

      const rawValue = safeStorageGet(feedbackStorageKey);

      if (!rawValue) {
        return;
      }

      try {
        const storedState = JSON.parse(rawValue);

        if (storedState && typeof storedState === "object") {
          Object.entries(storedState).forEach(([key, value]) => {
            if (!value || typeof value !== "object") {
              return;
            }

            feedbackState[key] = {
              choice: normalizeChoice(value.choice).label,
              comment: String(value.comment ?? "").trim(),
            };
          });
        }
      } catch (error) {
        safeStorageRemove(feedbackStorageKey);
      }
    }

    function saveFeedbackState() {
      if (!feedbackStorageKey) {
        return;
      }

      safeStorageSet(feedbackStorageKey, JSON.stringify(feedbackState));
    }

    function getFormChoice(form) {
      const selectedChoice = form.querySelector("input[type='radio']:checked");
      return normalizeChoice(selectedChoice?.value).label;
    }

    function getFormComment(form) {
      const commentField = form.querySelector("[data-feedback-comment]");
      return String(commentField?.value ?? "").trim();
    }

    function getFeedbackRecord(featureKey) {
      const entry = feedbackState[featureKey] || {};
      const choice = normalizeChoice(entry.choice);

      return {
        choiceKey: choice.key,
        choiceLabel: choice.label,
        choiceShortLabel: choice.shortLabel,
        comment: String(entry.comment ?? "").trim(),
      };
    }

    function updateFeedbackFormStatus(form) {
      const featureKey = form.dataset.featureKey;

      if (!featureKey) {
        return;
      }

      const record = getFeedbackRecord(featureKey);
      const choiceOutput = form.querySelector("[data-feedback-choice-output]");
      const commentOutput = form.querySelector(
        "[data-feedback-comment-output]",
      );

      form.dataset.choice = record.choiceKey;

      if (choiceOutput) {
        choiceOutput.textContent = record.choiceLabel;
      }

      if (commentOutput) {
        commentOutput.textContent = record.comment
          ? `${record.comment.length} chars noted`
          : "No comment yet";
      }
    }

    function syncFeedbackStateFromForm(form) {
      const featureKey = form.dataset.featureKey;

      if (!featureKey) {
        return;
      }

      feedbackState[featureKey] = {
        choice: getFormChoice(form),
        comment: getFormComment(form),
      };

      updateFeedbackFormStatus(form);
      saveFeedbackState();
      renderFeedbackSummary();
    }

    function hydrateFeedbackForms() {
      feedbackForms.forEach((form) => {
        const featureKey = form.dataset.featureKey;
        const storedRecord = featureKey ? feedbackState[featureKey] : null;

        if (storedRecord?.choice) {
          const choiceToApply = normalizeChoice(storedRecord.choice).label;
          const radioToCheck = Array.from(
            form.querySelectorAll("input[type='radio']"),
          ).find(
            (radioInput) =>
              normalizeChoice(radioInput.value).label === choiceToApply,
          );

          if (radioToCheck) {
            radioToCheck.checked = true;
          }
        }

        const commentField = form.querySelector("[data-feedback-comment]");
        if (commentField && storedRecord?.comment) {
          commentField.value = storedRecord.comment;
        }

        if (!storedRecord) {
          feedbackState[featureKey] = {
            choice: getFormChoice(form),
            comment: getFormComment(form),
          };
        }

        updateFeedbackFormStatus(form);
      });
    }

    function buildFeedbackSummary() {
      return featureEntries.map((entry) => {
        const record = getFeedbackRecord(entry.key);

        return {
          ...entry,
          ...record,
        };
      });
    }

    function renderFeedbackStats(summary) {
      const statContainers = Array.from(
        document.querySelectorAll("[data-feedback-stats]"),
      );

      if (!statContainers.length) {
        return;
      }

      const counts = summary.reduce(
        (accumulator, entry) => {
          accumulator[entry.choiceKey] += 1;
          return accumulator;
        },
        {
          valuable: 0,
          "not-sure": 0,
          "not-useful": 0,
          pending: 0,
        },
      );

      const statsMarkup = [
        { key: "valuable", label: "Valuable" },
        { key: "not-sure", label: "Not sure" },
        { key: "not-useful", label: "Not useful" },
        { key: "pending", label: "Pending" },
      ]
        .map(
          (stat) => `
            <div class="feedback-mini-stat feedback-mini-stat--${stat.key}">
              <span class="feedback-mini-stat-label">${escapeHtml(stat.label)}</span>
              <strong class="feedback-mini-stat-value">${counts[stat.key]}</strong>
            </div>
          `,
        )
        .join("");

      statContainers.forEach((container) => {
        container.innerHTML = statsMarkup;
      });
    }

    function renderFeedbackTable(summary) {
      const tableBodies = Array.from(
        document.querySelectorAll("[data-feedback-table-body]"),
      );

      if (!tableBodies.length) {
        return;
      }

      const rowsMarkup = summary
        .map(
          (entry) => `
            <tr class="feedback-summary-row feedback-summary-row--${entry.choiceKey}">
              <td>
                <div class="feedback-summary-feature-title">${escapeHtml(entry.title)}</div>
                <div class="feedback-summary-feature-meta">${escapeHtml(entry.definition || entry.utility || "Feature placeholder")}</div>
              </td>
              <td>${escapeHtml(entry.category)}</td>
              <td>
                <span class="feedback-status-pill feedback-status-pill--${entry.choiceKey}">
                  ${escapeHtml(entry.choiceLabel)}
                </span>
              </td>
              <td>${entry.comment ? escapeHtml(truncateText(entry.comment, 120)) : '<span class="feedback-empty-state">No note</span>'}</td>
              <td>
                <button
                  class="feedback-jump-btn"
                  type="button"
                  data-jump-slide="${entry.slideIndex}"
                >
                  Review
                </button>
              </td>
            </tr>
          `,
        )
        .join("");

      tableBodies.forEach((tableBody) => {
        tableBody.innerHTML = rowsMarkup;
      });
    }

    function renderFeedbackBoard(summary) {
      const boardContainers = Array.from(
        document.querySelectorAll("[data-feedback-board]"),
      );

      if (!boardContainers.length) {
        return;
      }

      const lanes = [
        {
          key: "valuable",
          label: "Advance",
          description: "Clear candidate for inclusion or prioritization.",
        },
        {
          key: "not-sure",
          label: "Need evidence",
          description:
            "Promising, but still needs examples or tighter justification.",
        },
        {
          key: "not-useful",
          label: "Drop or reframe",
          description: "Low value in its current formulation.",
        },
        {
          key: "pending",
          label: "Unanswered",
          description: "No decision has been recorded yet.",
        },
      ];

      const laneMarkup = lanes
        .map((lane) => {
          const items = summary.filter((entry) => entry.choiceKey === lane.key);
          const cardsMarkup = items.length
            ? items
                .map(
                  (entry) => `
                    <button
                      class="feedback-board-card"
                      type="button"
                      data-jump-slide="${entry.slideIndex}"
                    >
                      <span class="feedback-board-card-category">${escapeHtml(entry.category)}</span>
                      <strong class="feedback-board-card-title">${escapeHtml(entry.title)}</strong>
                      <span class="feedback-board-card-copy">${escapeHtml(truncateText(entry.comment || entry.utility || entry.definition || "Awaiting note.", 104))}</span>
                    </button>
                  `,
                )
                .join("")
            : '<div class="feedback-board-empty">No features here yet.</div>';

          return `
            <section class="feedback-board-lane feedback-board-lane--${lane.key}">
              <header class="feedback-board-lane-header">
                <div>
                  <div class="feedback-board-lane-label">${escapeHtml(lane.label)}</div>
                  <div class="feedback-board-lane-description">${escapeHtml(lane.description)}</div>
                </div>
                <div class="feedback-board-lane-count">${items.length}</div>
              </header>
              <div class="feedback-board-lane-body">
                ${cardsMarkup}
              </div>
            </section>
          `;
        })
        .join("");

      boardContainers.forEach((container) => {
        container.innerHTML = laneMarkup;
      });
    }

    function renderFeedbackSummary() {
      const summary = buildFeedbackSummary();
      renderFeedbackStats(summary);
      renderFeedbackTable(summary);
      renderFeedbackBoard(summary);
    }

    function resetFeatureFeedback() {
      feedbackForms.forEach((form) => {
        form.reset();

        const featureKey = form.dataset.featureKey;
        if (!featureKey) {
          return;
        }

        feedbackState[featureKey] = {
          choice: getFormChoice(form),
          comment: getFormComment(form),
        };

        updateFeedbackFormStatus(form);
      });

      saveFeedbackState();
      renderFeedbackSummary();
    }

    applyTheme(getStoredTheme() || (themeQuery?.matches ? "dark" : "light"));
    slides[current]?.classList.add("active");
    loadFeedbackState();
    hydrateFeedbackForms();
    updateCounter();
    updateSidebar();
    updateHistoryBackButton();
    renderFeedbackSummary();

    feedbackForms.forEach((form) => {
      form.addEventListener("change", () => {
        syncFeedbackStateFromForm(form);
      });

      form.addEventListener("input", () => {
        syncFeedbackStateFromForm(form);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sidebarNav?.classList.contains("pinned")) {
        setSidebarPinned(false);
      }

      if (event.key === "Home") {
        goToSlide(0);
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        changeSlide(1);
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        changeSlide(-1);
      }
    });

    document.addEventListener("click", (event) => {
      const jumpTrigger = event.target.closest("[data-jump-slide]");
      if (jumpTrigger) {
        const slideIndex = parseInt(jumpTrigger.dataset.jumpSlide || "", 10);

        if (!Number.isNaN(slideIndex)) {
          goToSlide(slideIndex);
        }

        return;
      }

      if (!sidebarNav?.classList.contains("pinned")) {
        return;
      }

      if (!sidebarNav.contains(event.target)) {
        setSidebarPinned(false);
      }
    });

    window.addEventListener("beforeprint", () => {
      enterPdfExportMode();
    });

    window.addEventListener("afterprint", () => {
      exitPdfExportMode();
    });

    themeQuery?.addEventListener("change", (event) => {
      if (getStoredTheme()) {
        return;
      }

      applyTheme(event.matches ? "dark" : "light");
    });

    window.PresentationDeck = {
      changeSlide,
      exportPresentationToPDF,
      goBackInHistory,
      goToSlide,
      resetFeatureFeedback,
      toggleSidebarPin,
      toggleTheme,
    };

    window.changeSlide = changeSlide;
    window.exportPresentationToPDF = exportPresentationToPDF;
    window.goBackInHistory = goBackInHistory;
    window.goToSlide = goToSlide;
    window.resetFeatureFeedback = resetFeatureFeedback;
    window.toggleSidebarPin = toggleSidebarPin;
    window.toggleTheme = toggleTheme;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDeck, {
      once: true,
    });
  } else {
    initializeDeck();
  }
})();
