const validateCredentialsUser = (user, status, message) => {

    if (!user) {

        const error = new Error

        error.status = status

        error.message = message

        throw error
    }

    return
}

module.exports = validateCredentialsUser