class GameConfig {
    static STORAGE_KEYS = {
        GAME: 'cc_game_v2',
        UNLOCKED_SET: 'unlocked_set',
        UNLOCKED_ORDER: 'unlocked_order',
        CURRENT_WORLD: 'current_world_key',
        MINIGAME_HIGHSCORE: 'minigame_highscore'
    }; 

    static UPGRADES = [
        {
            cost: 10,
            clickInc: 1,
            autoInc: 1,
            unlockLevel: 50,
            themeIndex: 0
        },
        {
            cost: 50,
            clickInc: 2,
            autoInc: 5,
            unlockLevel: 100,
            themeIndex: 1
        },
        {
            cost: 100,
            clickInc: 3,
            autoInc: 10,
            unlockLevel: 150,
            themeIndex: 2
        },
        {
            cost: 1000,
            clickInc: 5,
            autoInc: 100,
            unlockLevel: 200,
            themeIndex: 3
        },
        {
            cost: 2000,
            clickInc: 10,
            autoInc: 200,
            unlockLevel: 250,
            themeIndex: 4
        },
        {
            cost: 10000,
            clickInc: 20,
            autoInc: 1000,
            unlockLevel: 300,
            themeIndex: 5
        },
        {
            cost: 50000,
            clickInc: 50,
            autoInc: 5000,
            unlockLevel: 350,
            themeIndex: 6
        },
        {
            cost: 100000,
            clickInc: 100,
            autoInc: 10000,
            unlockLevel: 400,
            themeIndex: 7
        }
    ];

    static THEMES = [
        {
            name: 'Bank'
        },
        {
            name: 'Exchange'
        },
        {
            name: 'Global Trade'
        },
        {
            name: 'Stock Market'
        },
        {
            name: 'Tax'
        },
        {
            name: 'Wallet'
        },
        {
            name: 'Bitcoin'
        },
        {
            name: 'Investment'
        }
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
        const worldKey = this.WORLD_ORDER[index + 1];
        return this.WORLDS[worldKey];
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
            try {
                const data = JSON.parse(raw);
                this.coins = Number(data.coins || 0);
                this.upgradeCounts = Array.isArray(data.counts) ? data.counts.map(n => Number(n)) : Array(8).fill(0);
            } catch (e) {
                console.error('Failed to load game:', e);
            }
        }

        const unlockedRaw = localStorage.getItem(GameConfig.STORAGE_KEYS.UNLOCKED_SET);
        if (unlockedRaw) this.unlockedWorlds = new Set(JSON.parse(unlockedRaw));

        const orderRaw = localStorage.getItem(GameConfig.STORAGE_KEYS.UNLOCKED_ORDER);
        if (orderRaw) this.unlockedOrder = JSON.parse(orderRaw);

