const validateUserIsAdmin = (adminsList, userId, status, message) => {

    if (adminsList.includes(userId)) {
        return
    }
        const error = new Error

        error.status = status.toString()

        error.message = message

        console.log(error)

        throw error

}

module.exports = validateUserIsAdmin