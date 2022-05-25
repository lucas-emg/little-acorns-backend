const validateRequiredFields = (name, email, password, status, message) => {

    if (!name || !email || !password) {

        const error = new Error

        error.status = status

        error.message = message

        throw error
    }

    return
}

module.exports = validateRequiredFields