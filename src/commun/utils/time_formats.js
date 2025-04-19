function date2TimeAgo(date) {
    const time = new Date(date).getTime()
    const now = new Date().getTime()
    const diff = now - time

    if (diff < 1000 * 60) {
        return Math.floor(diff / 1000) + ' seconds ago'
    } else if (diff < 1000 * 60 * 60) {
        return Math.floor(diff / (1000 * 60)) + ' minutes ago'
    } else if (diff < 1000 * 60 * 60 * 24) {
        return Math.floor(diff / (1000 * 60 * 60)) + ' hours ago'
    } else {
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + ' days ago'
    }
}

export { date2TimeAgo }