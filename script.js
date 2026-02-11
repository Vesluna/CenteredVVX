const aiList = document.getElementById('ai-list');
const musicList = document.getElementById('music-list');
const errorOverlay = document.getElementById('error-overlay');
const backHomeButton = document.getElementById('back-home');

const ERROR_HASH = '#ERROR - 001';
const HOME_HASH = '#dashboard';

const AI_TOOLS = [
  {
    name: "Centered's built in AI",
    tags: ['AI'],
    status: 'unfinished'
  },
  {
    name: 'GPT',
    url: 'https://chatgpt.com',
    tags: ['AI']
  },
  {
    name: 'GROK',
    url: 'https://grok.com',
    tags: ['AI']
  },
  {
    name: 'Replit',
    url: 'https://replit.com',
    tags: ['AI', 'Blocked By School District']
  }
];

const MUSIC_TOOLS = [
  { name: 'JummBox', url: 'https://jummb.us' },
  { name: 'BeepBox', url: 'https://www.beepbox.co' },
  { name: 'TwistedWaveAudioEditor', url: 'https://twistedwave.com/online' },
  { name: 'AudioJoiner', url: 'https://audio-joiner.com' }
];

function makeTag(tag) {
  const span = document.createElement('span');
  span.className = `tag${tag === 'Blocked By School District' ? ' warn' : ''}`;
  span.textContent = tag;
  return span;
}

function makeToolCard(tool, sectionTag) {
  const card = document.createElement('article');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = tool.name;
  card.appendChild(title);

  const tagRow = document.createElement('div');
  tagRow.className = 'tag-row';
  const tags = tool.tags ? [...tool.tags] : [sectionTag];
  for (const tag of tags) {
    tagRow.appendChild(makeTag(tag));
  }
  card.appendChild(tagRow);

  if (tool.status === 'unfinished') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'card-btn';
    button.textContent = 'Coming Soon';
    button.addEventListener('click', () => {
      window.location.hash = ERROR_HASH;
    });
    card.appendChild(button);
    return card;
  }

  const link = document.createElement('a');
  link.className = 'card-link';
  link.href = tool.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Open';
  card.appendChild(link);

  return card;
}

function renderSection(container, tools, sectionTag) {
  container.textContent = '';
  for (const tool of tools) {
    if (!tool.name) {
      continue;
    }
    container.appendChild(makeToolCard(tool, sectionTag));
  }
}

function showError(show) {
  errorOverlay.classList.toggle('hidden', !show);
}

function applyRoute() {
  const route = decodeURIComponent(window.location.hash.replace('#', '')).trim().toLowerCase();

  if (!route || route === 'dashboard') {
    showError(false);
    if (window.location.hash && window.location.hash !== HOME_HASH) {
      window.location.hash = HOME_HASH;
    }
    return;
  }

  showError(true);
  if (window.location.hash !== ERROR_HASH) {
    window.location.hash = ERROR_HASH;
  }
}

backHomeButton.addEventListener('click', () => {
  window.location.hash = HOME_HASH;
});

window.addEventListener('hashchange', applyRoute);

renderSection(aiList, AI_TOOLS, 'AI');
renderSection(musicList, MUSIC_TOOLS, 'Music');
applyRoute();
