const validateUser = (user, invitedUserArr, userId, status, message) => {

    if (user.toString() === userId || invitedUserArr.includes(userId)) {
        return
    }
        const error = new Error

        error.status = status.toString()

        error.message = message

        console.log(error)

        throw error

}

module.exports = validateUser