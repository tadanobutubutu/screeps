const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const { a11y } = require('@accessible/react');
const fastMap = require('fast-map');
const accessiblyHelper = require('./accessibly-helper');

const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100
};

export const checkUserSafety = () => {
    let userSafetyMessage = '';

    if (userSafety !== 'safe') {
        userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
    }

    return userSafetyMessage;
};

export const checkSafetyCategories = () => {
    let safetyCategoriesMessage = '';

    if (safetyCategories.includes('Unauthorized Advice')) {
        safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
    }

    return safetyCategoriesMessage;
};

export const addLangAttribute = (html) => {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
    });
};

const userSafety = 'unsafe';
const safetyCategories = 'Unauthorized Advice, Needs Caution';

const spawn = require('child_process').spawn;

async function spawnProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const defaultOptions = {
            cwd: process.cwd(),
            env: process.env,
            shell: true,
            timeout: 30000
        };

        const spawnOptions = { ...defaultOptions, ...options };
        let stdout = '';
        let stderr = '';
        let timeoutId;

        const child = spawn(command, args, spawnOptions);

        if (spawnOptions.timeout) {
            timeoutId = setTimeout(() => {
                child.kill('SIGTERM');
                reject(new Error(`Process timed out after ${spawnOptions.timeout}ms`));
            }, spawnOptions.timeout);
        }

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', (error) => {
            if (timeoutId) clearTimeout(timeoutId);
            reject(error);
        });

        child.on('close', (exitCode) => {
            if (timeoutId) clearTimeout(timeoutId);
            resolve({ stdout, stderr, exitCode });
        });
    });
}

async function spawnConcurrent(tasks, concurrency = 3) {
    const results = [];
    const executing = [];

    for (const task of tasks) {
        const promise = spawnProcess(task.command, task.args, task.options)
            .then((result) => {
                results.push({ success: true, ...result });
                return result;
            })
            .catch((error) => {
                results.push({ success: false, error: error.message });
                throw error;
            });

        executing.push(promise);

        if (executing.length >= concurrency) {
            await Promise.race(executing);
            executing.splice(executing.findIndex(p => p === promise), 1);
        }
    }

    return results;
}

module.exports = {
    ...module.exports, // Include the existing exports
    spawnProcess, // Export the spawning logic function
    spawnConcurrent // Export concurrent spawning function
};