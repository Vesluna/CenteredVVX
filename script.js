(() => {
  const links = [
    {
      title: 'Time Tracker',
      url: 'https://example.com/time-tracker',
      category: 'tools',
      tags: ['productivity', 'timers'],
      notes: 'Track focused sessions and review your weekly productivity snapshots.',
    },
    {
      title: 'Notes Hub',
      url: 'https://example.com/notes-hub',
      category: 'tools',
      tags: ['notes', 'knowledge-base'],
      notes: 'Capture quick ideas and organize them into searchable knowledge collections.',
    },
    {
      title: 'Project Atlas',
      url: 'https://example.com/atlas',
      category: 'projects',
      tags: ['planning', 'collaboration'],
      notes: 'A collaborative planning board for mapping milestones and deliverables.',
    },
    {
      title: 'Digital Garden',
      url: 'https://example.com/garden',
      category: 'projects',
      tags: ['writing', 'experiments'],
      notes: 'A living archive of experiments, reflections, and ongoing personal work.',
    },
    {
      title: 'Prompt Lab',
      url: 'https://example.com/prompt-lab',
      category: 'ai',
      tags: ['prompting', 'evaluation'],
      notes: 'Test prompt templates and compare generated responses across models.',
    },
    {
      title: 'Model Notes',
      url: 'https://example.com/model-notes',
      category: 'ai',
      tags: ['benchmarks', 'workflow'],
      notes: 'Store concise findings from AI evaluations, workflows, and benchmarks.',
    },
    {
      title: 'Podcast Playlist',
      url: 'https://example.com/podcast-playlist',
      category: 'media-audio',
      tags: ['audio', 'learning'],
      notes: 'Browse episodes curated for focus, learning, and creative inspiration.',
    },
    {
      title: 'Sound Library',
      url: 'https://example.com/sound-library',
      category: 'media-audio',
      tags: ['audio', 'assets'],
      notes: 'Access ambient loops and royalty-free audio assets for your projects.',
    },
    {
      title: 'Malformed example',
      category: 'tools',
      tags: ['invalid'],
      notes: 'Missing URL and skipped by defensive checks.',
    },
  ];

  const selectors = {
    searchInput: '#resource-search-input',
    form: '#resource-filter-form',
    categoryControls: '#category-filter-controls',
    utilitySection: '#utility-categories',
  };

  const searchInput = document.querySelector(selectors.searchInput);
  const filterForm = document.querySelector(selectors.form);
  const categoryControls = document.querySelector(selectors.categoryControls);
  const utilitySection = document.querySelector(selectors.utilitySection);

  if (!searchInput || !filterForm || !categoryControls || !utilitySection) {
    return;
  }

  const sectionNodes = Array.from(
    utilitySection.querySelectorAll('.category-section'),
  ).reduce((accumulator, section) => {
    const sectionId = section.getAttribute('id');
    const list = section.querySelector('.link-card-list');

    if (!sectionId || !list) {
      return accumulator;
    }

    accumulator[sectionId] = { section, list };
    return accumulator;
  }, {});

  const isValidLink = (item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }

    return Boolean(item.title && item.url && item.category);
  };

  const validLinks = links.filter(isValidLink);

  const allTags = [...new Set(validLinks.flatMap((item) => item.tags || []))].sort();

  const tagControls = document.createElement('fieldset');
  tagControls.className = 'category-filters';
  tagControls.id = 'tag-filter-controls';
  tagControls.setAttribute('aria-label', 'Filter by tag');

  const tagLegend = document.createElement('legend');
  tagLegend.textContent = 'Filter by tag';
  tagControls.appendChild(tagLegend);

  allTags.forEach((tag) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    checkbox.name = 'tag';
    checkbox.value = tag;

    label.append(checkbox, document.createTextNode(tag));
    tagControls.appendChild(label);
  });

  categoryControls.insertAdjacentElement('afterend', tagControls);

  const state = {
    query: '',
    activeCategories: new Set(
      Array.from(categoryControls.querySelectorAll('input[name="category"]:checked')).map(
        (input) => input.value,
      ),
    ),
    activeTags: new Set(),
  };

  const setStateFromForm = () => {
    state.query = searchInput.value.trim().toLowerCase();

    state.activeCategories = new Set(
      Array.from(categoryControls.querySelectorAll('input[name="category"]:checked')).map(
        (input) => input.value,
      ),
    );

    state.activeTags = new Set(
      Array.from(tagControls.querySelectorAll('input[name="tag"]:checked')).map(
        (input) => input.value,
      ),
    );
  };

  const renderCategory = (categoryId, items) => {
    const target = sectionNodes[categoryId];
    if (!target) {
      return;
    }

    target.list.replaceChildren();

    if (items.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'link-card';
      emptyItem.textContent = 'No matching resources.';
      target.list.appendChild(emptyItem);
      return;
    }

    items.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.className = 'link-card';

      const link = document.createElement('a');
      link.textContent = item.title;
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const description = document.createElement('p');
      description.textContent = item.notes || 'No description provided.';

      listItem.append(link, description);
      target.list.appendChild(listItem);
    });
  };

  const applyFilters = () => {
    const filtered = validLinks.filter((item) => {
      const itemTags = item.tags || [];
      const searchableText = `${item.title} ${item.notes || ''} ${itemTags.join(' ')}`.toLowerCase();

      const matchesQuery = state.query.length === 0 || searchableText.includes(state.query);
      const matchesCategory = state.activeCategories.size === 0 || state.activeCategories.has(item.category);
      const matchesTags =
        state.activeTags.size === 0 || Array.from(state.activeTags).every((tag) => itemTags.includes(tag));

      return matchesQuery && matchesCategory && matchesTags;
    });

    Object.keys(sectionNodes).forEach((categoryId) => {
      renderCategory(
        categoryId,
        filtered.filter((item) => item.category === categoryId),
      );
    });
  };

  searchInput.addEventListener('input', () => {
    setStateFromForm();
    applyFilters();
  });

  filterForm.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (target.name !== 'category' && target.name !== 'tag') {
      return;
    }

    setStateFromForm();
    applyFilters();
  });

  filterForm.addEventListener('reset', () => {
    window.requestAnimationFrame(() => {
      setStateFromForm();
      applyFilters();
    });
  });

  setStateFromForm();
  applyFilters();
})();
