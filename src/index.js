document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 2997

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  // Fetch image and associated data from API and display on page
  fetch(imageURL).then(resp => resp.json()).then(data => {
    let image = document.getElementById('image')
    image.src = data.url
    image.dataset.id = data.id

    let name = document.getElementById('name')
    name.innerText = data.name

    let likes = document.getElementById('likes')
    likes.innerText = data.like_count

    let comments = document.getElementById('comments')
    data.comments.forEach(comment => {
      comments.innerHTML += `<li data-id=${comment.id}>${comment.content}
      <button id='delete_button' style='color:red; font-size:11px; border-radius:5px; font-weight:bold'>DELETE</button></li>`
    })
  })

  document.addEventListener('click', event => {
    let imageId = document.getElementById('image').dataset.id

    // Increasing Like count through optimistic rendering
    if (event.target.id === "like_button") {

      // Making changes to the DOM
      let likes = document.getElementById('likes')
      likes.innerText = parseInt(likes.innerText, 10) + 1

      // Fetch Request to persist like data
      fetch(likeURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }, 
        body: JSON.stringify({
          image_id: imageId
        })
      })
    }

    // Deleting comment through pessimistic rendering
    else if (event.target.id === "delete_button") {
      const comment = event.target.parentElement
      fetch(commentsURL + comment.dataset.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }, 
        body: JSON.stringify({
          message: 'Comment Successfully Destroyed'
        })
      }).then(resp => {
        comment.remove()
      })
    }
  })

  // Adding new comments through optimistic rendering
  document.addEventListener('submit', e => {
    e.preventDefault()

    let imageId = document.getElementById('image').dataset.id
    let commentInput = e.target.children[0]
    const commentContent = commentInput.value

    // Ensure comment is not blank
    if (commentContent !== "") {
      // Making changes to the DOM
      let comments = document.getElementById('comments')
      let newComment = document.createElement('li')
      newComment.innerHTML = `${commentContent} <button id='delete_button' style='color:red; font-size:11px; border-radius:5px; font-weight: bold'>DELETE</button>`
      comments.appendChild(newComment)
      
      // Clear input once comment is submitted
      commentInput.value = ""
      commentInput.placeholder = "Add Comment"
      
      // Fetch Request to persist new comment data
      fetch(commentsURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          image_id: imageId,
          content: commentContent
        })
      }).then(resp => resp.json()).then(data => {
        // Adding data attribute 'id' to comment li after comment is added to database
        newComment.dataset.id = data.id
      })
    }
  })
})
