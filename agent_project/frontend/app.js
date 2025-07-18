const ws = new WebSocket(`ws://${window.location.host}/ws`);
const messages = document.getElementById('messages');
const input = document.getElementById('input');
const send = document.getElementById('send');

function addBubble(text, sender) {
  const div = document.createElement('div');
  div.className = `bubble ${sender}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function addScreenshotBubble(src, caption) {
  const div = document.createElement('div');
  div.className = 'screenshot-bubble agent';
  const img = document.createElement('img');
  img.className = 'screenshot-thumb';
  img.src = src + '?' + Date.now();
  img.alt = caption || 'Screenshot';
  const ts = document.createElement('div');
  ts.className = 'timestamp';
  ts.textContent = new Date().toLocaleString();
  if (caption) {
    const cap = document.createElement('div');
    cap.textContent = caption;
    cap.style.marginBottom = '4px';
    div.appendChild(cap);
  }
  div.appendChild(img);
  div.appendChild(ts);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

send.onclick = () => {
  const value = input.value.trim();
  if (value) {
    addBubble(value, 'user');
    ws.send(value);
    input.value = '';
  }
};
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') send.onclick();
});

ws.onmessage = (event) => {
  let data;
  try {
    data = JSON.parse(event.data);
  } catch {
    addBubble(event.data, 'agent');
    return;
  }
  if (data.type === 'status') {
    addBubble(data.message, 'agent');
  } else if (data.type === 'reply') {
    addBubble(data.message, 'agent');
    if (data.screenshot) {
      addScreenshotBubble(data.screenshot, 'Screenshot');
    }
  } else if (data.type === 'error') {
    addBubble('Error: ' + data.message, 'agent');
  }
};

ws.onopen = () => {
  addBubble('Connected to browser agent.', 'agent');
};
ws.onclose = () => {
  addBubble('Disconnected.', 'agent');
}; 