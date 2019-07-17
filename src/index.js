document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 3000 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const url = document.getElementById("image")
  const title = document.getElementById("name")
  const likes = document.getElementById("likes")
  const comments = document.getElementById("comments")


  // Step 1 - Get the Image Data
  fetch(imageURL)
  .then(resp => resp.json())
  .then(image => {
    url.src = image.url
    url.dataset.id = image.id
    title.innerText = image.name
    likes.innerText = image.like_count
    image.comments.forEach(function(c) {
      comments.innerHTML += "<li id: `${c.id}`> ${c.content} <button id='delete_button'>X</button> </li>"
    })
  })

  document.addEventListener("click", function(e) {
    e.preventDefault();
    // Step 2 - Like Feature (Frontend)
    if (e.target.id === "like_button") {
      console.log("liked")
      likeNum = parseInt(likes.innerText)
      likeNum += 1
      likes.innerText = likeNum

      // Step 3 - Like Feature (Backend)
      fetch(likeURL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({image_id: imageId})
      })
    }

    // Step 4 - Comment Feature (Frontend)
    else if (e.target.value === "Submit") {
      const commentBox = e.target.previousSibling.previousSibling
      comments.innerHTML += `<li> ${commentBox.value} <button id="delete_button">X</button> </li>`
      commentBox.value = ""
      
      // Step 5 - Comment Feature (Backend)
      fetch(commentsURL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image_id: imageId,
            content: comments.lastChild.innerText
          })
      })
    }
    else if (e.target.id === "delete_button") {
      console.log(e.target.parentElement[data-id])
      fetch(`commentsURL`, {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image_id: imageId,
            content: comments.lastChild.innerText
          })
      })
    }
  })
})
