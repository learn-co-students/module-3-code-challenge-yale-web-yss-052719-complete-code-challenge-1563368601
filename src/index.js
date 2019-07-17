document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 2998 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  fetch(imageURL).then(resp => resp.json()).then(data => {
    console.log(data)
    document.querySelector(`h4`).innerHTML = data.name
    document.querySelector(`img`).src = data.url 
    document.getElementById(`likes`).innerHTML = data.like_count
    document.getElementById(`likes`).dataset.likes = data.like_count
    data.comments.forEach(comment =>{
      list = document.createElement(`li`)
      list.innerHTML = comment.content
      let btn = document.createElement(`button`)
      btn.dataset.id = comment.id
      btn.innerHTML = `Delete`
      list.appendChild(btn)
      document.getElementById(`comments`).appendChild(list)
    })
  })

  document.getElementById('like_button').addEventListener('click', event =>{
    event.preventDefault()
    imageLikes = parseInt(document.getElementById(`likes`).dataset.likes)
    imageLikes += 1
    document.getElementById(`likes`).innerHTML = imageLikes
    document.getElementById(`likes`).dataset.likes = imageLikes

    fetch(likeURL, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: imageId
      })
    })
  })
  
  document.getElementById(`comment_form`).addEventListener(`submit`, event=>{
    event.preventDefault()
    comment = event.target.children[0].value
    list = document.createElement(`li`)
    list.innerHTML = comment
    let btn = document.createElement(`button`)
    btn.innerHTML = `Delete`
    list.appendChild(btn)
    document.getElementById(`comments`).appendChild(list)
    
    fetch(commentsURL, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: imageId,
        content: comment 
      })
    }).then(resp=> (resp.json()))
    .then(comment => btn.dataset.id = comment.id)
    })

    document.querySelector(`ul`).addEventListener(`click`, event =>{
      commentID = event.target.dataset.id
      list = event.target.parentElement
      list.remove()
    

      fetch(`https://randopic.herokuapp.com/comments/${commentID}`,{
      method: "DELETE"})
     
    })
})
