class GameConfig {
    static STORAGE_KEYS = {
        GAME: 'cc_game_v2',
        UNLOCKED_SET: 'unlocked_set',
        UNLOCKED_ORDER: 'unlocked_order',
        CURRENT_WORLD: 'current_world_key',
        MINIGAME_HIGHSCORE: 'minigame_highscore'
    };

    static UPGRADES = [
        { cost: 10, clickInc: 1, autoInc: 1, unlockLevel: 50, themeIndex: 0 },
        { cost: 50, clickInc: 2, autoInc: 5, unlockLevel: 100, themeIndex: 1 },
        { cost: 100, clickInc: 3, autoInc: 10, unlockLevel: 150, themeIndex: 2 },
        { cost: 1000, clickInc: 5, autoInc: 100, unlockLevel: 200, themeIndex: 3 },
        { cost: 2000, clickInc: 10, autoInc: 200, unlockLevel: 250, themeIndex: 4 },
        { cost: 10000, clickInc: 20, autoInc: 1000, unlockLevel: 300, themeIndex: 5 },
        { cost: 50000, clickInc: 50, autoInc: 5000, unlockLevel: 350, themeIndex: 6 },
        { cost: 100000, clickInc: 100, autoInc: 10000, unlockLevel: 400, themeIndex: 7 }
    ];

    static THEMES = [
        { name: 'Bank' },
        { name: 'Exchange' },
        { name: 'Global Trade' },
        { name: 'Stock Market' },
        { name: 'Tax' },
        { name: 'Wallet' },
        { name: 'Bitcoin' },
        { name: 'Investment' }
    ];

    static WORLDS = {
        default: {
            key: 'default',
            title: 'Normal',
            coin: 'https://customer-assets.emergentagent.com/job_coinmaster-6/artifacts/b9uezldl_Coin.png',
            bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            themeIndex: -1,
            message: '🎮 Welcome to Coin Clicker!'
        },
        cake: {
            key: 'cake',
            title: 'Cake World',
            coin: '🍰',
            bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            themeIndex: 0,
            message: '🎉 Cake World unlocked! 🍰'
        },
        diamond: {
            key: 'diamond',
            title: 'Diamond World',
            coin: 'https://customer-assets.emergentagent.com/job_coinmaster-6/artifacts/dqnn4al1_Diamond.png',
            bg: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
            themeIndex: 1,
            message: '💎 Diamond World unlocked!'
        },
        galaxy: {
            key: 'galaxy',
            title: 'Galaxy World',
            coin: 'https://customer-assets.emergentagent.com/job_coinmaster-6/artifacts/qvu15qzq_galaxy.png',
            bg: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            themeIndex: 2,
            message: '🌌 Galaxy World unlocked!'
        },
        crown: {
            key: 'crown',
            title: 'Royal World',
            coin: 'https://customer-assets.emergentagent.com/job_coinmaster-6/artifacts/efugn7sv_crown.png',
            bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
            themeIndex: 3,
            message: '👑 Royal World unlocked!'
        },
        soccer: {
            key: 'soccer',
            title: 'Soccer World',
            coin: '⚽',
            bg: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
            themeIndex: 4,
            message: '⚽ Soccer World unlocked!'
        },
        arcade: {
            key: 'arcade',
            title: 'Arcade World',
            coin: 'https://customer-assets.emergentagent.com/job_coinmaster-6/artifacts/he8tvav6_arcade.png',
            bg: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
            themeIndex: 5,
            message: '🕹️ Arcade World unlocked!'
        },
        death: {
            key: 'death',
            title: 'Death World',
            coin: '☠️',
            bg: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
            themeIndex: 6,
            message: '☠️ Death World unlocked! The Final Stage!'
        },
        angel: {
            key: 'angel',
            title: 'Heaven World',
            coin: '😇',
            bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            themeIndex: 7,
            message: '😇 Heaven World unlocked! Ascension achieved!'
        }
    };

