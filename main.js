function isStargazerActive(username, days = 30) {
  if (username === undefined || username === null) {
    logging.log('warn', `Stargazer ${username} not found in tracking list`);
    return false;
  }
  const stargazer = stargazers.find(s => s.username === username);
  if (!stargazer) {
    logging.log('warn', `Stargazer ${username} not found in tracking list`);
    return false;
  }
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return stargazer.lastActivity >= cutoffDate;
}