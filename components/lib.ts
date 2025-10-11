// get today's date in yyyy-mm-dd format
export const today = new Date().toISOString().split("T")[0];

export const filteredDateString = (dateString: string | undefined, filter: 'day' | 'month' | 'year') => {
    let newDateString = dateString || today;
    // if month then yyyy-mm else if year then yyyy
    if (filter === "month") return newDateString.slice(0, 7);
    else if (filter === "year") return newDateString.slice(0, 4);
    else return newDateString;
} 