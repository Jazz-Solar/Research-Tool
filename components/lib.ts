// get today's date in yyyy-mm-dd format
export const today = new Date().toISOString().split("T")[0];

export const randomColorMap = new Map<number, string>();

export const filteredDateString = (
  dateString: string | undefined,
  filter: "day" | "month" | "year",
) => {
  let newDateString = dateString || today;
  // if month then yyyy-mm else if year then yyyy
  if (filter === "month") return newDateString.slice(0, 7);
  else if (filter === "year") return newDateString.slice(0, 4);
  else return newDateString;
};

export function yAxisFormatter(value: number) {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M"; // e.g. 3.5M
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "k"; // e.g. 35.2k
  }
  return value.toString();
}
