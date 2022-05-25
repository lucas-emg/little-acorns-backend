const validateExistingEmail = (email, status, message) => {

    if (email) {

        const error = new Error

        error.status = status

        error.message = message

        throw error
    }

    return
}

module.exports = validateExistingEmail