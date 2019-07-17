document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 2999 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const image = document.querySelector("#image");
  const imageName = document.querySelector("#name");
  const likes = document.querySelector("#likes");
  const commentsUl = document.querySelector("#comments");
  const likeButton = document.querySelector("#like_button")

  function createCommentLi(comment) {

    let commentLi = document.createElement('li');
    commentLi.innerText = comment.content;

    let deleteButton = document.createElement('button');
    deleteButton.id = 'delete-comment';
    deleteButton.innerText = 'Delete'

    comment.id ? deleteButton.dataset.id = comment.id : null

    commentLi.append(deleteButton);

    return commentLi
  }

  fetch(imageURL)
    .then(res => res.json())
    .then(({
      name,
      url,
      like_count,
      comments
    }) => {

      image.src = url;
      imageName.innerText = name
      likes.innerText = like_count
      comments.forEach(function (comment) {
        commentsUl.append(createCommentLi(comment))
      })

    })

  likeButton.addEventListener('click', function (e) {

    likes.innerText = parseInt(likes.innerText) + 1;

    fetch(likeURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: imageId
      })
    })

  })

  const form = document.querySelector('#comment_form')
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const content = form.querySelector('#comment_input').value

    comment = {
      content: content
    }
    
    const commentLi = createCommentLi(comment)
    commentsUl.append(commentLi)

    fetch(commentsURL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_id: imageId,
          content: content
        })
      })
      .then(res => res.json())
      .then(comment => {

        const deleteButton = commentLi.querySelector('#delete-comment');
        deleteButton.dataset.id = comment.id

      })

  })



  commentsUl.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {

      const commentId = e.target.dataset.id
      fetch(`${commentsURL}${commentId}`, {
          method: 'DELETE',
        })
        .then(res => res.json())
        .then(comment => {
          commentsUl.removeChild(e.target.parentNode)
        })
    }
  })




})
