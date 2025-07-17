const ws = new WebSocket(`ws://${window.location.host}/ws`);
const messages = document.getElementById('messages');
const input = document.getElementById('input');
const send = document.getElementById('send');
const status = document.getElementById('status');
const screenshot = document.getElementById('screenshot');

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.className = 'msg ' + sender;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

send.onclick = () => {
  const value = input.value.trim();
  if (value) {
    addMessage(value, 'user');
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
    addMessage(event.data, 'agent');
    return;
  }
  if (data.status === 'ok') {
    addMessage(`Title: ${data.title}`, 'agent');
    status.textContent = 'Screenshot updated.';
    if (data.screenshot) {
      screenshot.src = `/screenshots/latest.png?${Date.now()}`;
      screenshot.style.display = 'block';
    }
  } else if (data.status === 'error') {
    addMessage(`Error: ${data.error}`, 'agent');
    status.textContent = 'Error occurred.';
    screenshot.style.display = 'none';
  }
};
ws.onopen = () => {
  addMessage('Connected to browser agent.', 'agent');
  status.textContent = 'Connected.';
};
ws.onclose = () => {
  addMessage('Disconnected.', 'agent');
  status.textContent = 'Disconnected.';
  screenshot.style.display = 'none';
}; 