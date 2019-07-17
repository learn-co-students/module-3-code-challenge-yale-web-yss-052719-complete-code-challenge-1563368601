document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

// Variable Definitions

  let imageId = 2996

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes`

  const commentsURL = `https://randopic.herokuapp.com/comments`

  let imageCard = document.getElementById("image_card")

// Fetch Requests

  // get Image

  function getImage(){
    return fetch(imageURL)
    .then(res => res.json())
  }

// Rendering

  function renderImage(image){
    imageCard.innerHTML += `<img src=${image.url} id="image" data-id=${image.id}/>
    <h4 id="name">${image.name}</h4>
    <span>Likes:
      <span id="likes">${image.like_count}</span>
    </span>
    <button id="like_button" data-id=${image.id}>Like</button>
    <form data-id=${image.id} id="comment_form">
      <input id="comment_input" type="text" name="comment" placeholder="Add Comment"/>
      <input type="submit" value="Submit"/>
    </form>
    <ul id="comments">
    </ul>`
  }

  function renderComment(comment){
    let commentTag = document.getElementById("comments")
    commentTag.innerHTML += `<li class="comment" data-id=${comment.id}>${comment.content}
    <button class="delete">Delete</button></li>`
  }

// DOM Manipulation

  getImage().then(image => {
    renderImage(image)
    image.comments.forEach(comment => {
      renderComment(comment)
    })

    let likeButton = document.getElementById("like_button")
    let commentForm = document.getElementById("comment_form")
    let comments = document.getElementById("comments")

// Event Handlers

    // adds new likes to page - optimistically rendered
    likeButton.addEventListener('click', function(e){
      // renders change to page - frontend
      let likeCount = document.getElementById("likes")
      let newLikes = parseInt(document.getElementById("likes").innerHTML) + 1
      likeCount.innerHTML = `${newLikes}`
      likeCount.outerHTML
      // stores change to database - backend
      if (e.target.nodeName === "BUTTON"){
        fetch(likeURL, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "image_id": imageId
          })
        })
      }
    })

    // adds new comments to the page - optimistically rendered
    commentForm.addEventListener('submit', function(e){
      e.preventDefault()
      let comment = document.getElementById("comment_input").value
      let commentTag = document.getElementById("comments")
      commentTag.innerHTML += `<li class="comment">${comment}<button class="delete">Delete</button></li>`
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
      })
      .then(res => res.json())
      // set data-id attribute AFTER rendering the comment. This is done because of optimistic rendering. Otherwise the above function renderComment(comment) could be used instead.
      .then(comment => {
        commentTag.setAttribute("data-id", comment.id)
      })
    })


    // delete comment - pessimistically rendered
    comments.addEventListener('click', function(e){
      if (e.target.nodeName === "BUTTON"){
        let commentId = e.target.parentElement.dataset.id
        fetch(`https://randopic.herokuapp.com/comments/${commentId}`, {
          method: "DELETE"
        })
        .then(data => {
          e.target.parentElement.remove()
        })
      }
    })
  })
})
