# PR Description

This pull request introduces the following changes and updates to the Screeps bot:

1. Error handling for API requests: The bot will now handle a 402 Payment Required error and print a meaningful error message to the console.

2. Deprecation notice: A notice is given regarding the deprecation of the Pollinations legacy text API for authenticated users. The bot will be updated to use the new API at https://enter.pollinations.ai for better performance and access to all the latest models.

3. Improved error messages: Detailed error messages are provided to give developers more context about the issue that occurred. In this case, the error message includes the cost of the request, the remaining balance on the API key, and the timestamp of the error.

**Remember to update the requirements and dependencies of the bot to include any necessary changes for the new API.**