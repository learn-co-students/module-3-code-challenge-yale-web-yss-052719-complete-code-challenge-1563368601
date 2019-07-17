document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 2993 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const imageCard = document.querySelector('div#image_card')
  const likeBtn = document.getElementById('like_button')
  const comments = document.getElementById('comments')
  const commentForm = document.getElementById('comment_form')

  renderImage()

  /** like button */
  likeBtn.addEventListener('click', function(e){
    console.log(e)
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
    const likeElement = e.target.previousElementSibling.children[0]
    // console.log(likeElement)
    let likeCount = parseInt(likeElement.innerText, 10)
    // console.log(likeCount)
    likeCount += 1
    likeElement.innerText = `${likeCount}`
  })

  /*** Comment Feature */
  commentForm.addEventListener('submit', function(e){
    e.preventDefault()
    const content = e.target[0].value
    fetch(commentsURL, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: imageId,
        content: content
      })
    })
    comments.innerHTML += `<li>${content}  <button class="del-btn">X</button></li>`
    commentForm.reset()
  })

  /*** Delete button */
  imageCard.addEventListener('click', function(e){
    // console.log(e)
    if (e.target.className === "del-btn") {
      const commentId = e.target.dataset.id
      fetch(commentsURL+'/'+`${commentId}`, {
        method: "DELETE"
      })
      .then(res => res.json())
      .then(comment => {
        e.target.parentElement.remove()
      })
      // .then(msg => {
      //   message: 'Comment Successfully Destroyed'
      // })
    }
  })

  /******* functions *******/
  function renderImage(){
    fetch(imageURL)
    .then(res => res.json())
    .then(image => {
      document.getElementById('name').innerText = `${image.name}`
      document.getElementById('image').src = `${image.url}`
      document.getElementById('likes').innerText = `${image.like_count}`
      clearInnerHtml(comments)
      image.comments.forEach(comment => {
        // console.log(comment.id)
        comments.innerHTML += `<li>
          ${comment.content}  <button class="del-btn" data-id=${comment.id}>X</button>
        </li>`
      })
    })
  }

  function clearInnerHtml(list){
    list.innerHTML = ""
  }

})
