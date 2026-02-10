const LOGIN_URL = "https://localhost/login";

// How long to keep the background tab open (ms).
// Increase if your login page takes longer to set session.
const CLOSE_AFTER_MS = 1500;

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "trigger-login") return;

  try {
    // Try to find an existing background tab already on the login URL
    const existingTabs = await chrome.tabs.query({ url: LOGIN_URL });

    if (existingTabs.length > 0) {
      const tabId = existingTabs[0].id;

      // Reload it without focusing
      await chrome.tabs.reload(tabId, { bypassCache: true });

      // Optionally close it after a short delay
      setTimeout(() => {
        chrome.tabs.remove(tabId).catch(() => {});
      }, CLOSE_AFTER_MS);

      return;
    }

    // Otherwise open a new inactive (background) tab
    const tab = await chrome.tabs.create({
      url: LOGIN_URL,
      active: false
    });

    // Close it after a short delay
    setTimeout(() => {
      if (tab?.id != null) chrome.tabs.remove(tab.id).catch(() => {});
    }, CLOSE_AFTER_MS);
  } catch (err) {
    // If something fails, do nothing (keeps it silent)
    // You can inspect errors by viewing service worker logs in Extensions page.
  }
});
