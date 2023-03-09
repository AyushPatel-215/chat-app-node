const gererateMessage = (username,text) => {
    return {
        username,
        text,
        createAt: new Date().getTime()
    }
}

const gererateLocation = (username,url) =>{
    return{
        username,
        url,
        createAt: new Date().getTime()
    }
}

module.exports = {
    gererateMessage,
    gererateLocation
}