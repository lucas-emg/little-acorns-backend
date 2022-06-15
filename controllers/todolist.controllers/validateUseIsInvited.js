const validateUseIsInvited = (invitedUserArr, userId, status, message) => {

    if (invitedUserArr.includes(userId)) {
        const error = new Error

        error.status = status.toString()

        error.message = message

        console.log(error)

        throw error
    }
    
    return

}

module.exports = validateUseIsInvited