        this.currentWorld = localStorage.getItem(GameConfig.STORAGE_KEYS.CURRENT_WORLD) || 'default';
        this.recalculate();
    }

    saveGame() {
        const data = {
            coins: this.coins,
            counts: this.upgradeCounts
        };
        localStorage.setItem(GameConfig.STORAGE_KEYS.GAME, JSON.stringify(data));
        localStorage.setItem(GameConfig.STORAGE_KEYS.UNLOCKED_SET, JSON.stringify(Array.from(this.unlockedWorlds)));
        localStorage.setItem(GameConfig.STORAGE_KEYS.UNLOCKED_ORDER, JSON.stringify(this.unlockedOrder));
        localStorage.setItem(GameConfig.STORAGE_KEYS.CURRENT_WORLD, this.currentWorld);
    }

    reconcileUnlocks() {
        const allowed = new Set(['default']);
        GameConfig.UPGRADES.forEach((upgrade, index) => {
            if (this.upgradeCounts[index] >= upgrade.unlockLevel) {
                const world = GameConfig.getWorldByIndex(index);
                if (world) allowed.add(world.key);
            }
        });

        this.unlockedOrder = this.unlockedOrder.filter(key => allowed.has(key));
        if (!this.unlockedOrder.length) this.unlockedOrder = ['default'];
        this.unlockedWorlds = allowed;

        if (!allowed.has(this.currentWorld)) this.currentWorld = 'default';
        this.saveGame();
    }

    recalculate() {
        this.clickPower = 1 + GameConfig.UPGRADES.reduce((sum, upgrade, i) =>
            sum + upgrade.clickInc * this.upgradeCounts[i], 0
        );
        this.autoIncrement = GameConfig.UPGRADES.map((upgrade, i) =>
            upgrade.autoInc * this.upgradeCounts[i]
        );
    }

    startAutoIncrement() {
        if (this.autoInterval) clearInterval(this.autoInterval);
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

    buyUpgrade(index) {
        const upgrade = GameConfig.UPGRADES[index];
        if (!upgrade || this.coins < upgrade.cost) return;

        this.coins -= upgrade.cost;
        this.upgradeCounts[index]++;
        this.recalculate();

        if (this.upgradeCounts[index] === upgrade.unlockLevel) {
            const world = GameConfig.getWorldByIndex(index);
            if (world && !this.unlockedWorlds.has(world.key)) {
                this.unlockedWorlds.add(world.key);
                this.unlockedOrder.push(world.key);
                this.showAchievement(world.message);
                this.currentWorld = world.key;
                this.applyWorld(world);
                this.renderWorlds();
            }
        }

        this.saveGame();
        this.updateUI();
    }

    applyWorld(world) {
        document.body.style.background = world.bg;
        document.getElementById('worldTitle').textContent = world.title;
        this.renderCoin();
    }

    setWorld(worldKey) {
        if (!this.unlockedWorlds.has(worldKey)) return;

        this.currentWorld = worldKey;
        this.applyWorld(GameConfig.WORLDS[worldKey]);
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
        const coinEl = document.getElementById('coinElement');
        const rect = coinEl.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const text = document.createElement('div');
        text.className = 'floating-text';
        text.textContent = `+${this.clickPower}`;
        text.style.left = x + 'px';
        text.style.top = y + 'px';
        document.body.appendChild(text);
        setTimeout(() => text.remove(), 900);
        const world = GameConfig.WORLDS[this.currentWorld];
        const particleClass = GameConfig.getParticleClass(world.themeIndex);
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = particleClass;
                const angle = Math.random() * 2 * Math.PI;
                const distance = 40 + Math.random() * 30;
                particle.style.left = (x + Math.cos(angle) * distance) + 'px';
                particle.style.top = (y + Math.sin(angle) * distance) + 'px';
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 800);
            }, i * 20);
        }
    }

    showAchievement(message) {
        const existing = document.getElementById('achievementPopup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'achievementPopup';
        popup.className = 'achievement-popup';
        popup.textContent = message;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 2000);
    }

    updateUI() {
        const coinCounter = document.getElementById('coinCounter');
        coinCounter.textContent = `Coins: ${Math.floor(this.coins)} (+${this.clickPower} per klik)`;

        GameConfig.UPGRADES.forEach((upgrade, index) => {
            const btn = document.getElementById(`upgrade-btn-${index}`);
            const count = document.getElementById(`upgrade-count-${index}`);
            if (btn) btn.disabled = this.coins < upgrade.cost;
            if (count) count.textContent = this.upgradeCounts[index];
        });
    }

    renderCoin() {
        const coinEl = document.getElementById('coinElement');
        const world = GameConfig.WORLDS[this.currentWorld];
        const isEmoji = world.coin.length < 10;

        if (isEmoji) coinEl.innerHTML = `<div class="coin-emoji">${world.coin}</div>`;
        else coinEl.innerHTML = `<img src="${world.coin}" alt="Coin" class="coin-icon">`;

        coinEl.onclick = () => this.click();
    }

    renderUpgrades() {
        const grid = document.getElementById('upgradesGrid');
        grid.innerHTML = '';

        GameConfig.UPGRADES.forEach((upgrade, index) => {
            const theme = GameConfig.THEMES[upgrade.themeIndex];
            const card = document.createElement('div');
            card.className = 'upgrade-card';
            card.innerHTML = `
                <div class="upgrade-header">
                    <div class="upgrade-name">${theme.name}</div>
                    <div class="upgrade-count" id="upgrade-count-${index}">${this.upgradeCounts[index]}</div>
                </div>
                <div class="upgrade-stats">
                    <div>👆 Click: +${upgrade.clickInc}</div>
                    <div>⏱️ Auto: +${upgrade.autoInc}/s</div>
                    <div class="unlock-info">Unlock: ${upgrade.unlockLevel}</div>
                </div>
                <button class="upgrade-button" id="upgrade-btn-${index}">${upgrade.cost} coins</button>
            `;
            const btn = card.querySelector(`#upgrade-btn-${index}`);
            btn.onclick = () => this.buyUpgrade(index);
            grid.appendChild(card);
        });
    }

    renderWorlds() {
        const grid = document.getElementById('worldsGrid');
        grid.innerHTML = '';
        this.unlockedOrder.forEach(key => {
            const world = GameConfig.WORLDS[key];
            if (!world) return;

            const isEmoji = world.coin.length < 10;
            const isActive = key === this.currentWorld;
            const btn = document.createElement('button');
            btn.className = 'world-button' + (isActive ? ' active' : '');
            btn.innerHTML = `<div class="world-icon">${isEmoji ? world.coin : `<img src="${world.coin}" alt="${world.title}">`}</div>
                             <div class="world-name">${world.title}</div>`;
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
        } else document.getElementById('newHighscoreMsg').style.display = 'none';

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

