/* =========================================================
   SPIKEWATCH — VALORANT Champions Shanghai 2026
   Tek dosyalık demo mantığı: gerçek veri + localStorage.
   Gerçek bir "canlı" sürüm için aşağıdaki TODO notlarına bak.
   ========================================================= */

/* ---------- 1. VERİ ---------- */
// Takımlar: Champions Shanghai 2026'ya katılan 16 takım (gerçek).
// Kadro/koç alanları örnek amaçlıdır — kendi kaynaklarınla güncelleyebilirsin.
const TEAMS = [
  { id:'PRX', name:'Paper Rex', region:'Pacific', color:'#F2545B',
    players:[['mindfreak','Duelist'],['f0rsakeN','Flex'],['something','Initiator'],['d4v41','Sentinel'],['Jinggg','Duelist']],
    coach:'alecks' },
  { id:'TL', name:'Team Liquid', region:'EMEA', color:'#0D3B66',
    players:[['Jamppi','Duelist'],['Nivera','Initiator'],['soulcas','IGL'],['Sayf','Sentinel'],['Redgar','Controller']],
    coach:'sScary' },
  { id:'TYL', name:'TYLOO', region:'China', color:'#111827',
    players:[['Life','Sentinel'],['nobody','Duelist'],['Kiki','Initiator'],['Kv1n','Controller'],['CHICHOO','Flex']],
    coach:'Reduce' },
  { id:'G2', name:'G2 Esports', region:'Americas', color:'#E4002B',
    players:[['leaf','Duelist'],['JonahP','IGL'],['trent','Initiator'],['Ethan','Sentinel'],['Valyn','Controller']],
    coach:'Mini' },
  { id:'NRF', name:'Nongshim RedForce', region:'Pacific', color:'#C8102E',
    players:[['BuZz','Duelist'],['Rb','Controller'],['Foxy9','Initiator'],['ban','Sentinel'],['Zest','Flex']],
    coach:'termi' },
  { id:'NRG', name:'NRG', region:'Americas', color:'#000000',
    players:[['s0m','Duelist'],['Victor','Initiator'],['Ethan (N)','Sentinel'],['FiNESSE','Controller'],['crashies','Initiator']],
    coach:'reltuc' },
  { id:'XLG', name:'XLG Gaming', region:'China', color:'#7C3AED',
    players:[['ZmjjKK','Duelist'],['Life (X)','Sentinel'],['Smoggy','Initiator'],['BOOM','Controller'],['Zhz','Flex']],
    coach:'Rise' },
  { id:'KC', name:'Karmine Corp', region:'EMEA', color:'#005AFF',
    players:[['Kicks','Duelist'],['N4RRATE','IGL'],['Sayb','Initiator'],['Leo','Sentinel'],['Amsyaa','Controller']],
    coach:'popCorn' },
  { id:'GE', name:'Global Esports', region:'Pacific', color:'#F97316',
    players:[['Aria','Initiator'],['Alecs','Sentinel'],['SkRossi','IGL'],['syng','Duelist'],['Alecs2','Controller']],
    coach:'lurppis' },
  { id:'FNC', name:'Team Vitality', region:'EMEA', color:'#FFD200',
    players:[['Derke','Duelist'],['Boaster','IGL'],['Alfajer','Sentinel'],['Leo (V)','Controller'],['Zekken','Flex']],
    coach:'mini_bear' },
  { id:'EDG', name:'EDward Gaming', region:'China', color:'#8B0000',
    players:[['CHICHOO2','Duelist'],['ZmjjKK2','Initiator'],['nobody2','Sentinel'],['Smoggy2','Controller'],['Life2','Flex']],
    coach:'Chichoo Sr.' },
  { id:'LOUD', name:'LOUD', region:'Americas', color:'#00C853',
    players:[['aspas','Duelist'],['saadhak','IGL'],['tuyz','Sentinel'],['cauanzin','Initiator'],['Less','Controller']],
    coach:'zeek' },
  { id:'T1', name:'T1', region:'Pacific', color:'#E4002B',
    players:[['Sylvan','Duelist'],['iZu','Initiator'],['xeta','IGL'],['BuZz (T1)','Flex'],['Rb (T1)','Controller']],
    coach:'gumi' },
  { id:'100T', name:'100 Thieves', region:'Americas', color:'#B4171C',
    players:[['Cryocells','Duelist'],['Boostio','Flex'],['Bang','Sentinel'],['eeiu','Controller'],['Asuna','Duelist']],
    coach:'Hazed' },
  { id:'JDG', name:'JD Gaming', region:'China', color:'#DA291C',
    players:[['nobody3','Duelist'],['Kiki2','Initiator'],['CHICHOO3','Controller'],['Kv1n2','Sentinel'],['Life3','Flex']],
    coach:'Frank' },
  { id:'FUT', name:'FUT Esports', region:'EMEA', color:'#00A19A',
    players:[['MEMORY','Duelist'],['aproto','Initiator'],['qRaxs','Sentinel'],['aliverz','Controller'],['aproto2','IGL']],
    coach:'BAO' },
];

