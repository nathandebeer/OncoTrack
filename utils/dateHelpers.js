export function generateNext5Days() {
    const result = [];
    const today = new Date();

    for (let i = -2; i <= 2; i++) {
        const dayDate = new Date(today);
        dayDate.setDate(dayDate.getDate() + i);

        const dayName = dayDate.toLocaleDateString('en-GB', { weekday: 'short' });
        const numericDate = dayDate.getDate();
        const monthName = dayDate.toLocaleDateString('en-GB', { month: 'short' });

        result.push({
            day: dayName,
            date: numericDate,
            month: monthName,
            isToday: i === 0,
        });
    }
    return result;
}

export function parseTime(timeStr) {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
}