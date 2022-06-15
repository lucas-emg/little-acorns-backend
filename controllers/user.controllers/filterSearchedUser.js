const filterSearchedUser = (userList, searchParam) => {

    return userList.filter(user => user.username.toLowerCase().includes(searchParam.toLowerCase()) || user.email.toLowerCase().includes(searchParam.toLowerCase()))
}

module.exports = filterSearchedUser