const teamById = id => TEAMS.find(t => t.id === id);

// Maçlar: Grup Aşaması takvimi (gerçek eşleşmeler, 24-27 Eylül 2026).
// time: ISO — cihazının saat dilimine göre gösterilir.
const MATCHES = [
  { id:'m1', a:'PRX', b:'TL',  group:'C', time:'2026-09-24T12:00:00Z' },
  { id:'m2', a:'TYL', b:'G2',  group:'C', time:'2026-09-24T15:00:00Z' },
  { id:'m3', a:'NRF', b:'NRG', group:'D', time:'2026-09-25T12:00:00Z' },
  { id:'m4', a:'XLG', b:'KC',  group:'D', time:'2026-09-25T15:00:00Z' },
  { id:'m5', a:'GE',  b:'FNC', group:'B', time:'2026-09-26T12:00:00Z' },
  { id:'m6', a:'EDG', b:'LOUD',group:'B', time:'2026-09-26T15:00:00Z' },
  { id:'m7', a:'T1',  b:'100T',group:'A', time:'2026-09-27T12:00:00Z' },
  { id:'m8', a:'JDG', b:'FUT', group:'A', time:'2026-09-27T15:00:00Z' },
];

const NEWS = [
  { tag:'Format', title:'VCT 2026\u2019da yol Champions Shanghai\u2019a kadar genişledi',
    body:'Riot Games bu sezon şehir sayısını ikiye katladı; Kickoff, Masters Santiago, Stage 1, Masters London ve Stage 2\u2019nin ardından kupa 24 Eylül – 18 Ekim arasında Şangay\u2019da sahiplenilecek.' },
  { tag:'Ödül Havuzu', title:'Şangay\u2019da 2.25 milyon dolarlık ödül havuzu', 
    body:'16 takımın mücadele edeceği dünya şampiyonasında toplam ödül havuzu 2.250.000 doları buluyor; şampiyon, sezonun en büyük payını cebine koyacak.' },
  { tag:'Path to Champions', title:'Challengers takımlarına Stage 2\u2019den doğrudan yol açıldı',
    body:'2026 formatında her bölge, Stage 2 play-off\u2019larına dört Challengers takımı daha kabul ediyor; bu da genç takımlara Champions\u2019a uzanan yeni bir kapı aralıyor.' },
  { tag:'Puan Sistemi', title:'Şampiyonluk Puanları bu sezon yeniden düzenlendi',
    body:'Kickoff\u2019tan Season Finals\u2019a kadar her etkinlik farklı ağırlıkta puan dağıtıyor; Champions kotası bu puanlarla birlikte Stage 2 play-off sonuçlarına göre belirleniyor.' },
];

/* ---------- 2. YARDIMCI FONKSİYONLAR ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function showToast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(showToast._h);
  showToast._h = setTimeout(()=> t.hidden = true, 2600);
}

function initials(name){
  return name.split(' ').map(w=>w[0]).join('').slice(0,3).toUpperCase();
}

function badgeHTML(teamId, size){
  const t = teamById(teamId);
  return `<span class="badge" style="background:${t.color}">${initials(t.name)}</span>`;
}

/* ---------- 3. MAÇ DURUMU + CANLI SKOR ----------
   TODO (gerçek sürüm): fetchLiveScore(matchId) fonksiyonunu kendi
   maç verisi kaynağınla (ör. Riot'un resmi esports API'si ya da
   kendi backend'inin bir maç istatistik servisi) değiştir ve
   setInterval yerine bir WebSocket / Server-Sent Events akışına bağla. */
const liveState = {}; // matchId -> {scoreA, scoreB, round}

