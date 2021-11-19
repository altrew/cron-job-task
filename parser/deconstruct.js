// trivial regex to match spaces between regex parts.
// would need more investment in initial check.
const cronJobRegex = /.+(\s.+){5}/;

export const deconstruct = (cronString) => {
  if (!cronJobRegex.test(cronString))
    throw new Error(
      'cron job did not match format of "minute hour dayOfMonth month dayOfWeek command"'
    );

  const [minute, hour, dayOfMonth, month, dayOfWeek, ...command] =
    cronString.split(" ");

  return {
    minute,
    hour,
    dayOfMonth,
    month,
    dayOfWeek,
    command,
  };
};
