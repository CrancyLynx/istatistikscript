// 🚀 X/Twitter Analytics Pro v10.1 (Hybrid & Expandable Scan) — Kampüs Edition
// Profil sayfanızda (F12 > Console) çalıştırın.
(async () => {
    if (window._xUltraPremium) clearInterval(window._xUltraPremium);
    document.getElementById('x-start-menu')?.remove();
    document.getElementById('x-premium-dashboard')?.remove();
    document.getElementById('x-premium-heatmap')?.remove();

    const profileUsername = location.pathname.split('/').filter(Boolean)[0].toLowerCase();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000);
    let daysToScan = 0;
    let targetDate = null;

    // --- BAŞLANGIÇ MENÜSÜ ---
    const showMenu = () => {
        return new Promise((resolve) => {
            const menu = document.createElement('div');
            menu.id = 'x-start-menu';
            menu.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                width: 400px; background: rgba(10,10,18,0.98); backdrop-filter: blur(24px);
                border: 1px solid rgba(168,85,247,0.3); border-radius: 32px;
                color: #fff; font-family: 'Inter', -apple-system, sans-serif; padding: 40px;
                z-index: 1000000; box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 40px rgba(168,85,247,0.1); text-align: center;
            `;
            menu.innerHTML = `
                <div style="width:72px; height:72px; background:linear-gradient(135deg, #a855f7, #ec4899); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:32px; box-shadow:0 0 20px rgba(168,85,247,0.4);">📊</div>
                <div style="font-weight:900; font-size:26px; margin-bottom:8px; letter-spacing:-1px; background:linear-gradient(135deg, #a855f7, #ec4899); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">X Analytics Pro</div>
                <div style="font-size:14px; color:#9d9db8; margin-bottom:32px;">@${profileUsername} için analiz kapsamını seçin</div>
                
                <button id="btn-7" style="width:100%; padding:20px; margin-bottom:16px; border-radius:18px; border:1px solid rgba(59,130,246,0.3); background:rgba(59,130,246,0.1); color:#fff; font-weight:800; font-size:15px; cursor:pointer; transition:0.3s; text-align:left; display:flex; align-items:center; gap:15px;">
                    <span style="font-size:24px;">⚡</span>
                    <div>
                        <div>7 Günlük Hızlı Analiz</div>
                        <div style="font-size:12px; color:#8b98a5; font-weight:400; margin-top:2px;">Haftalık etkileşim özeti</div>
                    </div>
                </button>
                
                <button id="btn-14" style="width:100%; padding:20px; border-radius:18px; border:1px solid rgba(168,85,247,0.3); background:rgba(168,85,247,0.1); color:#fff; font-weight:800; font-size:15px; cursor:pointer; transition:0.3s; text-align:left; display:flex; align-items:center; gap:15px;">
                    <span style="font-size:24px;">📈</span>
                    <div>
                        <div>14 Günlük Tam Analiz</div>
                        <div style="font-size:12px; color:#8b98a5; font-weight:400; margin-top:2px;">Derinlemesine performans raporu</div>
                    </div>
                </button>
            `;
            document.body.appendChild(menu);
            
            const btns = menu.querySelectorAll('button');
            btns.forEach(b => {
                b.onmouseover = () => { b.style.transform = 'translateY(-2px)'; b.style.background = b.id === 'btn-7' ? 'rgba(59,130,246,0.2)' : 'rgba(168,85,247,0.2)'; };
                b.onmouseout = () => { b.style.transform = 'translateY(0)'; b.style.background = b.id === 'btn-7' ? 'rgba(59,130,246,0.1)' : 'rgba(168,85,247,0.1)'; };
            });

            document.getElementById('btn-7').onclick = () => { menu.remove(); resolve(7); };
            document.getElementById('btn-14').onclick = () => { menu.remove(); resolve(14); };
        });
    };

    daysToScan = await showMenu();
    targetDate = new Date(now.getTime() - daysToScan * 86400000);

    // --- UI OLUŞTURUCU ---
    const createUI = () => {
        const style = document.createElement('style');
        style.innerHTML = `@keyframes pulse{0%{opacity:.3}50%{opacity:1}100%{opacity:.3}}`;
        document.head.appendChild(style);

        const mainPanel = document.createElement('div');
        mainPanel.id = 'x-premium-dashboard';
        mainPanel.style.cssText = `position:fixed; bottom:24px; right:24px; width:440px; background:rgba(10,10,18,0.96); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.1); border-radius:24px; color:#f0f0f8; font-family:'Inter',sans-serif; z-index:999999; box-shadow:0 32px 80px rgba(0,0,0,0.7); display:flex; flex-direction:column; overflow:hidden;`;
        mainPanel.innerHTML = `
            <div style="padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02);">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div id="p-pulse" style="width:10px; height:10px; background:#a855f7; border-radius:50%; box-shadow:0 0 12px #a855f7; animation:pulse 1.5s infinite;"></div>
                    <span id="p-title" style="font-weight:800; font-size:16px; letter-spacing:-0.5px;">Analytics Dashboard</span>
                </div>
                <span id="p-status" style="color:#a855f7; font-size:12px; font-weight:700; padding:5px 12px; background:rgba(168,85,247,0.1); border-radius:100px;">Tarama Aktif</span>
            </div>
            <div style="padding:20px 24px 0 24px;">
                <div style="display:flex; justify-content:space-between; font-size:12px; color:#9d9db8; margin-bottom:10px;">
                    <span>Özgün Tweet: <b id="p-tweet-count" style="color:#fff">0</b></span>
                    <span id="p-date-tracker">Tarih: <b>Bugün</b></span>
                </div>
                <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:100px; overflow:hidden; margin-bottom:16px;">
                    <div id="p-progress-bar" style="height:100%; width:5%; background:linear-gradient(90deg,#a855f7,#ec4899); transition:width 0.5s ease; border-radius:100px;"></div>
                </div>
            </div>
            <div id="p-charts" style="padding:0 24px 20px 24px; display:flex; flex-direction:column; gap:14px; max-height:48vh; overflow-y:auto;"></div>
            <div id="p-footer" style="padding:16px 24px; border-top:1px solid rgba(255,255,255,0.06); display:none; background:rgba(255,255,255,0.01);"></div>
        `;
        document.body.appendChild(mainPanel);

        const heatPanel = document.createElement('div');
        heatPanel.id = 'x-premium-heatmap';
        heatPanel.style.cssText = `position:fixed; bottom:24px; right:480px; width:360px; background:rgba(10,10,18,0.96); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.1); border-radius:24px; color:#f0f0f8; font-family:'Inter',sans-serif; z-index:999999; box-shadow:0 32px 80px rgba(0,0,0,0.7); display:flex; flex-direction:column; overflow:hidden;`;
        let gridHTML = `<div style="display:grid; grid-template-columns:repeat(6,1fr); gap:8px; margin-bottom:20px;">`;
        for(let i=0; i<24; i++) gridHTML += `<div id="h-block-${i}" style="background:rgba(255,255,255,0.03); height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:11px; color:#5a5a7a; transition:0.3s; font-weight:600;">${i}:00</div>`;
        gridHTML += `</div>`;
        heatPanel.innerHTML = `
            <div style="padding:20px 24px; border-bottom:1px solid rgba(255,255,255,0.06); font-weight:800; font-size:16px; display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.02);">
                <span style="font-size:20px;">🔥</span> Altın Saatler
            </div>
            <div style="padding:20px 24px;">
                ${gridHTML}
                <div id="h-top-hours" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:16px; padding:16px; font-size:13px; color:#9d9db8;">Veri bekleniyor...</div>
            </div>
        `;
        document.body.appendChild(heatPanel);

        const renderChart = (title, w1, w2, color) => {
            const total = w1 + w2;
            const diff = w2 === 0 ? 100 : ((w1 - w2) / w2 * 100);
            const maxVal = Math.max(w1, w2, 1);
            return `
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); padding:16px; border-radius:18px; transition:0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <div>
                            <div style="font-size:12px; color:#9d9db8; font-weight:600;">${title} (${daysToScan}G Toplam)</div>
                            <div style="font-size:20px; font-weight:900; color:${color};">${total.toLocaleString('tr-TR')}</div>
                        </div>
                        ${daysToScan === 14 ? `<div style="font-size:12px; color:${diff >= 0 ? '#10b981' : '#ef4444'}; font-weight:800; padding:4px 8px; background:${diff >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; border-radius:8px;">${diff >= 0 ? '▲' : '▼'} %${Math.abs(diff).toFixed(1)}</div>` : ''}
                    </div>
                    <div style="height:8px; background:rgba(255,255,255,0.06); border-radius:100px; overflow:hidden; margin-bottom:6px;">
                        <div style="width:${(w1/maxVal*100)}%; height:100%; background:${color}; transition:0.8s cubic-bezier(0.16, 1, 0.3, 1);"></div>
                    </div>
                    ${daysToScan === 14 ? `<div style="height:5px; background:rgba(255,255,255,0.02); border-radius:100px; overflow:hidden;">
                        <div style="width:${(w2/maxVal*100)}%; height:100%; background:#5a5a7a; transition:0.8s cubic-bezier(0.16, 1, 0.3, 1);"></div>
                    </div>` : ''}
                </div>
            `;
        };

        return {
            updateUI: (stats, count, oldest, hourly) => {
                document.getElementById('p-tweet-count').innerText = count;
                document.getElementById('p-title').innerText = `${daysToScan} Günlük Analiz`;
                if (oldest) {
                    const progress = Math.min(((now - oldest) / (daysToScan * 86400000)) * 100, 100);
                    document.getElementById('p-progress-bar').style.width = `${progress}%`;
                    document.getElementById('p-date-tracker').innerHTML = `Tarih: <b>${oldest.toLocaleDateString('tr-TR', { day:'numeric', month:'short' })}</b>`;
                }
                document.getElementById('p-charts').innerHTML = `
                    ${renderChart('Görüntülenme', stats.w1.views, stats.w2.views, '#3b82f6')}
                    ${renderChart('Beğeni', stats.w1.likes, stats.w2.likes, '#ec4899')}
                    ${renderChart('Yanıt', stats.w1.replies, stats.w2.replies, '#10b981')}
                `;
                let maxS = 0;
                hourly.forEach(h => { h.score = h.c > 0 ? (h.l/h.c) + (h.v/h.c/100) : 0; if(h.score > maxS) maxS = h.score; });
                hourly.forEach((h, i) => {
                    const b = document.getElementById(`h-block-${i}`);
                    if (h.c > 0) {
                        const intensity = maxS > 0 ? h.score / maxS : 0.1;
                        b.style.background = `rgba(168,85,247,${Math.max(0.2, intensity)})`;
                        b.style.color = '#fff';
                        b.style.borderColor = 'rgba(168,85,247,0.4)';
                    }
                });
                const medals = ['🥇','🥈','🥉'];
                const top = [...hourly].map((h,i) => ({i,...h})).filter(h => h.c > 0).sort((a,b) => b.score - a.score).slice(0,3);
                if (top.length > 0) {
                    let topHTML = '';
                    top.forEach((t,idx) => {
                        topHTML += `<div style="display:flex; justify-content:space-between; padding:8px 0; ${idx < top.length-1 ? 'border-bottom:1px solid rgba(255,255,255,0.05);' : ''}">
                            <span style="font-weight:700;">${medals[idx]} <span style="margin-left:8px;">${t.i}:00</span></span>
                            <span style="color:#f0f0f8; font-weight:800;">~${Math.round(t.l/t.c)} beğeni/tweet</span>
                        </div>`;
                    });
                    document.getElementById('h-top-hours').innerHTML = topHTML;
                }
            },
            showFinishUI: (stats, count, onExpand) => {
                const s = document.getElementById('p-status');
                s.innerText = 'Tamamlandı'; s.style.background = 'rgba(16,185,129,0.15)'; s.style.color = '#10b981';
                document.getElementById('p-pulse').style.background = '#10b981';
                document.getElementById('p-pulse').style.boxShadow = '0 0 15px #10b981';
                document.getElementById('p-progress-bar').style.width = '100%';
                document.getElementById('p-progress-bar').style.background = 'linear-gradient(90deg, #10b981, #3b82f6)';

                const totalV = stats.w1.views + stats.w2.views;
                const totalL = stats.w1.likes + stats.w2.likes;
                const avgV = count > 0 ? Math.round(totalV / count) : 0;
                const avgL = count > 0 ? Math.round(totalL / count) : 0;

                const footer = document.getElementById('p-footer');
                footer.style.display = 'block';
                let footerHTML = `
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
                        <div style="background:rgba(255,255,255,0.04); padding:12px; border-radius:14px; text-align:center; border:1px solid rgba(255,255,255,0.05);">
                            <div style="font-size:11px; color:#9d9db8; margin-bottom:4px;">Ort. Görüntülenme</div>
                            <div style="font-size:18px; font-weight:900; color:#3b82f6;">${avgV.toLocaleString('tr-TR')}</div>
                        </div>
                        <div style="background:rgba(255,255,255,0.04); padding:12px; border-radius:14px; text-align:center; border:1px solid rgba(255,255,255,0.05);">
                            <div style="font-size:11px; color:#9d9db8; margin-bottom:4px;">Ort. Beğeni</div>
                            <div style="font-size:18px; font-weight:900; color:#ec4899;">${avgL.toLocaleString('tr-TR')}</div>
                        </div>
                    </div>
                `;
                if (daysToScan === 7) {
                    footerHTML += `<button id="btn-expand" style="width:100%; padding:14px; border-radius:14px; border:1px solid rgba(168,85,247,0.4); background:rgba(168,85,247,0.1); color:#fff; font-weight:800; cursor:pointer; transition:0.3s;" onmouseover="this.style.background='rgba(168,85,247,0.2)'" onmouseout="this.style.background='rgba(168,85,247,0.1)'">14 Güne Tamamla (Kalan 7 Günü Tara)</button>`;
                } else {
                    footerHTML += `<div style="text-align:center; font-size:14px; color:#10b981; font-weight:800; display:flex; align-items:center; justify-content:center; gap:8px;">
                        <span style="font-size:20px;">✅</span> Tam analiz başarıyla tamamlandı
                    </div>`;
                }
                footer.innerHTML = footerHTML;
                if (daysToScan === 7) document.getElementById('btn-expand').onclick = onExpand;
            }
        };
    };

    const ui = createUI();
    let stats = { w1: { views:0, likes:0, replies:0 }, w2: { views:0, likes:0, replies:0 } };
    let hourly = Array.from({length:24}, () => ({ c:0, v:0, l:0 }));
    const processed = new Set();
    let oldT = 0, stable = 0, oldest = now;

    const startScan = () => {
        const s = document.getElementById('p-status');
        s.innerText = 'Tarama Aktif'; s.style.background = 'rgba(168,85,247,0.1)'; s.style.color = '#a855f7';
        document.getElementById('p-pulse').style.background = '#a855f7';
        document.getElementById('p-footer').style.display = 'none';

        window._xUltraPremium = setInterval(() => {
            const tweets = document.querySelectorAll('article[data-testid="tweet"]');
            let foundNew = false;

            tweets.forEach(tweet => {
                const link = tweet.querySelector('a[href*="/status/"]');
                if (!link) return;
                const href = link.getAttribute('href');
                const author = href.split('/')[1].toLowerCase();
                const idPart = href.split('/status/')[1];
                if (!idPart) return;
                const id = idPart.split(/[/?#]/)[0];

                if (processed.has(id) || profileUsername !== author) return;

                const timeEl = tweet.querySelector('time');
                if (!timeEl) return;
                const d = new Date(timeEl.getAttribute('datetime'));

                const socialCtx = tweet.querySelector('[data-testid="socialContext"]');
                const isPinned = socialCtx && (socialCtx.textContent.toLowerCase().includes('pinned') || socialCtx.textContent.toLowerCase().includes('sabitlen'));

                if (!isPinned) {
                    if (d < oldest) oldest = d;
                    if (d < targetDate) { oldT++; return; }
                    else oldT = 0;
                }

                if (d >= targetDate) {
                    let target = (d >= sevenDaysAgo) ? stats.w1 : stats.w2;
                    foundNew = true;
                    processed.add(id);
                    const group = tweet.querySelector('[role="group"]');
                    if (group) {
                        const label = group.getAttribute('aria-label') || '';
                        const extract = (reg) => { const m = label.match(reg); return m ? parseInt(m[1].replace(/[,.]/g, ''), 10) || 0 : 0; };
                        const v = extract(/([\d.,]+)\s*(görüntülenme|views)/i);
                        const l = extract(/([\d.,]+)\s*(beğeni|beğenme|likes)/i);
                        const r = extract(/([\d.,]+)\s*(yanıt|replies)/i);
                        target.views += v; target.likes += l; target.replies += r;
                        const h = d.getHours(); hourly[h].c++; hourly[h].v += v; hourly[h].l += l;
                    }
                }
            });

            ui.updateUI(stats, processed.size, oldest, hourly);

            if (oldT >= 5 || stable >= 15) {
                clearInterval(window._xUltraPremium);
                ui.showFinishUI(stats, processed.size, () => {
                    daysToScan = 14;
                    targetDate = fourteenDaysAgo;
                    oldT = 0; stable = 0;
                    startScan();
                });
            } else {
                if (!foundNew) stable++; else stable = 0;
                window.scrollBy(0, window.innerHeight * 0.85);
            }
        }, 1500);
    };

    startScan();
})();
