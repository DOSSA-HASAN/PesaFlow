export const addStatusHistory = (payment, status) => {
    const history = payment.statusHistory ? [...payment.statusHistory] : []

    const containsStatus = history.some(item => item.status === status)

    if (containsStatus) {
        return history
    }
    history.push({status, timestamp: new Date().toISOString()})
    return history
}