(function() {
    'use strict';

    let scanner = null;
    let loginClicked = false;
    let masterEnabled = true;
    let quickLoginEnabled = true;
    let announcementsEnabled = true;
    let menuHideEnabled = false;
    let lastUrl = window.location.href;

    const quickLoginActive = () => masterEnabled && quickLoginEnabled;
    const announcementsActive = () => masterEnabled && announcementsEnabled;
    const menuHideActive = () => masterEnabled && menuHideEnabled;
    const anyFeatureActive = () => quickLoginActive() || announcementsActive() || menuHideActive();

    let lastMenuUrl = null;
    let menuHideAttemptsLeft = 0;
    const MENU_HIDE_ATTEMPT_WINDOW = 20;

    // Ayarlar doğrudan chrome.storage.local'dan okunur. Eskiden her UYAP sayfası
    // açılışında arka plana "getToggleState" iletisi gidiyordu; bu, eklentinin
    // arka plan sürecini her açılışta uyandırıp 30 saniye ayakta tutuyordu.
    // Varsayılanlar background.js'teki getDefaultState ile aynıdır.
    chrome.storage.local.get({
        masterEnabled: true,
        quickLoginEnabled: true,
        announcementsEnabled: true,
        menuHideEnabled: false
    }, (state) => {
        if (state && !chrome.runtime.lastError) {
            masterEnabled = state.masterEnabled;
            quickLoginEnabled = state.quickLoginEnabled;
            announcementsEnabled = state.announcementsEnabled;
            menuHideEnabled = state.menuHideEnabled;
        }
        // Eklenti tamamen kapalıysa arka plan simgeyi gri yapsın diye tek bir
        // ileti gider. Chrome eklentiyi yeniden açınca simge renkli gelir ve
        // arka plan uyanmadıkça griye dönmez. Açıkken hiç ileti gitmez.
        if (!anyFeatureActive()) {
            chrome.runtime.sendMessage({ action: "refreshIcon" }, () => void chrome.runtime.lastError);
        }
        startScanner();
    });

    // Ayar değişikliklerini doğrudan storage'dan dinliyoruz.
    // Eskiden background.js chrome.tabs.query({url: ...}) ile sekmelere mesaj
    // gönderiyor ve sekmeyi yeniliyordu; ancak manifest'te "tabs" izni /
    // host izni olmadığı için bu sorgu hiçbir sekme döndürmüyordu. Bu yüzden
    // hem canlı güncelleme hem de sayfa yenileme çalışmıyordu. Sayfa yenileme
    // özelliği kaldırıldı; ayarlar artık yenilemeye gerek kalmadan anında
    // uygulanıyor.
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") return;

        const touchesFeatures = ("masterEnabled" in changes) ||
            ("quickLoginEnabled" in changes) ||
            ("announcementsEnabled" in changes) ||
            ("menuHideEnabled" in changes);
        if (!touchesFeatures) return;

        const wasMenuHideActive = menuHideActive();

        if ("masterEnabled" in changes) masterEnabled = changes.masterEnabled.newValue;
        if ("quickLoginEnabled" in changes) quickLoginEnabled = changes.quickLoginEnabled.newValue;
        if ("announcementsEnabled" in changes) announcementsEnabled = changes.announcementsEnabled.newValue;
        if ("menuHideEnabled" in changes) menuHideEnabled = changes.menuHideEnabled.newValue;

        if (!wasMenuHideActive && menuHideActive()) {
            lastMenuUrl = null;
        }

        if (!anyFeatureActive()) {
            clearEverything();
        } else {
            startScanner();
        }
    });

    const hideMenuIfOpen = () => {
        const collapseBtn = document.querySelector('.sidebar-toggle-btn');
        if (collapseBtn && collapseBtn.offsetParent !== null) {
            const title = (collapseBtn.getAttribute('title') || '').trim();
            if (title === 'Menüyü Daralt') {
                collapseBtn.click();
                return;
            }
        }

        const closeBtn = document.querySelector('button.navbar-toggler[aria-label="Menüyü Kapat"]');
        if (closeBtn && closeBtn.offsetParent !== null) {
            closeBtn.click();
        }
    };

    const clearEverything = () => {
        if (scanner) {
            clearInterval(scanner);
            scanner = null;
        }
    };

    // Yedek ses: normalde ses artık arka planda (offscreen document) çalınıyor.
    // Yalnızca offscreen kullanılamazsa background.js playSound:true döner ve
    // burada denenir. Sayfada gerçek bir kullanıcı tıklaması olmadıysa Chrome
    // bunu engelleyebilir; bu yüzden asıl yol offscreen'dir.
    const playNotificationSound = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioCtx();

            const start = () => {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);

                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.3);
                osc.onended = () => ctx.close();
            };

            if (ctx.state === 'suspended') {
                ctx.resume().then(start).catch(() => ctx.close());
            } else {
                start();
            }
        } catch (e) {
            // Ses çalınamazsa sessizce geç
        }
    };

    const saveLog = (text) => {
        chrome.runtime.sendMessage({ action: "saveLog", text: text }, (response) => {
            if (chrome.runtime.lastError) return;
            if (response && response.playSound) {
                playNotificationSound();
            }
        });
    };

    const startScanner = () => {
        if (!anyFeatureActive()) {
            clearEverything();
            return;
        }

        if (!scanner) {
            scanner = setInterval(() => {
                if (!anyFeatureActive()) {
                    clearEverything();
                    return;
                }

                if (menuHideActive()) {
                    const currentMenuUrl = window.location.href;
                    if (currentMenuUrl !== lastMenuUrl) {
                        lastMenuUrl = currentMenuUrl;
                        menuHideAttemptsLeft = MENU_HIDE_ATTEMPT_WINDOW;
                    }
                    if (menuHideAttemptsLeft > 0) {
                        menuHideAttemptsLeft--;
                        hideMenuIfOpen();
                    }
                }

                const currentUrl = window.location.href;
                const isRootUrl = currentUrl === "https://avukat.uyap.gov.tr/" || currentUrl === "https://avukat.uyap.gov.tr/#";
                const isLoginUrl = currentUrl.includes("/giris");

                if (!isRootUrl && !isLoginUrl) {
                    return;
                }

                if (currentUrl !== lastUrl) {
                    lastUrl = currentUrl;
                    if (isLoginUrl) loginClicked = false;
                }

                if (announcementsActive()) {
                    const closeBtns = document.querySelectorAll('.dx-button-danger[role="button"]');
                    for (const btn of closeBtns) {
                        if (btn.textContent.trim() === 'Kapat' && btn.offsetParent !== null) {
                            let popupText = "Bilinmeyen Duyuru";
                            // UYAP duyuruyu önce DevExtreme penceresinde (.dx-popup-wrapper),
                            // 2026-10'dan beri Bootstrap penceresinde (.modal.duyuru-modal) gösteriyor.
                            const popupWrapper = btn.closest('.dx-popup-wrapper, .modal');

                            if (popupWrapper) {
                                const duyuruNode = popupWrapper.querySelector('#duyuruicerik');
                                if (duyuruNode) {
                                    popupText = duyuruNode.innerText.trim();
                                } else if (popupWrapper.matches('.dx-popup-wrapper')) {
                                    popupText = popupWrapper.innerText.replace('Tekrar Gösterme', '').replace('Kapat', '').trim();
                                }
                                // Duyuru içeriği olmayan Bootstrap penceresi duyuru değildir;
                                // metni okunmaz, listede "Bilinmeyen Duyuru" görünür.
                            }

                            saveLog(popupText);
                            btn.click();
                            return;
                        }
                    }
                }

                if (quickLoginActive() && isLoginUrl) {
                    const pinInput = document.querySelector('input[type="password"]') ||
                                     document.querySelector('input[placeholder*="Pin"]');

                    if (pinInput && pinInput.offsetParent !== null) {
                        loginClicked = true;
                        if (document.activeElement !== pinInput && pinInput.value === "") {
                            pinInput.focus();
                            pinInput.click();
                            setTimeout(() => {
                                if (document.activeElement !== pinInput) pinInput.focus();
                            }, 50);
                        }
                        return;
                    }

                    if (!loginClicked) {
                        let eImzaBtn = null;
                        const buttons = document.querySelectorAll('div.dx-button[role="button"]');
                        for (const btn of buttons) {
                            if (btn.textContent.includes('Adalet E-imza')) {
                                eImzaBtn = btn;
                                break;
                            }
                        }

                        if (eImzaBtn) {
                            if (eImzaBtn.offsetParent !== null) {
                                ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                                    eImzaBtn.dispatchEvent(new MouseEvent(eventType, { bubbles: true, cancelable: true, view: window }));
                                });
                                loginClicked = true;
                            } else {
                                const mobileMenuBtn = document.querySelector('button.navbar-toggler');
                                if (mobileMenuBtn && mobileMenuBtn.offsetParent !== null && mobileMenuBtn.getAttribute('aria-expanded') === 'false') {
                                    mobileMenuBtn.click();
                                }
                            }
                        }
                    }
                }
            }, 100);
        }
    };

    startScanner();
})();
