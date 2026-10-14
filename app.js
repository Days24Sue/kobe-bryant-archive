(() => {
  const records = Array.isArray(window.ARCHIVE_RECORDS) ? window.ARCHIVE_RECORDS : [];
  const grid = document.getElementById("record-grid");
  const search = document.getElementById("archive-search");
  const resultCount = document.getElementById("result-count");
  const countAll = document.getElementById("count-all");
  const loadMore = document.getElementById("load-more");
  const emptyState = document.getElementById("empty-state");
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const pageSize = 9;
  let activeFilter = "all";
  let visibleCount = pageSize;

  records.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  countAll.textContent = records.length;

  function matches(record, query) {
    if (activeFilter === "video_interviews") {
      if (record.category !== "interviews" || !record.format.includes("video")) return false;
    } else if (activeFilter !== "all" && record.category !== activeFilter) return false;
    if (!query) return true;
    return [record.title, record.date, record.source, record.description, record.format]
      .join(" ")
      .toLocaleLowerCase()
      .includes(query);
  }

  function textElement(tag, className, value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    return element;
  }

  function createCard(record) {
    const card = document.createElement("a");
    card.className = "record-card";
    card.href = record.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", `${record.title}，在 ${record.source} 查看来源`);

    const meta = textElement("div", "record-meta", "");
    const categoryLabel = record.category === "interviews" && record.format.includes("video")
      ? "视频采访"
      : record.categoryLabel;
    meta.append(textElement("span", "", `${categoryLabel} / ${record.id}`));
    meta.append(textElement("span", "", record.date));
    card.append(meta);
    card.append(textElement("h3", "", record.title));
    card.append(textElement("p", "", record.description));

    const footer = textElement("div", "record-footer", "");
    footer.append(textElement("span", "", record.source));
    footer.append(textElement("span", "", "↗"));
    card.append(footer);
    return card;
  }

  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    const matchesList = records.filter((record) => matches(record, query));
    const fragment = document.createDocumentFragment();
    for (const record of matchesList.slice(0, visibleCount)) {
      fragment.append(createCard(record));
    }
    grid.replaceChildren(fragment);
    resultCount.textContent = `找到 ${matchesList.length} 条记录`;
    emptyState.hidden = matchesList.length !== 0;
    loadMore.hidden = visibleCount >= matchesList.length;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      visibleCount = pageSize;
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      render();
    });
  });

  search.addEventListener("input", () => {
    visibleCount = pageSize;
    render();
  });
  loadMore.addEventListener("click", () => {
    visibleCount += pageSize;
    render();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== search && !event.metaKey && !event.ctrlKey) {
      event.preventDefault();
      search.focus();
    }
  });

  render();
})();
