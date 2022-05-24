const validateUser = (user, userId, status, message) => {

    if (user.toString() !== userId) {

        const error = new Error

        error.status = status.toString()

        error.message = message

        console.log(error)

        throw error
    }

    return

}

module.exports = validateUser