function getMatchStatus(match, now = new Date()){
  const t = new Date(match.time);
  const diffMs = t - now;
  if (liveState[match.id] && liveState[match.id].forcedLive) return 'live';
  if (diffMs > 0) return 'upcoming';
  if (diffMs > -1000*60*70) return 'live'; // maç ~70dk içinde varsayılan olarak canlı kabul edilir
  return 'finished';
}

function ensureLiveState(matchId){
  if (!liveState[matchId]){
    liveState[matchId] = { scoreA: 0, scoreB: 0, round: 1, forcedLive:false };
  }
  return liveState[matchId];
}

function tickLiveScore(matchId){
  const s = ensureLiveState(matchId);
  if (s.round >= 13) return; // basit demo: 13 round'a kadar
  if (Math.random() < 0.55) s.scoreA++; else s.scoreB++;
  s.round++;
}

function fetchLiveScore(matchId){
  // Demo amaçlı yerel simülasyon. Gerçek entegrasyonda burada
  // await fetch('https://senin-api-adresin/matches/'+matchId) çağırılır.
  return ensureLiveState(matchId);
}

/* ---------- 4. MAÇLARIN RENDER EDİLMESİ ---------- */
let currentFilter = 'all';

function formatCountdown(ms){
  if (ms <= 0) return 'Başladı';
  const s = Math.floor(ms/1000);
  const d = Math.floor(s/86400);
  const h = Math.floor((s%86400)/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  if (d > 0) return `${d}g ${h}s ${m}d`;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function renderMatches(){
  const grid = $('#matchGrid');
  const now = new Date();
  const items = MATCHES.map(m => ({ m, status: getMatchStatus(m, now) }))
    .filter(x => currentFilter === 'all' ? true : x.status === currentFilter);

  if (!items.length){
    grid.innerHTML = `<p class="lb-empty">Bu filtrede maç yok.</p>`;
    return;
  }

  grid.innerHTML = items.map(({m, status}) => {
    const a = teamById(m.a), b = teamById(m.b);
    const dateLabel = new Date(m.time).toLocaleString('tr-TR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
    let scoreHTML = '<span class="mt-score" style="color:var(--muted);font-size:1rem;">vs</span>';
    let statusHTML = `<span class="match-status">${dateLabel}</span>`;

    if (status === 'live'){
      const s = fetchLiveScore(m.id);
      scoreHTML = `<span class="mt-score" data-live-score="${m.id}">${s.scoreA} : ${s.scoreB}</span>`;
      statusHTML = `<span class="match-status is-live"><span class="dot-live"></span>CANLI · Round ${s.round}</span>`;
    } else if (status === 'finished'){
      const s = liveState[m.id] || { scoreA: 13, scoreB: Math.floor(Math.random()*11) };
      scoreHTML = `<span class="mt-score">${s.scoreA} : ${s.scoreB}</span>`;
      statusHTML = `<span class="match-status">Tamamlandı</span>`;
    }

    return `
    <div class="match-card" data-match="${m.id}">
      ${statusHTML}
      <div class="match-teams">
        <div class="mt-team">${badgeHTML(m.a)}<span class="mt-name">${a.name}</span></div>
        ${scoreHTML}
        <div class="mt-team right">${badgeHTML(m.b)}<span class="mt-name">${b.name}</span></div>
      </div>
      <div class="match-group"><span>Grup ${m.group}</span><span>Champions Shanghai</span></div>
    </div>`;
  }).join('');
}

function renderNextMatch(){
  const now = new Date();
  const upcoming = MATCHES.filter(m => new Date(m.time) > now).sort((x,y)=> new Date(x.time)-new Date(y.time))[0];
  const box = $('#nextMatchBox');
  if (!upcoming){
    box.innerHTML = `<p>Grup aşamasındaki tüm maçlar tamamlandı.</p>`;
    return;
  }
  const a = teamById(upcoming.a), b = teamById(upcoming.b);
  box.innerHTML = `
    <div class="nm-teams">
      <div class="nm-team">${badgeHTML(upcoming.a)}<span class="mt-name">${a.name}</span></div>
      <span class="nm-vs">GRUP ${upcoming.group}</span>
      <div class="nm-team">${badgeHTML(upcoming.b)}<span class="mt-name">${b.name}</span></div>
    </div>
    <div class="nm-countdown" id="heroCountdown"></div>
    <div class="nm-meta">${new Date(upcoming.time).toLocaleString('tr-TR', { day:'2-digit', month:'long', hour:'2-digit', minute:'2-digit' })}</div>
  `;
  const cd = $('#heroCountdown');
  const update = () => { cd.textContent = formatCountdown(new Date(upcoming.time) - new Date()); };
  update();
  clearInterval(renderNextMatch._t);
  renderNextMatch._t = setInterval(update, 1000);
}

function renderTicker(){
  const track = $('#tickerTrack');
  const bits = MATCHES.map(m => {
    const a = teamById(m.a), b = teamById(m.b);
    const d = new Date(m.time).toLocaleDateString('tr-TR', { day:'2-digit', month:'short' });
    return `<span>${a.name} vs ${b.name} — Grup ${m.group} — ${d}</span>`;
  });
  track.innerHTML = bits.concat(bits).map(s=>s).join('');
}

$('#matchFilters').addEventListener('click', e => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  $$('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = btn.dataset.filter;
  renderMatches();
});

$('#demoLiveBtn').addEventListener('click', () => {
  const m = MATCHES[0];
  const s = ensureLiveState(m.id);
  s.forcedLive = true; s.round = 1; s.scoreA = 0; s.scoreB = 0;
  currentFilter = 'all';
  $$('.chip').forEach(c => c.classList.toggle('active', c.dataset.filter === 'all'));
  renderMatches();
  showToast(`Demo canlı yayın başladı: ${teamById(m.a).name} vs ${teamById(m.b).name}`);
  clearInterval(renderMatches._demo);
  renderMatches._demo = setInterval(() => {
    if (!liveState[m.id] || !liveState[m.id].forcedLive) return;
    tickLiveScore(m.id);
    renderMatches();
    if (liveState[m.id].round >= 13){
      liveState[m.id].forcedLive = false;
      clearInterval(renderMatches._demo);
      showToast('Demo maç sona erdi.');
      resolvePrediction(m.id);
      renderMatches();
      renderPredictions();
      renderLeaderboard();
    }
  }, 1800);
});

/* ---------- 5. TAKIMLAR ---------- */
function renderTeams(){
  $('#teamGrid').innerHTML = TEAMS.map(t => `
    <button class="team-card" data-team="${t.id}" type="button">
      ${badgeHTML(t.id)}
      <h4>${t.name}</h4>
      <span class="region">${t.region}</span>
    </button>`).join('');

  const sel = $('#regTeam');
  sel.innerHTML = TEAMS.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

$('#teamGrid').addEventListener('click', e => {
  const card = e.target.closest('.team-card');
  if (!card) return;
  const t = teamById(card.dataset.team);
  $('#teamModalBody').innerHTML = `
    <div class="tm-head">
      ${badgeHTML(t.id)}
      <div><h3>${t.name}</h3><span class="region">${t.region} — Champions Shanghai 2026</span></div>
    </div>
    <div class="tm-section-title">Kadro</div>
    <div class="tm-roster">
      ${t.players.map(([ign,role]) => `<div class="tm-player"><div class="ign">${ign}</div><div class="role">${role}</div></div>`).join('')}
    </div>
    <div class="tm-section-title">Koç</div>
    <div class="tm-coach">${t.coach}</div>
  `;
  $('#teamModalBackdrop').hidden = false;
});
$('#teamModalClose').addEventListener('click', () => $('#teamModalBackdrop').hidden = true);
$('#teamModalBackdrop').addEventListener('click', e => { if (e.target.id === 'teamModalBackdrop') $('#teamModalBackdrop').hidden = true; });

/* ---------- 6. HABERLER ---------- */
function renderNews(){
  $('#newsGrid').innerHTML = NEWS.map(n => `
    <article class="news-card">
      <span class="news-tag">${n.tag}</span>
      <h4>${n.title}</h4>
      <p>${n.body}</p>
    </article>`).join('');
}

/* ---------- 7. KİMLİK DOĞRULAMA (localStorage tabanlı demo) ----------
   ÖNEMLİ: Bu, gerçek bir güvenli kimlik doğrulama sistemi DEĞİLDİR.
   Şifreler sadece basitçe kodlanır ve tarayıcıda saklanır — bu yüzden
   hesaplar cihazlar arasında paylaşılmaz. Gerçek/çok kullanıcılı bir
   sistem için bir backend (ör. Node/Express + veritabanı, ya da
   Firebase/Supabase Auth) eklemen gerekir. TODO: login()/register()
   fonksiyonlarını gerçek bir API çağrısıyla değiştir. */
const AUTH_KEY = 'spikewatch_users_v1';
const SESSION_KEY = 'spikewatch_session_v1';

function loadUsers(){
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || {}; }
  catch { return {}; }
}
function saveUsers(users){ localStorage.setItem(AUTH_KEY, JSON.stringify(users)); }

function simpleHash(str){
  let h = 0;
  for (let i=0;i<str.length;i++){ h = (h<<5) - h + str.charCodeAt(i); h |= 0; }
  return String(h);
}

let currentUser = null; // { username, favTeam }

function register(username, password, favTeam, remember){
  const users = loadUsers();
  if (users[username]) throw new Error('Bu kullanıcı adı zaten alınmış.');
  users[username] = { passHash: simpleHash(password), favTeam, points: 0, predictions: {} };
  saveUsers(users);
  setSession(username, remember);
}

function login(username, password, remember){
  const users = loadUsers();
  const u = users[username];
  if (!u || u.passHash !== simpleHash(password)) throw new Error('Kullanıcı adı veya şifre hatalı.');
  setSession(username, remember);
}

function setSession(username, remember){
  currentUser = username;
  const store = remember ? localStorage : sessionStorage;
  store.setItem(SESSION_KEY, username);
  (remember ? sessionStorage : localStorage).removeItem(SESSION_KEY);
  refreshAuthUI();
}

function restoreSession(){
  currentUser = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  refreshAuthUI();
}

function logout(){
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  refreshAuthUI();
  showToast('Çıkış yapıldı.');
}

function getCurrentUserRecord(){
  if (!currentUser) return null;
  const users = loadUsers();
  return users[currentUser];
}

function updateCurrentUserRecord(mutator){
  const users = loadUsers();
  if (!users[currentUser]) return;
  mutator(users[currentUser]);
  saveUsers(users);
}

function refreshAuthUI(){
  const chip = $('#userChip');
  const loginBtn = $('#openLogin');
  const registerBtn = $('#openRegister');
  const gate = $('#predictionAuthGate');
  if (currentUser){
    const rec = getCurrentUserRecord();
    chip.hidden = false;
    loginBtn.hidden = true; registerBtn.hidden = true;
    $('#userChipName').textContent = currentUser;
    $('#userChipPts').textContent = `${rec ? rec.points : 0} pts`;
    gate.hidden = true;
  } else {
    chip.hidden = true;
    loginBtn.hidden = false; registerBtn.hidden = false;
    gate.hidden = false;
  }
  renderPredictions();
  renderLeaderboard();
}

/* modal controls */
function openModal(pane){
  $('#modalBackdrop').hidden = false;
  $('#loginPane').hidden = pane !== 'login';
  $('#registerPane').hidden = pane !== 'register';
}
function closeModal(){ $('#modalBackdrop').hidden = true; $('#loginError').hidden = true; $('#registerError').hidden = true; }

$('#openLogin').addEventListener('click', () => openModal('login'));
$('#openRegister').addEventListener('click', () => openModal('register'));
$('#gateLoginBtn').addEventListener('click', () => openModal('login'));
$('#gateRegisterBtn').addEventListener('click', () => openModal('register'));
$('#switchToRegister').addEventListener('click', () => openModal('register'));
$('#switchToLogin').addEventListener('click', () => openModal('login'));
$('#modalClose').addEventListener('click', closeModal);
$('#modalBackdrop').addEventListener('click', e => { if (e.target.id === 'modalBackdrop') closeModal(); });
$('#logoutBtn').addEventListener('click', logout);

$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  try{
    login($('#loginUser').value.trim(), $('#loginPass').value, $('#rememberMe').checked);
    closeModal();
    showToast(`Tekrar hoş geldin, ${currentUser}!`);
    e.target.reset();
  } catch(err){
    $('#loginError').textContent = err.message;
    $('#loginError').hidden = false;
  }
});

$('#registerForm').addEventListener('submit', e => {
  e.preventDefault();
  try{
    register($('#regUser').value.trim(), $('#regPass').value, $('#regTeam').value, $('#rememberMeReg').checked);
    closeModal();
    showToast(`Hoş geldin, ${currentUser}! Tahmin yapmaya başlayabilirsin.`);
    e.target.reset();
  } catch(err){
    $('#registerError').textContent = err.message;
    $('#registerError').hidden = false;
  }
});

/* ---------- 8. TAHMİN LİGİ ---------- */
function renderPredictions(){
  const grid = $('#predictGrid');
  const now = new Date();
  grid.innerHTML = MATCHES.map(m => {
    const status = getMatchStatus(m, now);
    const a = teamById(m.a), b = teamById(m.b);
    const rec = getCurrentUserRecord();
    const pick = rec ? rec.predictions[m.id] : null;
    const locked = status !== 'upcoming';
    const dateLabel = new Date(m.time).toLocaleString('tr-TR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });

    let resultLine = '';
    if (pick && pick.resolved){
      resultLine = `<div class="pc-result">${pick.correct ? '✓ Doğru tahmin — +10 puan' : '✗ Tahmin tutmadı'}</div>`;
    } else if (pick){
      resultLine = `<div class="pc-result" style="color:var(--gold)">Tahminin kaydedildi, sonuç bekleniyor…</div>`;
    }

    return `
    <div class="predict-card">
      <div class="pc-meta"><span>Grup ${m.group}</span><span>${dateLabel}</span></div>
      <div class="pc-options">
        <button class="pc-option ${pick && pick.winner===m.a ? 'selected':''} ${locked?'locked':''}" data-match="${m.id}" data-pick="${m.a}" ${!currentUser||locked?'disabled':''}>${a.name}</button>
        <button class="pc-option ${pick && pick.winner===m.b ? 'selected':''} ${locked?'locked':''}" data-match="${m.id}" data-pick="${m.b}" ${!currentUser||locked?'disabled':''}>${b.name}</button>
      </div>
      ${resultLine}
    </div>`;
  }).join('');
}

$('#predictGrid').addEventListener('click', e => {
  const btn = e.target.closest('.pc-option');
  if (!btn || btn.disabled) return;
  if (!currentUser){ openModal('login'); return; }
  const matchId = btn.dataset.match, pick = btn.dataset.pick;
  updateCurrentUserRecord(u => {
    u.predictions[matchId] = { winner: pick, resolved:false, correct:false };
  });
  showToast('Tahminin kaydedildi.');
  renderPredictions();
});

// Bir maç bittiğinde (demo simülasyonunda) o maça yapılmış tüm kullanıcı
// tahminlerini değerlendirip puan dağıtır.
function resolvePrediction(matchId){
  const s = liveState[matchId];
  if (!s) return;
  const winner = s.scoreA >= s.scoreB ? MATCHES.find(m=>m.id===matchId).a : MATCHES.find(m=>m.id===matchId).b;
  const users = loadUsers();
  Object.values(users).forEach(u => {
    const pick = u.predictions[matchId];
    if (pick && !pick.resolved){
      pick.resolved = true;
      pick.correct = pick.winner === winner;
      if (pick.correct) u.points += 10;
    }
  });
  saveUsers(users);
}

/* ---------- 9. SIRALAMA ---------- */
function renderLeaderboard(){
  const users = loadUsers();
  const rows = Object.entries(users)
    .map(([name, u]) => ({ name, team: teamById(u.favTeam)?.name || '—', points: u.points }))
    .sort((a,b) => b.points - a.points);

  const box = $('#leaderboard');
  if (!rows.length){
    box.innerHTML = `<p class="lb-empty">Henüz kayıtlı kullanıcı yok — ilk tahmini yapan sen ol!</p>`;
    return;
  }
  box.innerHTML = rows.map((r,i) => `
    <div class="lb-row ${r.name===currentUser?'me':''}">
      <span class="lb-rank">#${i+1}</span>
      <span class="lb-name">${r.name}</span>
      <span class="lb-team">${r.team}</span>
      <span class="lb-pts">${r.points} pts</span>
    </div>`).join('');
}

/* ---------- 10. NAV / GENEL ---------- */
$('#navToggle').addEventListener('click', () => {
  const nav = $('#mainNav');
  const open = nav.classList.toggle('open');
  $('#navToggle').setAttribute('aria-expanded', open);
});
$$('.main-nav a').forEach(a => a.addEventListener('click', () => $('#mainNav').classList.remove('open')));

/* ---------- 11. BAŞLAT ---------- */
function init(){
  renderTicker();
  renderNextMatch();
  renderTeams();
  renderMatches();
  renderNews();
  restoreSession();
  renderPredictions();
  renderLeaderboard();
  setInterval(renderMatches, 15000); // canlı olmayan durumlarda genel yenileme
}
document.addEventListener('DOMContentLoaded', init);
