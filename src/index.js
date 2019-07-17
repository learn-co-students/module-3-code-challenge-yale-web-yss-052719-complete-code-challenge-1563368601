document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 2994 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const ulTag = document.querySelector("ul#comments")
  const likes = document.querySelector("span#likes")

  fetch(imageURL)
  .then(res => res.json())
  .then(image => {
    const imgTag = document.querySelector("img#image")
    imgTag.src = image.url
    const name = document.querySelector("h4#name")
    name.innerText = image.name
    likes.innerText = image.like_count
    image.comments.forEach(comment => {
      ulTag.innerHTML += `<li>${comment.content} <button class="delete_button" data-id=${comment.id}>Delete</button></li>`
    });
  })

  document.addEventListener("click", function(e) {
    if (e.target.tagName === "BUTTON" && e.target.id === "like_button") {
      let likeCount = parseInt(likes.innerText, 10)
      likeCount += 1
      likes.innerText = likeCount

      fetch(likeURL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_id: 2994
        })
      })
    } else if (e.target.tagName === "BUTTON" && e.target.className === "delete_button") {
      fetch(commentsURL + e.target.dataset.id, {
        method: "DELETE"
      })
      .then(res => res.json())
      .then(data => {
        console.log(data) // {message: "Comment Sucessfully Destroyed"}
        e.target.parentElement.remove()
      })
    }
  })

  document.addEventListener("submit", function(e) {
    e.preventDefault()
    const content = e.target.children[0].value
    ulTag.innerHTML += `<li>${content} <button class="delete_button">Delete</button></li>`
    e.target.reset() // Clear form

    fetch(commentsURL, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: 2994,
        content: content
      })
    })
    .then(res => res.json())
    .then(img => {
      const allDeleteBtns = document.querySelectorAll("button.delete_button")
      const newDeleteBtn = allDeleteBtns[allDeleteBtns.length - 1]
      newDeleteBtn.dataset.id = img.id  // Now the new button has a data-id attribute
    })
  })
})
