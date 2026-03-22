(function () {
  const postList = document.getElementById("postsPostList");
  const pagination = document.getElementById("postsPagination");
  const tagFilter = document.getElementById("postsTagFilter");
  const searchInput = document.getElementById("postsSearchInput");
  const sortSelect = document.getElementById("postsSortSelect");
  const stats = document.getElementById("postsStats");
  const emptyState = document.getElementById("postsEmptyState");

  const hasPostsUI = !!(
    postList &&
    pagination &&
    tagFilter &&
    searchInput &&
    sortSelect &&
    stats &&
    emptyState
  );

  const posts = Array.isArray(window.homePostsData) ? window.homePostsData : [];
  let filteredPosts = [];
  let currentTag = "All";
  let currentQuery = "";
  let currentSort = "newest";
  let currentPage = 1;
  let searchIndex = null;
  const perPage = 5;

  function parseDate(value) {
    const ts = Date.parse(value || "");
    return Number.isNaN(ts) ? 0 : ts;
  }

  function comparePosts(a, b) {
    return currentSort === "oldest"
      ? parseDate(a.date) - parseDate(b.date)
      : parseDate(b.date) - parseDate(a.date);
  }

  function updateMastheadActiveByHash(currentHash) {
    document.querySelectorAll(".masthead .nav-active").forEach((el) => {
      el.classList.remove("nav-active");
    });

    if (!currentHash) {
      return;
    }

    document.querySelectorAll(".masthead a[href]").forEach((link) => {
      const hash = extractLocalHash(link.getAttribute("href"));
      if (hash !== currentHash) {
        return;
      }
      link.classList.add("nav-active");
      const item = link.closest(".masthead__menu-item");
      if (item) {
        item.classList.add("nav-active");
      }
    });
  }

  function syncViewWithHash() {
    const hash = window.location.hash;
    const isPostsView = hash === "#posts";
    document.body.classList.toggle("posts-view", isPostsView);
    updateMastheadActiveByHash(hash);

    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }

    // Recompute sticky/sidebar third-party widgets after view toggle.
    window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 0);
  }

  function extractLocalHash(href) {
    if (!href) {
      return "";
    }
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin || !url.hash) {
        return "";
      }
      const isHomePath = url.pathname === "/" || url.pathname === "/index.html";
      const isCurrentPath = url.pathname === window.location.pathname;
      if (!isHomePath && !isCurrentPath) {
        return "";
      }
      return url.hash;
    } catch (err) {
      return "";
    }
  }

  function bindMastheadHashSwitch() {
    document.addEventListener(
      "click",
      (event) => {
        const origin = event.target && event.target.nodeType === 1
          ? event.target
          : event.target && event.target.parentElement
            ? event.target.parentElement
            : null;
        if (!origin || !origin.closest) {
          return;
        }
        const link = origin.closest(".masthead a[href]");
        if (!link) {
          return;
        }
        const hash = extractLocalHash(link.getAttribute("href"));
        if (!hash) {
          // Any non-hash masthead navigation should leave posts view.
          document.body.classList.remove("posts-view");
          updateMastheadActiveByHash("");
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        history.pushState(null, "", hash);
        syncViewWithHash();
      },
      true
    );
  }

  function bindInlinePostsLink() {
    document.addEventListener(
      "click",
      (event) => {
        const origin = event.target && event.target.nodeType === 1
          ? event.target
          : event.target && event.target.parentElement
            ? event.target.parentElement
            : null;
        if (!origin || !origin.closest) {
          return;
        }
        const link = origin.closest("a.js-inline-posts-link[href]");
        if (!link) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        history.pushState(null, "", "#posts");
        syncViewWithHash();
      },
      true
    );
  }

  function renderTags() {
    if (!hasPostsUI) {
      return;
    }
    const tags = new Set();
    posts.forEach((post) => (post.tags || []).forEach((tag) => tags.add(tag)));

    tagFilter.innerHTML = "";

    const all = document.createElement("span");
    all.textContent = "All";
    all.onclick = () => {
      currentTag = "All";
      renderTags();
      applyFiltersAndRender(1);
    };
    if (currentTag === "All") {
      all.classList.add("active");
    }
    tagFilter.appendChild(all);

    [...tags].sort().forEach((tag) => {
      const el = document.createElement("span");
      el.textContent = tag;
      el.onclick = () => {
        currentTag = tag;
        renderTags();
        applyFiltersAndRender(1);
      };
      if (currentTag === tag) {
        el.classList.add("active");
      }
      tagFilter.appendChild(el);
    });
  }

  function renderPage(page) {
    if (!hasPostsUI) {
      return;
    }
    currentPage = page;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pagePosts = filteredPosts.slice(start, end);

    postList.innerHTML = pagePosts.map((post) => `
      <div class="posts-post-item">
        <a class="posts-post-title" href="${post.url}">${post.title}</a>
        <div class="posts-post-meta">
          <span class="posts-post-date">${post.date}</span>
          <span class="posts-post-tags">
            ${(post.tags || []).map((t) => `<span>${t}</span>`).join(" ")}
          </span>
        </div>
        <div class="posts-post-excerpt">${post.excerpt}</div>
      </div>
    `).join("");

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / perPage));
    renderPaginationBar(pagination, totalPages);
  }

  function renderPaginationBar(container, totalPages) {
    container.innerHTML = "";
    container.style.display = "flex";

    if (totalPages > 1) {
      const prev = document.createElement("button");
      prev.textContent = "Prev";
      prev.disabled = currentPage <= 1;
      prev.onclick = () => renderPage(currentPage - 1);
      container.appendChild(prev);
    }

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.disabled = i === currentPage;
      btn.onclick = () => renderPage(i);
      container.appendChild(btn);
    }

    if (totalPages > 1) {
      const next = document.createElement("button");
      next.textContent = "Next";
      next.disabled = currentPage >= totalPages;
      next.onclick = () => renderPage(currentPage + 1);
      container.appendChild(next);
    }
  }

  function updateStats() {
    if (!hasPostsUI) {
      return;
    }
    const total = posts.length;
    const filtered = filteredPosts.length;
    const totalPages = Math.max(1, Math.ceil(filtered / perPage));
    const sortLabel = currentSort === "oldest" ? "Oldest" : "Newest";
    const parts = [`${filtered} of ${total} posts`, `${totalPages} page${totalPages > 1 ? "s" : ""}`, `${sortLabel} first`];

    if (currentTag !== "All") {
      parts.push(currentTag);
    }

    if (currentQuery) {
      parts.push(`"${currentQuery}"`);
    }

    stats.textContent = parts.join(" · ");
  }

  function applyFiltersAndRender(page) {
    if (!hasPostsUI) {
      return;
    }
    let result = posts.slice();

    if (currentTag !== "All") {
      result = result.filter((p) => (p.tags || []).includes(currentTag));
    }

    if (currentQuery) {
      if (searchIndex) {
        const results = searchIndex.search(currentQuery);
        const urls = new Set(results.map((r) => r.ref));
        result = result.filter((p) => urls.has(p.url));
      } else {
        const q = currentQuery.toLowerCase();
        result = result.filter((p) => {
          const title = (p.title || "").toLowerCase();
          const content = (p.content || "").toLowerCase();
          return title.includes(q) || content.includes(q);
        });
      }
    }

    filteredPosts = result.sort(comparePosts);
    updateStats();
    emptyState.style.display = filteredPosts.length === 0 ? "block" : "none";
    renderPage(page);
  }

  function setupSearch() {
    if (!hasPostsUI) {
      return;
    }
    if (typeof lunr !== "undefined") {
      searchIndex = lunr(function () {
        this.ref("url");
        this.field("title");
        this.field("content");
        posts.forEach((post) => this.add(post));
      });
    }

    searchInput.addEventListener("input", (e) => {
      currentQuery = e.target.value.trim();
      applyFiltersAndRender(1);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        currentQuery = "";
        searchInput.value = "";
        applyFiltersAndRender(1);
      }
    });
  }

  function setupSort() {
    if (!hasPostsUI) {
      return;
    }
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value === "oldest" ? "oldest" : "newest";
      applyFiltersAndRender(1);
    });
  }

  window.addEventListener("hashchange", syncViewWithHash);
  window.addEventListener("popstate", syncViewWithHash);
  window.addEventListener("pageshow", () => {
    syncViewWithHash();
  });

  bindMastheadHashSwitch();
  bindInlinePostsLink();
  syncViewWithHash();
  if (hasPostsUI) {
    renderTags();
    setupSearch();
    setupSort();
    applyFiltersAndRender(1);
  }
})();
