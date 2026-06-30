/**
 * daily-challenge.js - 日替わりチャレンジシステム
 * 毎日異なる目標をプレイヤーに提供します。
 */

const logger = require('utils.logging');

const CHALLENGES = [
    { id: 'harvest_energy', text: 'エネルギーを 5000 収穫する', target: 5000, metric: 'harvest' },
    { id: 'build_structures', text: '建造物を 5 個完成させる', target: 5, metric: 'build' },
    {
        id: 'upgrade_controller',
        text: 'コントローラーを 2000 回アップグレードする',
        target: 2000,
        metric: 'upgrade',
    },
];

const dailyChallenge = {
    /**
     * 現在のチャレンジを取得または生成する
     */
    getChallenge: function () {
        const today = new Date().toISOString().split('T')[0];

        if (!Memory.dailyChallenge || Memory.dailyChallenge.date !== today) {
            const randomIndex = Math.floor(Math.random() * CHALLENGES.length);
            Memory.dailyChallenge = {
                date: today,
                challenge: CHALLENGES[randomIndex],
                progress: 0,
                completed: false,
            };
        }

        return Memory.dailyChallenge;
    },

    /**
     * 進捗を記録する (DEPRECATED: Use updateProgress instead)
     */
    recordProgress: function (metric, amount) {
        this.updateProgress(metric, amount);
    },

    /**
     * 進捗を更新する
     */
    updateProgress: function (metric, amount) {
        if (isNaN(amount) || !isFinite(amount)) return;

        const challenge = this.getChallenge();
        const sanitizedMetric = String(metric).toLowerCase();
        const numericAmount = Number(amount) || 0;

        if (challenge.challenge.metric === sanitizedMetric && !challenge.completed) {
            challenge.progress += numericAmount;

            if (challenge.progress >= challenge.challenge.target) {
                challenge.completed = true;
                logger.success(`Daily Challenge Completed: ${challenge.challenge.text}`);
            }
        }
    },

    /**
     * チャレンジステータスの表示
     */
    displayChallenge: function () {
        const challenge = this.getChallenge();
        const c = challenge.challenge;
        const percent = Math.min(100, Math.floor((challenge.progress / c.target) * 100));

        console.log(`--- Daily Challenge: ${c.text} ---`);
        console.log(`Progress: ${challenge.progress} / ${c.target} (${percent}%)`);

        if (challenge.completed) {
            console.log('Status: COMPLETED ✅');
        }
    },
};

module.exports = dailyChallenge;
