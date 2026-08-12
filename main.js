// main.js
const { createClient } = require('@supabase/supabase-js');
const Sentry = require('@sentry/browser');
const posthog = require('posthog-js');
const lodash = require('lodash');
const tmp = require('tmp');
const undici = require('undici');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Initialize PostHog
posthog.init(process.env.POSTHOG_KEY, {
  api_host: process.env.POSTHOG_HOST,
  capture_pageview: true,
  capture_pageleave: true,
});

// Utility functions
function getTempDir() {
  return tmp.dirSync({ unsafeCleanup: true });
}

function fetchData(url) {
  return undici.fetch(url)
    .then(response => response.json());
}

// Export all functions
module.exports = {
  supabase,
  Sentry,
  posthog,
  lodash,
  getTempDir,
  fetchData
};