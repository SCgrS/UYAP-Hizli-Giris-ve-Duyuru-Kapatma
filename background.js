const LOG_LIMIT = 20;
const OFFSCREEN_URL = "offscreen.html";

function getDefaultState() {
    // Her çağrıda taze bir nesne döner.
    // NOT: closedMessages, badgeCount ve announcementCloseCounts burada YOK.
    // Bunlar chrome.storage.session'a taşındı; diske hiç yazılmazlar
    // (aşağıdaki açıklamaya bakın). Burada yalnızca ayarlar tutulur.
    return {
        masterEnabled: true,
        quickLoginEnabled: true,
        announcementsEnabled: true,
        menuHideEnabled: false,
        soundEnabled: true,
        soundFrequency: 5
    };
}

const ICONS_ON = { "16": "icon16.png", "48": "icon48.png", "128": "icon128.png" };
const ICONS_OFF = { "16": "icon16_off.png", "48": "icon48_off.png", "128": "icon128_off.png" };

// Service worker uykuya dalıp uyanırsa veya session storage kullanılamazsa
// diye bellekte yedek sayaç.
const memoryCounts = new Map();

function getState() {
    return chrome.storage.local.get(getDefaultState());
}

function updateBadgeFrom(state, badgeCount) {
    const effectiveActive = state.masterEnabled &&
        (state.quickLoginEnabled || state.announcementsEnabled || state.menuHideEnabled);
    chrome.action.setIcon({ path: effectiveActive ? ICONS_ON : ICONS_OFF });

    const announcementsActive = state.masterEnabled && state.announcementsEnabled;
    const count = parseInt(badgeCount, 10) || 0;
    if (announcementsActive && count > 0) {
        chrome.action.setBadgeText({ text: count.toString() });
        chrome.action.setBadgeBackgroundColor({ color: "#b8382c" });
    } else {
        chrome.action.setBadgeText({ text: "" });
    }
}

/* ------------------------------------------------------------------ */
/* SES: offscreen document                                             */
/*                                                                     */
/* Eski kod sesi content.js içinde (yani UYAP sayfasında) çalmaya       */
/* çalışıyordu. Chrome'un autoplay politikası gereği, kullanıcı o       */
/* sekmeye gerçek bir tıklama yapmadıysa AudioContext "suspended"       */
/* durumunda başlar ve hiçbir ses duyulmaz. Duyuruyu kapatan tıklamayı  */
/* betik yaptığı için bu "gerçek kullanıcı hareketi" sayılmaz -> ses    */
/* hiçbir seçenekte çıkmıyordu.                                        */
/*                                                                     */
/* Çözüm: sesi eklentinin kendi offscreen sayfasında çalmak. Eklenti    */
/* sayfaları autoplay kısıtlamasından muaftır ve sekme arka planda      */
/* olsa, başka sekmeye geçilse de ses çalar.                           */
/* ------------------------------------------------------------------ */

let creatingOffscreen = null;

async function hasOffscreenDocument() {
    try {
        if (chrome.offscreen && chrome.offscreen.hasDocument) {
            return await chrome.offscreen.hasDocument();
        }
    } catch (e) { /* yoksay */ }
    try {
        const contexts = await chrome.runtime.getContexts({ contextTypes: ["OFFSCREEN_DOCUMENT"] });
        return contexts.length > 0;
    } catch (e) {
        return false;
    }
}

async function ensureOffscreenDocument() {
    if (!chrome.offscreen) return false;
    if (await hasOffscreenDocument()) return true;

    if (creatingOffscreen) {
        try { await creatingOffscreen; } catch (e) { /* yoksay */ }
        return await hasOffscreenDocument();
    }

    try {
        creatingOffscreen = chrome.offscreen.createDocument({
            url: OFFSCREEN_URL,
            reasons: ["AUDIO_PLAYBACK"],
            justification: "Duyuru kapatıldığında bildirim sesi çalmak için."
        });
        await creatingOffscreen;
        return true;
    } catch (e) {
        // Aynı anda iki oluşturma denemesi olduysa belge zaten vardır.
        return await hasOffscreenDocument();
    } finally {
        creatingOffscreen = null;
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playBeepInBackground() {
    const ready = await ensureOffscreenDocument();
    if (!ready) return false;

    // Belge yeni oluşturulduysa betiği henüz yüklenmemiş olabilir; birkaç kez dene.
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const res = await chrome.runtime.sendMessage({ target: "offscreen", action: "playBeep" });
            if (res && res.ok) return true;
        } catch (e) { /* bağlantı henüz hazır değil */ }
        await sleep(120);
    }
    return false;
}

