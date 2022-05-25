const validateCredentialsPassword = (password, status, message) => {

    if (!password) {

        const error = new Error

        error.status = status

        error.message = message

        throw error
    }

    return
}

module.exports = validateCredentialsPassword