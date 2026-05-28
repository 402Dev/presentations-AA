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
    let scheduledLayoutFrame = 0;
    let shouldFitAllVisibleSlides = false;

    slides[slides.length - 1]?.classList.add("last-slide");

    slides.forEach((slide) => {
      const hasScaleFrame = Array.from(slide.children).some((child) =>
        child.classList?.contains("slide-scale-frame"),
      );

      if (hasScaleFrame) {
        return;
      }

      const frame = document.createElement("div");
      frame.className = "slide-scale-frame";

      while (slide.firstChild) {
        frame.appendChild(slide.firstChild);
      }

      slide.appendChild(frame);
    });

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
          applyResponsiveLayout({ fitAllVisibleSlides: true });

          window.requestAnimationFrame(() => {
            window.print();
          });
        });
      });
    }

    function fitDeckToViewport() {
      if (document.body.classList.contains("pdf-exporting")) {
        document.body.style.setProperty("--deck-scale", "1");
        return;
      }

      const bodyStyle = window.getComputedStyle(document.body);
      const availableWidth =
        window.innerWidth -
        parseFloat(bodyStyle.paddingLeft || "0") -
        parseFloat(bodyStyle.paddingRight || "0");
      const availableHeight =
        window.innerHeight -
        parseFloat(bodyStyle.paddingTop || "0") -
        parseFloat(bodyStyle.paddingBottom || "0");
      const nextScale = Math.min(
        1,
        availableWidth / 1280,
        availableHeight / 720,
      );
      const safeScale =
        Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1;

      document.body.style.setProperty("--deck-scale", safeScale.toFixed(4));
    }

    function fitSlideContent(slide) {
      if (!slide) {
        return;
      }

      const frame = Array.from(slide.children).find((child) =>
        child.classList?.contains("slide-scale-frame"),
      );

      if (!frame) {
        return;
      }

      slide.style.setProperty("--slide-content-scale", "1");

      const slideStyle = window.getComputedStyle(slide);
      const availableWidth =
        slide.clientWidth -
        parseFloat(slideStyle.paddingLeft || "0") -
        parseFloat(slideStyle.paddingRight || "0");
      const availableHeight =
        slide.clientHeight -
        parseFloat(slideStyle.paddingTop || "0") -
        parseFloat(slideStyle.paddingBottom || "0");
      let scale = 1;

      for (let iteration = 0; iteration < 4; iteration += 1) {
        slide.style.setProperty("--slide-content-scale", scale.toFixed(4));

        const rawWidth = Math.max(frame.scrollWidth, 1);
        const rawHeight = Math.max(frame.scrollHeight, 1);
        const nextScale = Math.min(
          1,
          availableWidth / rawWidth,
          availableHeight / rawHeight,
        );

        if (!Number.isFinite(nextScale) || nextScale <= 0) {
          scale = 1;
          break;
        }

        if (Math.abs(nextScale - scale) < 0.01) {
          scale = nextScale;
          break;
        }

        scale = nextScale;
      }

      const safeScale = Math.max(scale, 0.01);

      slide.style.setProperty("--slide-content-scale", safeScale.toFixed(4));
    }

    function fitActiveSlide() {
      fitSlideContent(slides[current]);
    }

    function fitVisibleSlides() {
      slides.forEach((slide) => {
        if (window.getComputedStyle(slide).display === "none") {
          return;
        }

        fitSlideContent(slide);
      });
    }

    function applyResponsiveLayout(options = {}) {
      const { fitAllVisibleSlides = false } = options;

      fitDeckToViewport();

      if (fitAllVisibleSlides) {
        fitVisibleSlides();
        return;
      }

      fitActiveSlide();
    }

    function scheduleResponsiveLayout(options = {}) {
      shouldFitAllVisibleSlides =
        shouldFitAllVisibleSlides || Boolean(options.fitAllVisibleSlides);

      if (scheduledLayoutFrame) {
        return;
      }

      scheduledLayoutFrame = window.requestAnimationFrame(() => {
        const fitAllVisibleSlides = shouldFitAllVisibleSlides;

        scheduledLayoutFrame = 0;
        shouldFitAllVisibleSlides = false;
        applyResponsiveLayout({ fitAllVisibleSlides });
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
        scheduleResponsiveLayout();
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
      scheduleResponsiveLayout();
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

    function getFeedbackCounts(summary) {
      return summary.reduce(
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
    }

    function getFeedbackPriority(entry) {
      const priorityMap = {
        "not-sure": 0,
        pending: 1,
        "not-useful": 2,
        valuable: 3,
      };
      const commentBonus = entry.comment ? -0.25 : 0;

      return (priorityMap[entry.choiceKey] ?? 4) + commentBonus;
    }

    function orderEntriesForReview(entries) {
      return [...entries].sort((left, right) => {
        const priorityDelta =
          getFeedbackPriority(left) - getFeedbackPriority(right);

        if (priorityDelta !== 0) {
          return priorityDelta;
        }

        return left.slideIndex - right.slideIndex;
      });
    }

    function groupSummaryByCategory(summary) {
      const groups = new Map();

      summary.forEach((entry) => {
        const existing = groups.get(entry.category) || {
          category: entry.category,
          entries: [],
          counts: {
            valuable: 0,
            "not-sure": 0,
            "not-useful": 0,
            pending: 0,
          },
        };

        existing.entries.push(entry);
        existing.counts[entry.choiceKey] += 1;
        groups.set(entry.category, existing);
      });

      return Array.from(groups.values());
    }

    function renderSummaryStatusChips(counts, options = {}) {
      const { hideZero = false } = options;
      const chipOrder = [
        { key: "valuable", label: "Valuable" },
        { key: "not-sure", label: "Not sure" },
        { key: "not-useful", label: "Not useful" },
        { key: "pending", label: "Pending" },
      ];

      return chipOrder
        .filter((chip) => !hideZero || counts[chip.key] > 0)
        .map(
          (chip) => `
            <span class="summary-status-chip summary-status-chip--${chip.key}">
              <span>${escapeHtml(chip.label)}</span>
              <strong class="summary-status-chip-value">${counts[chip.key]}</strong>
            </span>
          `,
        )
        .join("");
    }

    function buildReviewNarrative(summary, counts) {
      const total = summary.length;
      const reviewedCount = total - counts.pending;
      const actionQueue = counts.pending + counts["not-sure"];

      if (!reviewedCount) {
        return {
          headline: "Nothing has been decided yet.",
          copy: "This is still a first-pass review. Start with the next-decision queue and only leave notes where scope or payoff is unclear.",
        };
      }

      if (!counts.pending && !counts["not-sure"]) {
        return counts.valuable >= counts["not-useful"]
          ? {
              headline: "The feature set is close to a stable pass.",
              copy: "Most calls are explicit. Use the family map to check whether the surviving features still cluster in a way that makes architectural sense.",
            }
          : {
              headline: "The review has converged toward pruning.",
              copy: "Most calls are explicit. Use the family map to check whether the dropped layers expose a cleaner core feature set.",
            };
      }

      if (
        counts["not-sure"] >= Math.max(counts.valuable, counts["not-useful"])
      ) {
        return {
          headline: "Evidence is still the bottleneck.",
          copy: "The uncertainty lane is heavier than the committed calls. Tighten examples, query cases, or boundaries before locking the schema.",
        };
      }

      return {
        headline: `${reviewedCount} of ${total} features now have a call.`,
        copy: actionQueue
          ? `The remaining action queue is ${actionQueue}. Finish those unresolved features before treating the end-state as final.`
          : "The open queue is empty. Use the family map to inspect whether the final calls still distribute sensibly across the five feature families.",
      };
    }

    function renderFeedbackOverview(summary) {
      const overviewContainers = Array.from(
        document.querySelectorAll("[data-feedback-overview]"),
      );
      const categoryContainers = Array.from(
        document.querySelectorAll("[data-feedback-category-grid]"),
      );
      const priorityContainers = Array.from(
        document.querySelectorAll("[data-feedback-priority-list]"),
      );
      const noteContainers = Array.from(
        document.querySelectorAll("[data-feedback-comment-list]"),
      );

      if (
        !overviewContainers.length &&
        !categoryContainers.length &&
        !priorityContainers.length &&
        !noteContainers.length
      ) {
        return;
      }

      const counts = getFeedbackCounts(summary);
      const total = summary.length;
      const reviewedCount = total - counts.pending;
      const actionQueue = counts.pending + counts["not-sure"];
      const commentCount = summary.filter((entry) => entry.comment).length;
      const completion = total ? Math.round((reviewedCount / total) * 100) : 0;
      const narrative = buildReviewNarrative(summary, counts);
      const categoryGroups = groupSummaryByCategory(summary);
      const priorityItems = orderEntriesForReview(summary).slice(0, 3);
      const commentItems = orderEntriesForReview(
        summary.filter((entry) => entry.comment),
      ).slice(0, 3);

      const overviewMarkup = `
        <div class="summary-overview-content">
          <div class="summary-hero-grid">
            <div class="summary-hero-card">
              <div class="summary-hero-label">Reviewed</div>
              <div class="summary-hero-value">${reviewedCount}<span> / ${total}</span></div>
              <div class="summary-hero-copy">${completion}% with an explicit call.</div>
            </div>
            <div class="summary-hero-card">
              <div class="summary-hero-label">Action queue</div>
              <div class="summary-hero-value">${actionQueue}</div>
              <div class="summary-hero-copy">Pending and not-sure features left.</div>
            </div>
            <div class="summary-hero-card">
              <div class="summary-hero-label">Captured notes</div>
              <div class="summary-hero-value">${commentCount}</div>
              <div class="summary-hero-copy">Form comments already stored.</div>
            </div>
          </div>
          <div class="summary-narrative">
            <div class="summary-narrative-title">${escapeHtml(narrative.headline)}</div>
            <div class="summary-narrative-copy">${escapeHtml(narrative.copy)}</div>
          </div>
          <div class="summary-progress-track">
            <span class="summary-progress-fill" style="width: ${completion}%"></span>
          </div>
          <div class="summary-progress-caption">Completion is measured as every feature with a non-pending decision.</div>
        </div>
      `;

      const categoryMarkup = categoryGroups
        .map((group) => {
          const reviewed = group.entries.length - group.counts.pending;
          const reviewedPercent = group.entries.length
            ? Math.round((reviewed / group.entries.length) * 100)
            : 0;
          const nextEntry = orderEntriesForReview(group.entries)[0];
          const wrapperTag = nextEntry ? "button" : "div";
          const wrapperAttributes = nextEntry
            ? `type="button" data-jump-slide="${nextEntry.slideIndex}"`
            : "";

          return `
            <${wrapperTag} class="summary-category-row" ${wrapperAttributes}>
              <div class="summary-category-head">
                <div>
                  <div class="summary-category-title">${escapeHtml(group.category)}</div>
                  <div class="summary-category-meta">${reviewed}/${group.entries.length} reviewed</div>
                </div>
                <div class="summary-category-count">${group.entries.length}</div>
              </div>
              <div class="summary-category-meter">
                <span class="summary-category-meter-fill" style="width: ${reviewedPercent}%"></span>
              </div>
            </${wrapperTag}>
          `;
        })
        .join("");

      const priorityMarkup = priorityItems.length
        ? priorityItems
            .map(
              (entry) => `
                <button
                  class="summary-priority-item"
                  type="button"
                  data-jump-slide="${entry.slideIndex}"
                >
                  <span class="summary-priority-tag summary-priority-tag--${entry.choiceKey}">
                    ${escapeHtml(entry.choiceLabel)}
                  </span>
                  <span class="summary-priority-main">
                    <span class="summary-priority-title">${escapeHtml(entry.title)}</span>
                    <span class="summary-priority-meta">${escapeHtml(entry.category)} · ${escapeHtml(
                      truncateText(
                        entry.comment ||
                          entry.utility ||
                          entry.definition ||
                          "Awaiting note.",
                        74,
                      ),
                    )}</span>
                  </span>
                </button>
              `,
            )
            .join("")
        : '<div class="summary-empty-panel">No feature entries are available yet.</div>';

      const noteMarkup = commentItems.length
        ? commentItems
            .map(
              (entry) => `
                <article class="summary-note-card">
                  <div class="summary-note-head">
                    <div>
                      <div class="summary-note-title">${escapeHtml(entry.title)}</div>
                      <div class="summary-note-foot">${escapeHtml(entry.category)} · ${escapeHtml(entry.choiceLabel)}</div>
                    </div>
                    <button
                      class="feedback-jump-btn"
                      type="button"
                      data-jump-slide="${entry.slideIndex}"
                    >
                      Review
                    </button>
                  </div>
                  <div class="summary-note-copy">${escapeHtml(truncateText(entry.comment, 170))}</div>
                </article>
              `,
            )
            .join("")
        : '<div class="summary-empty-panel">No comments yet. Once reviewers leave notes, the strongest signals will surface here.</div>';

      overviewContainers.forEach((container) => {
        container.innerHTML = overviewMarkup;
      });

      categoryContainers.forEach((container) => {
        container.innerHTML = categoryMarkup;
      });

      priorityContainers.forEach((container) => {
        container.innerHTML = priorityMarkup;
      });

      noteContainers.forEach((container) => {
        container.innerHTML = noteMarkup;
      });
    }

    function renderFeedbackFamilyBoard(summary) {
      const familyBoards = Array.from(
        document.querySelectorAll("[data-feedback-family-board]"),
      );

      if (!familyBoards.length) {
        return;
      }

      const categoryGroups = groupSummaryByCategory(summary);
      const cardsMarkup = categoryGroups
        .map((group) => {
          const reviewed = group.entries.length - group.counts.pending;
          const reviewedPercent = group.entries.length
            ? Math.round((reviewed / group.entries.length) * 100)
            : 0;
          const focusEntry = orderEntriesForReview(group.entries)[0];
          let focusMeta = "Open review slide";

          if (focusEntry?.choiceKey === "pending") {
            focusMeta = "Next unresolved";
          } else if (focusEntry?.choiceKey === "not-sure") {
            focusMeta = "Needs evidence";
          } else if (focusEntry?.choiceKey === "not-useful") {
            focusMeta = "Likely drop or reframe";
          } else if (focusEntry?.choiceKey === "valuable") {
            focusMeta = "Current strongest keep";
          }

          const previewMarkup = focusEntry
            ? `
                <button
                  class="summary-family-feature"
                  type="button"
                  data-jump-slide="${focusEntry.slideIndex}"
                >
                  <span class="summary-family-feature-title">${escapeHtml(focusEntry.title)}</span>
                  <span class="summary-family-feature-meta">${escapeHtml(focusMeta)}</span>
                </button>
              `
            : '<div class="summary-empty-panel">No features in this family yet.</div>';

          return `
            <section class="summary-family-card">
              <div class="summary-family-header">
                <div>
                  <div class="summary-family-title">${escapeHtml(group.category)}</div>
                  <div class="summary-family-meta">${reviewed}/${group.entries.length} reviewed</div>
                </div>
                <div class="summary-family-count">${group.entries.length}</div>
              </div>
              <div class="summary-family-progress">
                <span class="summary-family-progress-fill" style="width: ${reviewedPercent}%"></span>
              </div>
              <div class="summary-status-chip-row">${renderSummaryStatusChips(group.counts, { hideZero: true })}</div>
              <div class="summary-family-feature-list">
                ${previewMarkup}
              </div>
            </section>
          `;
        })
        .join("");

      familyBoards.forEach((container) => {
        container.innerHTML = cardsMarkup;
      });
    }

    function renderFeedbackStats(summary) {
      const statContainers = Array.from(
        document.querySelectorAll("[data-feedback-stats]"),
      );

      if (!statContainers.length) {
        return;
      }

      const counts = getFeedbackCounts(summary);

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
      renderFeedbackOverview(summary);
      renderFeedbackTable(summary);
      renderFeedbackBoard(summary);
      renderFeedbackFamilyBoard(summary);
      scheduleResponsiveLayout();
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
    scheduleResponsiveLayout();

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
      window.requestAnimationFrame(() => {
        applyResponsiveLayout({ fitAllVisibleSlides: true });
      });
    });

    window.addEventListener("afterprint", () => {
      exitPdfExportMode();
      scheduleResponsiveLayout();
    });

    window.addEventListener("resize", () => {
      scheduleResponsiveLayout({
        fitAllVisibleSlides: document.body.classList.contains("pdf-exporting"),
      });
    });

    window.addEventListener("load", () => {
      scheduleResponsiveLayout();
    });

    document.fonts?.ready
      ?.then(() => {
        scheduleResponsiveLayout({
          fitAllVisibleSlides:
            document.body.classList.contains("pdf-exporting"),
        });
      })
      .catch(() => {
        return;
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
