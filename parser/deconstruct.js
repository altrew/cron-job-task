export const deconstruct = (cronString) => {
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