/* ------------------------------------------------------------------ */
/* OTURUM VERİSİ: chrome.storage.session                               */
/*                                                                     */
/* Duyuru metinleri (closedMessages), rozet sayacı (badgeCount) ve      */
/* kapatma sayaçları burada tutulur; hiçbiri diske yazılmaz.           */
/*                                                                     */
/* İstenen davranış: aynı duyuruyu kaçıncı kez kapattığımız; sekme      */
/* değişse de, sayfa yenilense de, duyuru okunsa da okunmasa da sabit   */
/* kalsın; yalnızca tüm Chrome pencereleri kapanınca sıfırlansın.       */
/* chrome.storage.session tam olarak bunu yapar: tarayıcı oturumu       */
/* boyunca (service worker yeniden başlasa bile) kalıcıdır, tarayıcı    */
/* tamamen kapanınca temizlenir.                                       */
/* ------------------------------------------------------------------ */

const SESSION_COUNT_KEY = "announcementCloseCounts";
const SESSION_LOG_KEY = "closedMessages";
const SESSION_BADGE_KEY = "badgeCount";

/* Session storage kullanılamazsa (çok nadir) devreye giren bellek yedekleri.
   Bunlar da service worker ile birlikte yaşar, diske hiç yazılmaz. */
let memoryLogs = [];
let memoryBadge = 0;

async function getSessionLogs() {
    try {
        const data = await chrome.storage.session.get({ [SESSION_LOG_KEY]: [] });
        const logs = data[SESSION_LOG_KEY];
        return Array.isArray(logs) ? logs.slice() : [];
    } catch (e) {
        return memoryLogs.slice();
    }
}

async function setSessionLogs(logs) {
    memoryLogs = logs.slice();
    try {
        await chrome.storage.session.set({ [SESSION_LOG_KEY]: logs });
    } catch (e) { /* yoksay */ }
}

async function getBadgeCount() {
    try {
        const data = await chrome.storage.session.get({ [SESSION_BADGE_KEY]: 0 });
        return parseInt(data[SESSION_BADGE_KEY], 10) || 0;
    } catch (e) {
        return memoryBadge;
    }
}

async function setBadgeCount(value) {
    memoryBadge = value;
    try {
        await chrome.storage.session.set({ [SESSION_BADGE_KEY]: value });
    } catch (e) { /* yoksay */ }
}

/* Rozeti güncel ayarlar + güncel oturum sayacıyla tazeler. */
async function refreshBadge(state) {
    const settings = state || await getState();
    updateBadgeFrom(settings, await getBadgeCount());
}

async function bumpCloseCount(text) {
    const key = (text || "").trim();
    try {
        const data = await chrome.storage.session.get({ [SESSION_COUNT_KEY]: {} });
        const counts = data[SESSION_COUNT_KEY] || {};
        const next = (counts[key] || 0) + 1;
        counts[key] = next;
        await chrome.storage.session.set({ [SESSION_COUNT_KEY]: counts });
        memoryCounts.set(key, next);
        return next;
    } catch (e) {
        const next = (memoryCounts.get(key) || 0) + 1;
        memoryCounts.set(key, next);
        return next;
    }
}

/* ------------------------------------------------------------------ */

async function handleSaveLog(request, sendResponse) {
    try {
        const state = await getState();

        // Duyuru metinleri ve rozet sayacı YALNIZCA oturum belleğinde tutulur;
        // chrome.storage.local (yani disk) bunlar için hiç kullanılmaz. Tüm
        // Chrome pencereleri kapandığında kendiliğinden silinirler.
        const badgeCount = (await getBadgeCount()) + 1;
        const closedMessages = await getSessionLogs();
        closedMessages.push({
            time: new Date().toLocaleTimeString("tr-TR"),
            text: request.text
        });
        while (closedMessages.length > LOG_LIMIT) closedMessages.shift();

        await setBadgeCount(badgeCount);
        await setSessionLogs(closedMessages);
        updateBadgeFrom(state, badgeCount);

        const count = await bumpCloseCount(request.text);
        const frequency = parseInt(state.soundFrequency, 10) || 5;

        // 1. kapatmada çalar, sonra her `frequency` kapatmada bir çalar.
        const shouldPlaySound = !!state.soundEnabled &&
            !!state.masterEnabled &&
            !!state.announcementsEnabled &&
            ((count - 1) % frequency === 0);

        if (!shouldPlaySound) {
            sendResponse({ playSound: false });
            return;
        }

        const playedInBackground = await playBeepInBackground();
        // Offscreen çalamadıysa content.js'in kendi denemesine izin ver (yedek).
        sendResponse({ playSound: !playedInBackground });
    } catch (e) {
        sendResponse({ playSound: false });
    }
}

