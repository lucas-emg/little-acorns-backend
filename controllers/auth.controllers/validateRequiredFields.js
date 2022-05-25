const validateRequiredFields = (name, username, email, password, status, message) => {

    if (!name || !username || !email || !password) {

        const error = new Error

        error.status = status

        error.message = message

        throw error
    }

    return
}

module.exports = validateRequiredFields