    static WORLD_ORDER = ['default', 'cake', 'diamond', 'galaxy', 'crown', 'soccer', 'arcade', 'death', 'angel'];

    static PARTICLE_CLASSES = [
        'cake-particle',
        'diamond-particle',
        'galaxy-particle',
        'crown-particle',
        'soccer-particle',
        'arcade-particle',
        'death-particle',
        'angel-particle'
    ];

    static getWorldByIndex(index) {
        return this.WORLDS[this.WORLD_ORDER[index + 1]];
    }

    static getParticleClass(themeIndex) {
        return this.PARTICLE_CLASSES[themeIndex] || 'coin-particle';
    }
}

class CoinClickerGame {
    constructor() {
        this.coins = 0;
        this.clickPower = 1;
        this.upgradeCounts = Array(8).fill(0);
        this.autoIncrement = Array(8).fill(0);
        this.unlockedWorlds = new Set(['default']);
        this.unlockedOrder = ['default'];
        this.currentWorld = 'default';
        this.autoInterval = null;

        this.loadGame();
        this.reconcileUnlocks();
        this.startAutoIncrement();
        this.renderAll();
        this.attachEventListeners();
    }

    loadGame() {
        const raw = localStorage.getItem(GameConfig.STORAGE_KEYS.GAME);
        if (raw) {
            const data = JSON.parse(raw);
            this.coins = Number(data.coins || 0);
            this.upgradeCounts = Array.isArray(data.counts) ? data.counts.map(Number) : Array(8).fill(0);
        }

        const unlockedRaw = localStorage.getItem(GameConfig.STORAGE_KEYS.UNLOCKED_SET);
        if (unlockedRaw) this.unlockedWorlds = new Set(JSON.parse(unlockedRaw));

        const orderRaw = localStorage.getItem(GameConfig.STORAGE_KEYS.UNLOCKED_ORDER);
        if (orderRaw) this.unlockedOrder = JSON.parse(orderRaw);

        this.currentWorld = localStorage.getItem(GameConfig.STORAGE_KEYS.CURRENT_WORLD) || 'default';
        this.recalculate();
    }

    saveGame() {
        localStorage.setItem(GameConfig.STORAGE_KEYS.GAME, JSON.stringify({
            coins: this.coins,
            counts: this.upgradeCounts
        }));
        localStorage.setItem(GameConfig.STORAGE_KEYS.UNLOCKED_SET, JSON.stringify([...this.unlockedWorlds]));
        localStorage.setItem(GameConfig.STORAGE_KEYS.UNLOCKED_ORDER, JSON.stringify(this.unlockedOrder));
        localStorage.setItem(GameConfig.STORAGE_KEYS.CURRENT_WORLD, this.currentWorld);
    }

    reconcileUnlocks() {
        const allowed = new Set(['default']);
        GameConfig.UPGRADES.forEach((u, i) => {
            if (this.upgradeCounts[i] >= u.unlockLevel) {
                const w = GameConfig.getWorldByIndex(i);
                if (w) allowed.add(w.key);
            }
        });

        this.unlockedOrder = this.unlockedOrder.filter(w => allowed.has(w));
        if (this.unlockedOrder.length === 0) this.unlockedOrder = ['default'];
        this.unlockedWorlds = allowed;

        if (!allowed.has(this.currentWorld)) this.currentWorld = 'default';
        this.saveGame();
    }

    recalculate() {
        this.clickPower = 1 + GameConfig.UPGRADES.reduce((t, u, i) => t + u.clickInc * this.upgradeCounts[i], 0);
        this.autoIncrement = GameConfig.UPGRADES.map((u, i) => u.autoInc * this.upgradeCounts[i]);
    }

    startAutoIncrement() {
        clearInterval(this.autoInterval);
        this.autoInterval = setInterval(() => {
            const total = this.autoIncrement.reduce((a, b) => a + b, 0);
            if (total > 0) {
                this.coins += total;
                this.updateUI();
            }
        }, 1000);
    }

