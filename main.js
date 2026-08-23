const axios = require('axios');
const https = require('https');

async function fetchData(url, headers = {}, params = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...headers
    };

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    try {
        const response = await axios.get(url, {
            headers: defaultHeaders,
            params: params,
            httpsAgent: agent
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error.message);
        return null;
    }
}

async function postData(url, data, headers = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...headers
    };

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    try {
        const response = await axios.post(url, data, {
            headers: defaultHeaders,
            httpsAgent: agent
        });
        return response.data;
    } catch (error) {
        console.error(`Error posting data to ${url}:`, error.message);
        return null;
    }
}

module.exports = {
    fetchData,
    postData
};