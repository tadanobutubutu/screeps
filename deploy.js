async function runDeploy(files, ptrToken, prodToken) {
    try {
        const modules = {};
        for (const m of files) {
            try {
                const filePath = validateFilePath(m.file);
                let content = await fs.promises.readFile(filePath, 'utf8');
                content = injectEnvVars(content);
                modules[m.name] = content;
            } catch (e) {
                const safeMessage = sanitizeLog(e.message);
                console.error(`  [ERROR] Failed to read ${m.file}: ${safeMessage}`);
                process.exit(1);
            }
        }
        await deployTo('PTR', '/ptr/api/user/code', ptrToken, modules);
        await deployTo('PROD', '/api/user/code', prodToken, modules);
    } catch (error) {
        const safeMessage = sanitizeLog(error.message);
        console.error('Deployment process failed:', safeMessage);
        process.exit(1);
    }
}

if (require.main === module) {
    runDeploy(files, process.env.SCREEPS_TOKEN, process.env.SCREEPS_PROD_TOKEN);
}

module.exports = { validateToken, validateFilePath, deployTo, injectEnvVars, sanitizeLog, runDeploy };