    click() {
        this.coins += this.clickPower;
        this.updateUI();
        this.spawnEffects();
    }

    buyUpgrade(i) {
        const u = GameConfig.UPGRADES[i];
        if (!u || this.coins < u.cost) return;

        this.coins -= u.cost;
        this.upgradeCounts[i]++;
        this.recalculate();

        if (this.upgradeCounts[i] === u.unlockLevel) {
            const w = GameConfig.getWorldByIndex(i);
            if (w && !this.unlockedWorlds.has(w.key)) {
                this.unlockedWorlds.add(w.key);
                this.unlockedOrder.push(w.key);
                this.showAchievement(w.message);
                this.currentWorld = w.key;
                this.applyWorld(w);
                this.renderWorlds();
            }
        }

        this.saveGame();
        this.updateUI();
    }

    applyWorld(w) {
        document.body.style.background = w.bg;
        document.getElementById('worldTitle').textContent = w.title;
        this.renderCoin();
    }

    setWorld(key) {
        if (!this.unlockedWorlds.has(key)) return;
        this.currentWorld = key;
        this.applyWorld(GameConfig.WORLDS[key]);
        this.renderWorlds();
        this.saveGame();
    }

    reset() {
        if (!confirm('Weet je zeker dat je alles wilt resetten?')) return;

        this.coins = 0;
        this.upgradeCounts = Array(8).fill(0);
        this.unlockedWorlds = new Set(['default']);
        this.unlockedOrder = ['default'];
        this.currentWorld = 'default';

        this.recalculate();
        this.saveGame();
        this.applyWorld(GameConfig.WORLDS.default);
        this.renderAll();
        this.showAchievement('🔄 Progress gereset!');
    }

    spawnEffects() {
        const coin = document.getElementById('coinElement');
        const r = coin.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;

        const text = document.createElement('div');
        text.className = 'floating-text';
        text.textContent = `+${this.clickPower}`;
        text.style.left = `${x}px`;
        text.style.top = `${y}px`;
        document.body.appendChild(text);
        setTimeout(() => text.remove(), 900);

        const w = GameConfig.WORLDS[this.currentWorld];
        const cls = GameConfig.getParticleClass(w.themeIndex);

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.className = cls;
                const a = Math.random() * Math.PI * 2;
                const d = 40 + Math.random() * 30;
                p.style.left = `${x + Math.cos(a) * d}px`;
                p.style.top = `${y + Math.sin(a) * d}px`;
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 800);
            }, i * 20);
        }
    }

    showAchievement(msg) {
        const old = document.getElementById('achievementPopup');
        if (old) old.remove();

        const p = document.createElement('div');
        p.id = 'achievementPopup';
        p.className = 'achievement-popup';
        p.textContent = msg;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 2000);
    }

    updateUI() {
        document.getElementById('coinCounter').textContent =
            `Coins: ${Math.floor(this.coins)} (+${this.clickPower} per klik)`;

        GameConfig.UPGRADES.forEach((u, i) => {
            const btn = document.getElementById(`upgrade-btn-${i}`);
            const c = document.getElementById(`upgrade-count-${i}`);
            if (btn) btn.disabled = this.coins < u.cost;
            if (c) c.textContent = this.upgradeCounts[i];
        });
    }

    renderCoin() {
        const el = document.getElementById('coinElement');
        const w = GameConfig.WORLDS[this.currentWorld];
        const emoji = w.coin.length < 10;

        el.innerHTML = emoji
            ? `<div class="coin-emoji">${w.coin}</div>`
            : `<img src="${w.coin}" alt="Coin" class="coin-icon">`;

        el.onclick = () => this.click();
    }

    renderUpgrades() {
        const grid = document.getElementById('upgradesGrid');
        grid.innerHTML = '';

        GameConfig.UPGRADES.forEach((u, i) => {
            const t = GameConfig.THEMES[u.themeIndex];
            const card = document.createElement('div');
            card.className = 'upgrade-card';

            card.innerHTML = `
                <div class="upgrade-header">
                    <div class="upgrade-name">${t.name}</div>
                    <div class="upgrade-count" id="upgrade-count-${i}">${this.upgradeCounts[i]}</div>
                </div>
                <div class="upgrade-stats">
                    <div>👆 Click: +${u.clickInc}</div>
                    <div>⏱️ Auto: +${u.autoInc}/s</div>
                    <div class="unlock-info">Unlock: ${u.unlockLevel}</div>
                </div>
                <button class="upgrade-button" id="upgrade-btn-${i}">${u.cost} coins</button>
            `;

            card.querySelector(`#upgrade-btn-${i}`).onclick = () => this.buyUpgrade(i);
            grid.appendChild(card);
        });
    }

    renderWorlds() {
        const grid = document.getElementById('worldsGrid');
        grid.innerHTML = '';

        this.unlockedOrder.forEach(key => {
            const w = GameConfig.WORLDS[key];
            if (!w) return;

            const active = key === this.currentWorld;
            const emoji = w.coin.length < 10;

            const btn = document.createElement('button');
            btn.className = 'world-button' + (active ? ' active' : '');
            btn.innerHTML = `
                <div class="world-icon">${emoji ? w.coin : `<img src="${w.coin}" alt="${w.title}">`}</div>
                <div class="world-name">${w.title}</div>
            `;
            btn.onclick = () => this.setWorld(key);

            grid.appendChild(btn);
        });
    }

    renderAll() {
        this.renderCoin();
        this.renderUpgrades();
        this.renderWorlds();
        this.updateUI();
        this.applyWorld(GameConfig.WORLDS[this.currentWorld]);
    }

    attachEventListeners() {
        document.getElementById('btnReset').onclick = () => this.reset();
        document.getElementById('btnMinigame').onclick = () => new MiniGameModal().show();
    }
}

