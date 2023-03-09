const users = []

// addUser, removeUser, getUser, getUserInRoom
const addUser = ({id,username,room}) => {

    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate data
    if(!username || !room){
        return{
            error: 'Username and room are required!'
        }
    }

    // check for exiting user
    const existingUser = users.find( (user) => {
        return user.room == room && user.username == username
    })

    // validate username
    if(existingUser){
        return{
            error:'Username is already exists!'
        }
    }

    // store user
    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex( (user) =>  user.id === id )
    if(index !== -1){
        return users.splice(index,1)[0]
    }  
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUserInRoom = (room) => {
    return users.filter((user) => user.room === room)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}

    

// const newuser = addUser({
//     id: 21,
//     username:'preet',
//     room: 'maruti' 
// })
// addUser({
//     id: 211,
//     username:'Ayush',
//     room: 'maruti'
// })

// addUser({
//     id: 11,
//     username:'harshil',
//     room: 'wotnot'
// })

// console.log(getUserInRoom('maruti'))
