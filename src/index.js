document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 2991 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  fetch(imageURL)
  .then(resp => resp.json())
  .then(data => {
    let divTag = document.querySelector('#image_card')
    
    divTag.innerHTML = ""
    divTag.innerHTML += `<img src=${data.url} id="image" data-id=${data.id}>
    <h4 id="name">${data.name}</h4>
    <span>Likes:
      <span id="likes">${data.like_count}</span>
    </span>
    <button id="like_button">Like</button>
    <form id="comment_form">
      <input id="comment_input" type="text" name="comment" placeholder="Add Comment"/>
      <input type="submit" value="Submit"/>
    </form>
    <ul id="comments">
        
    </ul>`
    let ulTag = document.querySelector('#comments')
    // console.log(data.comments[0]["content"])
    data.comments.forEach(comment => {
      ulTag.innerHTML += `<li data-id=${comment.image_id}> ${comment.content}</li>`
    })
  })

  //likes
  document.addEventListener('click', function(e){
    // console.log(e.target.parentElement.querySelector('img').dataset.id)

    if (e.target.id === "like_button"){
      //render optimistic on page
      fetch(imageURL)
      .then(resp => resp.json())
      .then(data => {
        let divTag = document.querySelector('#image_card')
        data.like_count += 1
        divTag.innerHTML = ""
        divTag.innerHTML += `<img src=${data.url} id="image" data-id=${data.id}>
        <h4 id="name">${data.name}</h4>
        <span>Likes:
          <span id="likes">${data.like_count}</span>
        </span>
        <button id="like_button">Like</button>
        <form id="comment_form">
          <input id="comment_input" type="text" name="comment" placeholder="Add Comment"/>
          <input type="submit" value="Submit"/>
        </form>
        <ul id="comments">
        </ul>`
        let ulTag = document.querySelector('#comments')
        // console.log(data.comments[0]["content"])
        data.comments.forEach(comment => {
          ulTag.innerHTML += `<li data-id=${comment.image_id}> ${comment.content}</li>`
        })
      })

      //change database
      fetch(likeURL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          image_id: e.target.parentElement.querySelector('img').dataset.id,
          like_count: e.target.parentElement.querySelector('span').querySelector('#likes').innerHTML
        })
      })
    }
  })

  //comments
  document.addEventListener('click', function(e){
    e.preventDefault()
    if(e.target.value === 'Submit'){
      //check if comment input is empty
      let newc = e.target.parentElement.querySelector('#comment_input').value
      if (e.target.parentElement.querySelector('#comment_input').value === ""){
      }else {
        // console.log(e.target.parentElement.querySelector('#comment_input').value)
        
      //code to render optimistically
      fetch(imageURL)
      .then(resp => resp.json())
      .then(data => {
        let divTag = document.querySelector('#image_card')
        divTag.innerHTML = ""
        divTag.innerHTML += `<img src=${data.url} id="image" data-id=${data.id}>
        <h4 id="name">${data.name}</h4>
        <span>Likes:
          <span id="likes">${data.like_count}</span>
        </span>
        <button id="like_button">Like</button>
        <form id="comment_form">
          <input id="comment_input" type="text" name="comment" placeholder="Add Comment"/>
          <input type="submit" value="Submit"/>
        </form>
        <ul id="comments">
        </ul>`
        let ulTag = document.querySelector('#comments')
        // console.log(data.comments[0]["content"])

        data.comments.forEach(comment => {
          ulTag.innerHTML += `<li data-id=${comment.image_id}> ${comment.content}</li>`
        })
        ulTag.innerHTML += `<li data-id=${data.id}> ${newc}</li>`
      })
      }
      //backend comments changing dataset
      let imageid = e.target.parentElement.parentElement.querySelector('img').dataset.id;
      fetch(commentsURL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_id: imageid,
          content: newc
        })
      })
    }
  })


})