async function handleResetBadge(sendResponse) {
    try {
        await setBadgeCount(0);
        const state = await getState();
        updateBadgeFrom(state, 0);
    } catch (e) { /* yoksay */ }
    sendResponse({ ok: true });
}

async function handleGetLogs(sendResponse) {
    sendResponse({ logs: await getSessionLogs() });
}

async function handleGetToggleState(sendResponse) {
    const state = await getState();
    sendResponse(state);
}

async function handleSetToggleState(request, sendResponse) {
    const state = await getState();

    if (request.feature === "master") {
        state.masterEnabled = request.isEnabled;
        if (state.masterEnabled) {
            state.quickLoginEnabled = true;
            state.announcementsEnabled = true;
        } else {
            state.quickLoginEnabled = false;
            state.announcementsEnabled = false;
            state.menuHideEnabled = false;
        }
    } else if (request.feature === "sound") {
        // Bildirim sesi anahtarı diğer anahtarlarla etkileşime girmez.
        state.soundEnabled = request.isEnabled;
    } else if (request.feature === "soundFrequency") {
        state.soundFrequency = parseInt(request.value, 10) || 5;
    } else {
        if (request.feature === "quickLogin") {
            state.quickLoginEnabled = request.isEnabled;
        } else if (request.feature === "announcements") {
            state.announcementsEnabled = request.isEnabled;
        } else if (request.feature === "menuHide") {
            state.menuHideEnabled = request.isEnabled;
        }

        if (request.isEnabled && !state.masterEnabled) {
            state.masterEnabled = true;
        }
    }

    if (request.feature !== "sound" && request.feature !== "soundFrequency") {
        const anyIndividual = state.quickLoginEnabled || state.announcementsEnabled || state.menuHideEnabled;
        if (!anyIndividual) state.masterEnabled = false;
    }

    // Yalnızca ayar anahtarlarını yaz. content.js bu değişiklikleri
    // chrome.storage.onChanged ile anında görür; sekme yenilemeye
    // (kaldırılan refreshMatchingTabs) veya tabs iznine gerek yok.
    await chrome.storage.local.set({
        masterEnabled: state.masterEnabled,
        quickLoginEnabled: state.quickLoginEnabled,
        announcementsEnabled: state.announcementsEnabled,
        menuHideEnabled: state.menuHideEnabled,
        soundEnabled: state.soundEnabled,
        soundFrequency: state.soundFrequency
    });

    await refreshBadge(state);
    sendResponse(state);
}

/* ------------------------------------------------------------------ */
/* AÇILIŞ EKRANI                                                       */
/*                                                                     */
/* Eklenti ilk kez kurulduğunda welcome.html sekmesini bir kez açar.    */
/* Güncellemelerde (reason === "update") açılmaz. Ayrıca storage'a bir  */
/* bayrak yazarak, onInstalled'ın beklenmedik şekilde ikinci kez        */
/* tetiklenmesi durumunda sekmenin tekrar açılmasını engelleriz.       */
/* ------------------------------------------------------------------ */

const WELCOME_SHOWN_KEY = "welcomeShown";

async function openWelcomeTab() {
    try {
        const data = await chrome.storage.local.get({ [WELCOME_SHOWN_KEY]: false });
        if (data[WELCOME_SHOWN_KEY]) return;
        await chrome.storage.local.set({ [WELCOME_SHOWN_KEY]: true });
        await chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") });
    } catch (e) { /* yoksay */ }
}

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") openWelcomeTab();
});

// Başlangıç
refreshBadge();
// Eski sürümlerden diskte kalmış olabilecek kayıtları temizle: duyuru
// metinleri, rozet sayacı ve kapatma sayaçları artık yalnızca oturum
// belleğinde tutuluyor, chrome.storage.local'de yer almıyor.
chrome.storage.local.remove(["announcementCloseCounts", "closedMessages", "badgeCount"]);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request || request.target === "offscreen") return; // offscreen'e ait mesaj

    switch (request.action) {
        case "resetBadge":
            handleResetBadge(sendResponse);
            return true;

        case "saveLog":
            handleSaveLog(request, sendResponse);
            return true;

        case "getLogs":
            handleGetLogs(sendResponse);
            return true;

        case "getToggleState":
            handleGetToggleState(sendResponse);
            return true;

        case "setToggleState":
            handleSetToggleState(request, sendResponse);
            return true;
    }
});