class MiniGameModal {
    constructor() {
        this.score = 0;
        this.timeLeft = 60;
        this.isPlaying = false;
        this.highscore = Number(localStorage.getItem(GameConfig.STORAGE_KEYS.MINIGAME_HIGHSCORE) || 0);
        this.timerInterval = null;
    }

    show() {
        this.score = 0;
        this.timeLeft = 60;
        this.isPlaying = true;

        const modal = document.getElementById('minigameModal');
        modal.classList.add('active');

        document.getElementById('minigamePlay').style.display = 'block';
        document.getElementById('minigameResults').style.display = 'none';

        this.updateUI();
        this.startTimer();

        document.getElementById('minigameCoin').onclick = () => this.handleClick();
        document.getElementById('btnReturn').onclick = () => this.close();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById('minigameTimer').textContent = this.timeLeft;
            if (this.timeLeft <= 0) this.endGame();
        }, 1000);
    }

    handleClick() {
        if (!this.isPlaying) return;
        this.score++;
        this.updateUI();
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);

        if (this.score > this.highscore) {
            this.highscore = this.score;
            localStorage.setItem(GameConfig.STORAGE_KEYS.MINIGAME_HIGHSCORE, this.highscore);
            document.getElementById('newHighscoreMsg').style.display = 'block';
        } else {
            document.getElementById('newHighscoreMsg').style.display = 'none';
        }

        document.getElementById('minigamePlay').style.display = 'none';
        document.getElementById('minigameResults').style.display = 'block';

        document.getElementById('finalScore').textContent = `Jouw score: ${this.score}`;
        document.getElementById('finalHighscore').textContent = `Highscore: ${this.highscore}`;
    }

    updateUI() {
        document.getElementById('minigameScore').textContent = `Score: ${this.score}`;
    }

    close() {
        clearInterval(this.timerInterval);
        document.getElementById('minigameModal').classList.remove('active');
    }
}

window.addEventListener('DOMContentLoaded', () => new CoinClickerGame());
