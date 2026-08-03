// login.test.js
const puppeteer = require('puppeteer');

describe('Login functionality', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should allow a user to log in with valid credentials', async () => {
    const username = 'testuser';
    const password = 'testpassword';
    const url = 'http://localhost:3000/login'; // Replace with your application's URL

    await page.goto(url);

    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');

    const isUserLoggedIn = await page.evaluate(() => {
      return document.body.textContent.includes('Welcome, testuser!');
    });

    expect(isUserLoggedIn).toBe(true);
  });

  it('should not allow a user to log in with invalid credentials', async () => {
    const username = 'testuser';
    const password = 'wrongpassword';
    const url = 'http://localhost:3000/login';

    await page.goto(url);

    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');

    const isUserLoggedIn = await page.evaluate(() => {
      return document.body.textContent.includes('Welcome, testuser!');
    });

    expect(isUserLoggedIn).toBe(false);
  });
});