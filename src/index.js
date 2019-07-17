document.addEventListener('DOMContentLoaded', () => {

  // Didn't have enough time to begin BONUS 😥😥😥 

  let imageId = 2992 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const imgTag = document.querySelector("#image_card")

  // Fetch image and render on to page
  fetch(imageURL)
  .then(res => res.json())
  .then(data => {
    imgTag.innerHTML = `<img src="${data.url}" id="image" data-id=""/>
    <h4 id="name">${data.name}</h4>
    <span>Likes:
      <span id="likes">${data.like_count}</span>
    </span>
    <button id="like-button">Like</button>
    <form id="comment_form">
      <input id="comment_input" type="text" name="comment" placeholder="Add Comment"/>
      <input type="submit" value="Submit"/>
    </form>
    <ul id="comments">
    </ul>`

    // Add on the comments
    const commentUlTag = document.querySelector("#comments")
    for (let i = 0; i < data.comments.length; i++){
      commentUlTag.innerHTML +=
      `<li data-id=${data.comments[i].id}>${data.comments[i].content}</li>`
    }
  })

  // Add listener to increment Likes
  imgTag.addEventListener('click', function(e){
    if (e.target.tagName === "BUTTON"){
      fetch(imageURL)
      .then(res => res.json())
      .then(data => {
        let likeCount = data.like_count
        frontEndLikes(likeCount)
        incrementLikes(data.like_count)
      })
    }
  })

  // Add listener for the form submit
  imgTag.addEventListener('submit', function(e){
    e.preventDefault()

    // Add comment to frontend
    let commentInput = document.querySelector("#comment_input")
    let enteredValue = commentInput.value
    document.querySelector("#comments").innerHTML += `<li>${enteredValue}</li>`
    commentInput.value = ''

    // Add comment to backend
    addAComment(enteredValue)
  })

  // increment likes - frontend
  function frontEndLikes(likeCount){
    const numLikes = document.getElementById("likes")
    likeCount += 1
    numLikes.innerText = `${likeCount}`
  }

  // increment likes - backend
  function incrementLikes(likeCount){
    likeCount += 1
    fetch("https://randopic.herokuapp.com/likes", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "image_id": imageId,
        "likes": likeCount
      })
    })
  }

  // POST fetch request for comment
  function addAComment(comment){
    fetch("https://randopic.herokuapp.com/comments", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "image_id": imageId,
        "content": comment
      })
    })
  }

})
