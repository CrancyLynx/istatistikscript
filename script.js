// 🚀 X/Twitter Ultra Analytics v6.0 (Pure Analytics & RT Fix)
// Kendi profilinizde çalıştırın. Sadece SİZE AİT tweetlerin verisini hesaplar.
(async () => {
    if (window._xUltraPremium) clearInterval(window._xUltraPremium);
    const existingUI = document.getElementById('x-premium-dashboard');
    if (existingUI) existingUI.remove();

    // 1. Profil Sahibinin Kullanıcı Adını Yakala
    const profileUsername = location.pathname.split('/').filter(Boolean)[0].toLowerCase();

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const createUI = () => {
        const panel = document.createElement('div');
        panel.id = 'x-premium-dashboard';
        panel.style.cssText = `
            position: fixed; bottom: 24px; right: 24px; width: 440px;
            background: rgba(9, 9, 11, 0.95); backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px;
            color: #ededed; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 0; z-index: 999999; box-shadow: 0 20px 40px rgba(0,0,0,0.7);
            overflow: hidden; display: flex; flex-direction: column;
        `;
        
        panel.innerHTML = `
            <div style="padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02);">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div id="p-pulse" style="width: 8px; height: 8px; background: #7856ff; border-radius: 50%; box-shadow: 0 0 10px #7856ff; animation: pulse 1.5s infinite;"></div>
                    <span style="font-weight: 700; font-size: 16px; letter-spacing: -0.5px;">Saf Analiz (Sadece Siz)</span>
                </div>
                <span id="p-status" style="color: #7856ff; font-size: 12px; font-weight: 600; padding: 4px 10px; background: rgba(120,86,255,0.15); border-radius: 12px;">Tarama Aktif...</span>
            </div>

            <div style="padding: 16px 24px 0 24px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #8b98a5; margin-bottom: 8px;">
                    <span>Size Ait Tweet: <b id="p-tweet-count" style="color:#fff">0</b></span>
                    <span id="p-date-tracker">Zaman: <b>Bugün</b></span>
                </div>
                <div style="text-align: center; font-size: 11px; padding: 4px; border-radius: 6px; background: rgba(255,255,255,0.05); color: #fff; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.03);" id="p-phase-indicator">
                    🟢 Zaman Tüneli: <b>Son 7 Gün (1. Hafta) okunuyor...</b>
                </div>
                <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                    <div id="p-progress-bar" style="height: 100%; width: 5%; background: linear-gradient(90deg, #1d9bf0, #7856ff, #00ba7c); transition: width 0.5s ease;"></div>
                </div>
            </div>
            
            <div id="p-charts" style="padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; max-height: 55vh; overflow-y: auto;">
                <div style="text-align: center; color: #536471; font-size: 14px; padding: 20px 0;">Profiliniz analiz ediliyor...</div>
            </div>
        `;

        const style = document.createElement('style');
        style.innerHTML = `@keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }`;
        document.head.appendChild(style);
        document.body.appendChild(panel);

        const renderChart = (title, w1, w2, colorHex) => {
            const total = w1 + w2;
            const diff = w2 === 0 ? (w1 > 0 ? 100 : 0) : ((w1 - w2) / w2 * 100);
            const isUp = diff >= 0;
            const diffFormatted = Math.abs(diff).toFixed(1);
            
            const maxVal = Math.max(w1, w2, 1);
            const curWidth = Math.max((w1 / maxVal * 100), 2) + "%";
            const preWidth = Math.max((w2 / maxVal * 100), 2) + "%";

            return `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px; margin-bottom: 12px;">
                        <div>
                            <div style="font-size: 12px; color: #8b98a5; margin-bottom: 2px;">${title} (14 Gün Toplam)</div>
                            <div style="font-size: 22px; font-weight: 800; color: ${colorHex}; letter-spacing: -0.5px;">${total.toLocaleString('tr-TR')}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 13px; font-weight: 700; color: ${isUp ? '#00ba7c' : '#f4212e'}; background: ${isUp ? 'rgba(0,186,124,0.1)' : 'rgba(244,33,46,0.1)'}; padding: 4px 10px; border-radius: 8px;">
                                ${isUp ? '▲' : '▼'} %${diffFormatted}
                            </div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
                        <div>
                            <div style="font-size: 11px; color: #8b98a5;">Son 7 Gün (1. Hafta)</div>
                            <div style="font-size: 14px; font-weight: 600; color: #fff;">${w1.toLocaleString('tr-TR')}</div>
                        </div>
                        <div>
                            <div style="font-size: 11px; color: #536471;">Önceki 7 Gün (2. Hafta)</div>
                            <div style="font-size: 14px; font-weight: 600; color: #8b98a5;">${w2.toLocaleString('tr-TR')}</div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;">
                            <div style="width: ${curWidth}; height: 100%; background: ${colorHex}; border-radius: 4px; transition: width 0.5s ease;"></div>
                        </div>
                        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.03); border-radius: 3px; overflow: hidden;">
                            <div style="width: ${preWidth}; height: 100%; background: #536471; border-radius: 3px; transition: width 0.5s ease;"></div>
                        </div>
                    </div>
                </div>
            `;
        };

        return {
            updateData: (stats, count, oldestDate, phase) => {
                document.getElementById('p-tweet-count').innerText = count;
                
                const phaseEl = document.getElementById('p-phase-indicator');
                if (phase === 1) {
                    phaseEl.innerHTML = '🟢 Zaman Tüneli: <b>Son 7 Gün (1. Hafta) okunuyor...</b>';
                    phaseEl.style.color = '#00ba7c';
                } else if (phase === 2) {
                    phaseEl.innerHTML = '🟡 Zaman Tüneli: <b>Önceki 7 Gün (2. Hafta) okunuyor...</b>';
                    phaseEl.style.color = '#ffd400';
                }

                if (oldestDate) {
                    const daysDiff = (now - oldestDate) / (1000 * 60 * 60 * 24);
                    const progressPercent = Math.min((daysDiff / 14) * 100, 100);
                    document.getElementById('p-progress-bar').style.width = `${progressPercent}%`;
                    const dateStr = oldestDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
                    document.getElementById('p-date-tracker').innerHTML = `Tarih: <b>${dateStr}</b>`;
                }

                document.getElementById('p-charts').innerHTML = `
                    ${renderChart('Görüntülenme', stats.w1.views, stats.w2.views, '#1d9bf0')}
                    ${renderChart('Beğeni', stats.w1.likes, stats.w2.likes, '#f91880')}
                    ${renderChart('Yanıt', stats.w1.replies, stats.w2.replies, '#00ba7c')}
                `;
            },
            finish: () => {
                const s = document.getElementById('p-status');
                s.innerText = 'Tamamlandı';
                s.style.background = 'rgba(0,186,124,0.1)';
                s.style.color = '#00ba7c';
                document.getElementById('p-pulse').style.background = '#00ba7c';
                document.getElementById('p-pulse').style.boxShadow = '0 0 10px #00ba7c';
                document.getElementById('p-progress-bar').style.width = '100%';
                document.getElementById('p-progress-bar').style.background = '#00ba7c';
                document.getElementById('p-phase-indicator').innerHTML = '✅ <b>Saf analiz başarıyla tamamlandı.</b>';
                document.getElementById('p-phase-indicator').style.color = '#fff';
            }
        };
    };

    const ui = createUI();
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 1000));

    let stats = { w1: { views: 0, likes: 0, replies: 0 }, w2: { views: 0, likes: 0, replies: 0 } };
    const processedIds = new Set();
    let consecutiveOldTweets = 0; 
    let stableScrolls = 0; 
    let oldestDateFound = now;
    let currentPhase = 1;

    window._xUltraPremium = setInterval(() => {
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        let newTweetsFoundInThisCycle = false;
        let foundPhase1InCycle = false;
        let foundPhase2InCycle = false;

        tweets.forEach(tweet => {
            const linkEl = tweet.querySelector('a[href*="/status/"]');
            if (!linkEl) return;
            
            // 2. TWEET KİME AİT KONTROLÜ (EN ÖNEMLİ KISIM)
            const href = linkEl.getAttribute('href');
            const tweetAuthor = href.split('/')[1].toLowerCase();
            const tweetId = href.split('/status/')[1].split('/')[0];
            
            if (processedIds.has(tweetId)) return;
            
            // Eğer tweeti atan kişi sen değilsen (RT ise), hiçbir işleme sokmadan direkt geç!
            if (profileUsername !== tweetAuthor) return;

            const timeEl = tweet.querySelector('time');
            if (!timeEl) return; 
            
            const tweetDate = new Date(timeEl.getAttribute('datetime'));
            const isPinned = tweet.innerText.toLowerCase().includes('sabitlenmiş') || tweet.innerText.toLowerCase().includes('pinned');

            if (!isPinned) {
                if (tweetDate < oldestDateFound) {
                    oldestDateFound = tweetDate;
                }
                
                if (tweetDate >= sevenDaysAgo) foundPhase1InCycle = true;
                else if (tweetDate >= fourteenDaysAgo) foundPhase2InCycle = true;
                
                if (tweetDate < fourteenDaysAgo) {
                    consecutiveOldTweets++;
                } else {
                    consecutiveOldTweets = 0; 
                }
            }

            // Tweeti istatistiğe ekleme kararı
            let targetWeek = null;
            if (tweetDate >= sevenDaysAgo) targetWeek = stats.w1;
            else if (tweetDate >= fourteenDaysAgo) targetWeek = stats.w2;

            if (targetWeek) {
                newTweetsFoundInThisCycle = true;
                processedIds.add(tweetId);
                
                const group = tweet.querySelector('[role="group"]');
                if (group) {
                    const label = group.getAttribute('aria-label') || '';
                    const extract = (reg) => {
                        const m = label.match(reg);
                        return m ? parseInt(m[1].replace(/[,.]/g, ''), 10) || 0 : 0;
                    };
                    targetWeek.views += extract(/([\d.,]+)\s*(görüntülenme|views)/i);
                    targetWeek.likes += extract(/([\d.,]+)\s*(beğeni|beğenme|likes)/i);
                    targetWeek.replies += extract(/([\d.,]+)\s*(yanıt|replies)/i);
                }
            }
        });

        if (foundPhase1InCycle) currentPhase = 1;
        else if (foundPhase2InCycle) currentPhase = 2;

        ui.updateData(stats, processedIds.size, oldestDateFound, currentPhase);

        // 14 Günden eski kendi tweetlerini arka arkaya görürse bitir
        if (consecutiveOldTweets >= 5) {
            clearInterval(window._xUltraPremium);
            ui.finish();
            return;
        }

        if (!newTweetsFoundInThisCycle) {
            stableScrolls++;
        } else {
            stableScrolls = 0; 
        }

        if (stableScrolls >= 15) {
            clearInterval(window._xUltraPremium);
            ui.finish();
            return;
        }

        window.scrollBy(0, window.innerHeight * 0.85);

    }, 1500); 
})();
