const LOGIN_URL = "https://localhost/login";
const RETURN_DELAY_MS = 3000;

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "trigger-login") return;

  try {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tabs || tabs.length === 0) return;

    const tab = tabs[0];
    const tabId = tab.id;
    const originalUrl = tab.url;

    if (!tabId || !originalUrl) return;

    if (originalUrl.includes("/login")) return;

    await chrome.tabs.update(tabId, { url: LOGIN_URL });

    setTimeout(async () => {
      try {
        await chrome.tabs.update(tabId, { url: originalUrl });
      } catch (e) {}
    }, RETURN_DELAY_MS);

  } catch (err) {}
});