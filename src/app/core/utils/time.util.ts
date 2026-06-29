export const formatTime = (date: any): any => {
    if (!(date instanceof Date)) return date;
    
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const strHours = hours < 10 ? '0' + hours : hours;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${strHours}:${strMinutes} ${ampm}`;
};

export const parseTime = (timeStr: string | null | undefined): Date | null => {
    if (!timeStr) return null;
    const parts = timeStr.trim().split(' ');
    if (parts.length !== 2) return null;
    
    const [time, modifier] = parts;
    const [hours, minutes] = time.split(':');
    
    let hrs = parseInt(hours, 10);
    if (hrs === 12) {
        hrs = modifier.toUpperCase() === 'AM' ? 0 : 12;
    } else if (modifier.toUpperCase() === 'PM') {
        hrs = hrs + 12;
    }
    
    const date = new Date();
    date.setHours(hrs, parseInt(minutes, 10), 0, 0);
    return date;
};
