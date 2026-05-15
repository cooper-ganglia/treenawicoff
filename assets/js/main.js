// ─── CONFIG: Update these values ───────────────────────────────────────────
const CONFIG = {
  youtubeChannel: 'UCsH0kXDNs6yoBXWDAMR_aww',

  // Add a YouTube Data API v3 key to load live uploads.
  youtubeApiKey: 'YOUR_API_KEY',

  links: {
    website:    'https://www.treenawicoff.com/',
    listen:     'https://www.treenawicoff.com/monthly-devotional',
    book:       'https://calendly.com/treenawicoff',
    youtube:    'https://www.youtube.com/channel/UCsH0kXDNs6yoBXWDAMR_aww/videos',
    facebook:   'https://www.facebook.com/Treena-Wicoff-Music-Artistsongwriterspeaker-originator-of-Treengles-1606254046363572',
    soundcloud: 'https://soundcloud.com/treenawicoff',
  }
};
// ────────────────────────────────────────────────────────────────────────────

// Apply all links from CONFIG
function applyLinks() {
  const map = {
    'yt-link': CONFIG.links.youtube,
    'fb-link': CONFIG.links.facebook,
    'ig-link': CONFIG.links.instagram,
    'tt-link': CONFIG.links.tiktok,
    'yt-channel-link': CONFIG.links.youtube,
    'yt-platform-link': CONFIG.links.youtube,
    'fb-platform-link': CONFIG.links.facebook,
    'ig-platform-link': CONFIG.links.website,
    'tt-platform-link': CONFIG.links.book,
    'spotify-link': CONFIG.links.soundcloud,
    'apple-link': CONFIG.links.listen,
    'yt-footer': CONFIG.links.youtube,
    'fb-footer': CONFIG.links.facebook,
    'ig-footer': CONFIG.links.website,
    'tt-footer': CONFIG.links.book,
    'spotify-footer': CONFIG.links.soundcloud,
    'apple-footer': CONFIG.links.listen,
  };
  Object.entries(map).forEach(([id, href]) => {
    const el = document.getElementById(id);
    if (el) el.href = href;
  });
}

// ─── YouTube Video Feed ────────────────────────────────────────────────────
async function loadYouTubeVideos() {
  const grid = document.getElementById('videoGrid');

  if (CONFIG.youtubeApiKey === 'YOUR_API_KEY') {
    grid.innerHTML = renderPlaceholderCards();
    return;
  }

  try {
    // Step 1: get channel ID from handle
    let channelId = CONFIG.youtubeChannel;
    if (!channelId.startsWith('UC')) {
      const resp = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${channelId}&key=${CONFIG.youtubeApiKey}`
      );
      const data = await resp.json();
      channelId = data.items?.[0]?.id;
      if (!channelId) throw new Error('Channel not found');
    }

    // Step 2: get uploads playlist ID
    const chanResp = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${CONFIG.youtubeApiKey}`
    );
    const chanData = await chanResp.json();
    const uploadsId = chanData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId) throw new Error('Uploads playlist not found');

    // Step 3: get latest videos
    const vidResp = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId=${uploadsId}&key=${CONFIG.youtubeApiKey}`
    );
    const vidData = await vidResp.json();
    const videos = vidData.items;

    if (!videos || videos.length === 0) {
      grid.innerHTML = '<div class="yt-loading">No episodes found yet.</div>';
      return;
    }

    grid.innerHTML = videos.map(v => {
      const s = v.snippet;
      const videoId = s.resourceId.videoId;
      const thumb = s.thumbnails?.high?.url || s.thumbnails?.medium?.url || '';
      const date = new Date(s.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return `
        <div class="video-card" onclick="window.open('https://youtube.com/watch?v=${videoId}','_blank')">
          <div class="video-thumb">
            <img src="${thumb}" alt="${s.title}" loading="lazy">
            <div class="play-btn"><div class="play-btn-circle"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div></div>
          </div>
          <div class="video-info">
            <div class="video-tag">Episode</div>
            <h4>${s.title}</h4>
            <div class="video-date">${date}</div>
          </div>
        </div>`;
    }).join('');

  } catch (e) {
    console.warn('YouTube API error:', e);
    grid.innerHTML = renderPlaceholderCards();
  }
}

function renderPlaceholderCards() {
  const placeholders = [
    { title: 'Finding Peace in the Storm', tag: 'Episode 12' },
    { title: 'When God Feels Far Away', tag: 'Episode 11' },
    { title: 'The Song That Changed Everything', tag: 'Episode 10' },
    { title: 'Rebuilding Hope After Loss', tag: 'Episode 9' },
    { title: 'Daily Devotionals That Stick', tag: 'Episode 8' },
    { title: 'You Are Never Alone', tag: 'Episode 7' },
  ];
  return placeholders.map((p, i) => `
    <div class="video-card" onclick="window.open('${CONFIG.links.youtube}','_blank')">
      <div class="video-thumb" style="background: linear-gradient(135deg, hsl(${20+i*12},35%,72%) 0%, hsl(${30+i*10},30%,60%) 100%);">
        <div class="play-btn" style="opacity:1"><div class="play-btn-circle"><svg viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div></div>
      </div>
      <div class="video-info">
        <div class="video-tag">${p.tag}</div>
        <h4>${p.title}</h4>
        <div class="video-date">Featured devotional theme</div>
      </div>
    </div>`).join('');
}

// ─── Nav scroll effect ────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 40);
});

// ─── Mobile nav ───────────────────────────────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// ─── Scroll reveal ────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── Forms ────────────────────────────────────────────────────────────────
function handleForm(formId, successId) {
  document.getElementById(formId).addEventListener('submit', function(e) {
    e.preventDefault();
    const fields = [...this.querySelectorAll('input, select, textarea')].map((field) => {
      const label = field.closest('.form-group')?.querySelector('label')?.textContent?.replace('*', '').trim() || 'Message';
      return `${label}: ${field.value || 'Not provided'}`;
    }).join('\n');
    const subject = formId === 'sponsorForm' ? 'Sponsorship inquiry for Treena Wicoff' : 'Message for Treena Wicoff';
    const mailto = `mailto:treena@treenawicoff.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fields)}`;
    window.location.href = mailto;
    this.style.display = 'none';
    document.getElementById(successId).style.display = 'block';
  });
}
handleForm('listenerForm', 'listenerSuccess');
handleForm('sponsorForm', 'sponsorSuccess');

// ─── Init ─────────────────────────────────────────────────────────────────
applyLinks();
loadYouTubeVideos();
