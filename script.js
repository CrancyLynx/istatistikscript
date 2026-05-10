// 🚀 X/Twitter Profil Analiz (Son 7 Gün) v1.0 (Glassmorphism UI Edition)
// Kendi profil sayfanızda (örn: x.com/kullaniciadi) F12 > Console'a yapıştırın
(async () => {
    // Önceki çalışan script ve UI varsa temizle
    if (window._xStatsCollector) clearInterval(window._xStatsCollector);
    const existingUI = document.getElementById('x-vibe-analytics');
    if (existingUI) existingUI.remove();

    // 7 Gün öncesinin zaman damgasını hesapla
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // UI Oluşturucu (Glassmorphism Panel)
    const createUI = () => {
        const panel = document.createElement('div');
        panel.id = 'x-vibe-analytics';
        panel.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; width: 340px;
            background: rgba(15, 20, 25, 0.75); backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px;
            color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 20px; z-index: 999999; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        panel.innerHTML = `
            <div style="font-weight: 600; font-size: 16px; margin-bottom: 12px; display: flex; justify-content: space-between;">
                <span>📊 7 Günlük Analiz</span>
                <span id="x-status" style="color: #1d9bf0; font-size: 14px;">Taranıyor...</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                    <div style="font-size: 11px; color: #8b98a5;">Görüntülenme</div>
                    <div id="x-views" style="font-size: 18px; font-weight: 700; color: #1d9bf0;">0</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                    <div style="font-size: 11px; color: #8b98a5;">Beğeni</div>
                    <div id="x-likes" style="font-size: 18px; font-weight: 700; color: #f91880;">0</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                    <div style="font-size: 11px; color: #8b98a5;">Yanıt</div>
                    <div id="x-replies" style="font-size: 18px; font-weight: 700; color: #00ba7c;">0</div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                    <div style="font-size: 11px; color: #8b98a5;">İncelenen Tweet</div>
                    <div id="x-tweets" style="font-size: 18px; font-weight: 700; color: #ffd400;">0</div>
                </div>
            </div>
            <div id="x-log" style="font-size: 12px; color: #8b98a5; max-height: 60px; overflow-y: auto; margin-bottom: 10px;"></div>
        `;
        document.body.appendChild(panel);
        
        return {
            updateStats: (views, likes, replies, tweets) => {
                document.getElementById('x-views').innerText = views.toLocaleString('tr-TR');
                document.getElementById('x-likes').innerText = likes.toLocaleString('tr-TR');
                document.getElementById('x-replies').innerText = replies.toLocaleString('tr-TR');
                document.getElementById('x-tweets').innerText = tweets;
            },
            setStatus: (text, color = '#1d9bf0') => {
                const el = document.getElementById('x-status');
                el.innerText = text; el.style.color = color;
            },
            log: (text) => {
                const el = document.getElementById('x-log');
                el.innerHTML = `<div>${text}</div>` + el.innerHTML;
            }
        };
    };

    const isProfilePage = location.pathname.split('/').filter(Boolean).length === 1;
    if (!isProfilePage) {
        alert('❌ Lütfen scripti profil sayfanızda çalıştırın.\nÖrn: x.com/kullaniciadi');
        return;
    }

    const ui = createUI();
    window.scrollTo(0, 0);
    ui.log('⏳ Sayfa en üste alındı, tarama başlıyor...');
    await new Promise(r => setTimeout(r, 1500));

    let totalViews = 0, totalLikes = 0, totalReplies = 0, tweetCount = 0;
    const processedIds = new Set();
    let oldTweetCount = 0, stable = 0, lastProcessedCount = 0;

    window._xStatsCollector = setInterval(() => {
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');
        
        tweets.forEach(tweet => {
            // Tweetin benzersiz ID'sini linkten çıkar
            const linkEl = tweet.querySelector('a[href*="/status/"]');
            if (!linkEl) return;
            const tweetId = linkEl.href.split('/status/')[1].split('/')[0];
            
            if (processedIds.has(tweetId)) return;

            // Zaman damgasını al
            const timeEl = tweet.querySelector('time');
            if (!timeEl) return;
            const tweetDate = new Date(timeEl.getAttribute('datetime'));

            // Sabitlenmiş tweet kontrolü (eski tarihli olabilir, atlamamak lazım)
            const isPinned = tweet.innerText.toLowerCase().includes('sabitlenmiş') || tweet.innerText.toLowerCase().includes('pinned');

            // Eğer tweet 7 günden eskiyse ve sabitlenmemişse sayacı artır
            if (tweetDate < sevenDaysAgo) {
                if (!isPinned) {
                    oldTweetCount++;
                }
                return; // Bu tweeti hesaplamaya katma
            }

            // Tweet 7 gün içindeyse verileri topla
            processedIds.add(tweetId);
            tweetCount++;

            // Aria-label gizli etiketinden sayıları hatasız çek (k, m gibi kısaltmalarla uğraşmamak için)
            const group = tweet.querySelector('[role="group"]');
            if (group) {
                const label = group.getAttribute('aria-label') || '';
                
                // TR ve EN dillerini destekleyen regex fonksiyonu
                const extractNum = (regex) => {
                    const match = label.match(regex);
                    if (match) {
                        return parseInt(match[1].replace(/[,.]/g, ''), 10) || 0;
                    }
                    return 0;
                };

                totalViews += extractNum(/([\d.,]+)\s*(görüntülenme|views)/i);
                totalLikes += extractNum(/([\d.,]+)\s*(beğeni|beğenme|likes)/i);
                totalReplies += extractNum(/([\d.,]+)\s*(yanıt|replies)/i);
            }
        });

        ui.updateStats(totalViews, totalLikes, totalReplies, tweetCount);

        // Durdurma Koşulları:
        // 1. Üst üste 7 günden eski 4 tweet gördüysek sınır aşıldı demektir.
        // 2. DOM değişmiyorsa (sayfa sonuna geldiysek) bitir.
        if (processedIds.size === lastProcessedCount) {
            stable++;
        } else {
            stable = 0;
            lastProcessedCount = processedIds.size;
        }

        if (oldTweetCount >= 4 || stable >= 6) {
            clearInterval(window._xStatsCollector);
            ui.setStatus('Tamamlandı!', '#00ba7c');
            ui.log(`✅ Son 7 günün analizi başarıyla tamamlandı.`);
            if (stable >= 6 && oldTweetCount < 4) {
                ui.log(`ℹ️ Sayfa sonuna ulaşıldı.`);
            }
        } else {
            // Aşağı kaydır
            window.scrollBy(0, window.innerHeight * 1.5);
        }
    }, 1200);
})();
