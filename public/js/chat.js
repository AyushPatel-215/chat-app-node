const socket = io()

// Elements..
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')

// Templetes
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplete = document.querySelector('#sidebar-template').innerHTML
  
// Options
const {username ,room} = Qs.parse(location.search, {ignoreQueryPrefix:true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('message' , (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {  
        username: message.username, 
        message : message.text,
        createAt : moment(message.createAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locationTemplate, {
        username : url.username,
        url: url.url,
        createAt: moment(url.createAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

$messageForm.addEventListener('submit' ,(e)=>{
    e.preventDefault()

    // disable
    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value

    socket.emit('sendMsg',message , (error) => {
        $messageFormButton.removeAttribute('disabled')
        if(error)
            return console.log(error)
        console.log('Message delivered!')
    })
    $messageFormInput.value = ''
    $messageFormInput.focus()
})

$sendLocationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation)
        return alert('Geolocation is not supported by your browser')

    $sendLocationButton.setAttribute('disabled','disabled')
    
    navigator.geolocation.getCurrentPosition( (position) =>{
        // console.log(position)    
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }, ()=> {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!') 
        })
    })
})

socket.on('roomData' , ({room,users}) =>{
   const html = Mustache.render(sidebarTemplete ,{
    room,
    users
   })
   document.querySelector('#sidebar').innerHTML = html
})


socket.emit('join', {username,room}, (error) =>{
    if(error){
        alert(error)
        location.href = '/'
    }
})