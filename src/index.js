document.addEventListener('DOMContentLoaded', (event) => {

  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 2995 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const imageCard = document.getElementById("image_card")

  fetch(imageURL)
  .then(res => res.json())
  .then(data => {
    // console.log(data)
    imageCard.innerHTML = `  <img src=${data.url} id="image" data-id="${data.id}"/>
      <h4 id="name">${data.name}</h4>
      <span>Likes:
        <span id="likes">${data.like_count}</span>
      </span>
      <button id="like_button">Like</button>
      <form id="comment_form">
        <input id="comment_input" type="text" name="comment" placeholder="Add Comment"/>
        <input type="submit" value="Submit"/>
      </form>`
  })

 let likeButton = document.getElementById("like_button")
  likeButton.addEventListener("click", function(event){
    event.preventDefault()
    // console.log(event)
    if(event.target.tagName === "like_button")
    // need to find the parent to add to
    fetch('https://randopic.herokuapp.com/likes', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        image_id: imageId
      })
    }).then(res => res.json())
    .then(data)
  })

    imageCard.addEventListener('Submit', function(event){
    event.preventDefault()
    console.log(event)
    let comment = event.target.dataset.comments
    let image_id = event.targer.dataset.id
    let commentUl = document.getElementById("comments")
    commentUl.innerHTML += `<li>${comment}</li>`

    fetch('https://randopic.herokuapp.com/comments',{
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        image_id: image_id,
        content: comment
      })
    })
  })


})
