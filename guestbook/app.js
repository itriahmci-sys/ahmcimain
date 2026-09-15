(function () {
  const API_URL = window.APP_CONFIG.API_URL;
  const PAGE_SIZE = window.APP_CONFIG.PAGE_SIZE || 10;

  const form = document.getElementById('message-form');
  const nameInput = document.getElementById('name');
  const messageInput = document.getElementById('message');
  const websiteInput = form.querySelector('[name="website"]');
  const counter = document.getElementById('counter');
  const status = document.getElementById('form-status');
  const submitButton = document.getElementById('submit-button');
  const messageList = document.getElementById('message-list');
  const refreshButton = document.getElementById('refresh-button');
  const loadMoreButton = document.getElementById('load-more');

  let currentPage = 1;
  let isLoading = false;

  function getFingerprint() {
    try {
      let id = localStorage.getItem('gb_fingerprint');
      if (!id) {
        id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
        localStorage.setItem('gb_fingerprint', id);
      }
      return id;
    } catch (err) {
      return String(Date.now());
    }
  }

  function setStatus(text, state) {
    status.textContent = text;
    if (state) status.setAttribute('data-state', state);
    else status.removeAttribute('data-state');
  }

  function updateCounter() {
    counter.textContent = `${messageInput.value.length} / 500`;
  }

  function formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('zh-TW', {
      month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  function buildMessageItem(item) {
    const el = document.createElement('article');
    el.className = 'message-item';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = (item.name || '?').trim().slice(0, 1).toUpperCase();
    avatar.setAttribute('aria-hidden', 'true');

    const body = document.createElement('div');
    body.className = 'message-body';

    const header = document.createElement('div');
    header.className = 'message-header';

    const name = document.createElement('span');
    name.className = 'message-name';
    name.textContent = item.name;

    const date = document.createElement('span');
    date.className = 'message-date';
    date.textContent = formatDate(item.createdAt);

    header.append(name, date);

    const text = document.createElement('p');
    text.className = 'message-text';
    text.textContent = item.message;

    body.append(header, text);
    el.append(avatar, body);
    return el;
  }

  async function loadMessages(page, append) {
    if (isLoading) return;
    isLoading = true;
    loadMoreButton.disabled = true;

    if (!append) messageList.innerHTML = '<p class="empty">載入中…</p>';

    try {
      const res = await fetch(`${API_URL}?page=${page}&limit=${PAGE_SIZE}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (!append) messageList.innerHTML = '';

      if (data.items.length === 0 && !append) {
        messageList.innerHTML = '<p class="empty">還沒有留言，來寫下第一則吧！</p>';
      } else {
        const fragment = document.createDocumentFragment();
        data.items.forEach(item => fragment.appendChild(buildMessageItem(item)));
        messageList.appendChild(fragment);
      }

      currentPage = page;
      loadMoreButton.hidden = !data.hasMore;
    } catch (err) {
      if (!append) messageList.innerHTML = '<p class="empty">留言載入失敗，請稍後再試一次。</p>';
    } finally {
      isLoading = false;
      loadMoreButton.disabled = false;
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (websiteInput.value) return; // 蜜罐欄位被填寫，視為機器人，靜默略過

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    if (!name || !message) {
      setStatus('請填寫稱呼與留言內容。', 'error');
      return;
    }

    submitButton.disabled = true;
    setStatus('送出中…');

    try {
      const body = new URLSearchParams({
        name,
        message,
        website: websiteInput.value,
        fingerprint: getFingerprint()
      });
      const res = await fetch(API_URL, { method: 'POST', body });
      const data = await res.json();

      if (data.ok) {
        setStatus('留言送出成功，謝謝分享！', 'success');
        form.reset();
        updateCounter();
        await loadMessages(1, false);
      } else {
        setStatus(data.error || '送出失敗，請稍後再試。', 'error');
      }
    } catch (err) {
      setStatus('網路異常，請稍後再試。', 'error');
    } finally {
      submitButton.disabled = false;
    }
  });

  messageInput.addEventListener('input', updateCounter);
  refreshButton.addEventListener('click', () => loadMessages(1, false));
  loadMoreButton.addEventListener('click', () => loadMessages(currentPage + 1, true));

  updateCounter();
  loadMessages(1, false);
})();
