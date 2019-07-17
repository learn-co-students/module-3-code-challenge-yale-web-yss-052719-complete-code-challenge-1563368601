document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 3002 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`
  const likeTag = document.getElementById('likes')
  const ulTag = document.querySelector('ul')

  // function addDeleteButton(element) {
  //   let deleteButton = `<button style="margin-left: 50px;" data-id=${element.dataset.id}>Delete</button>`

  //   element.innerHTML += deleteButton.outerHTML
  //   return element
  // }

  // load the image details onto the page
  fetch(imageURL)
  .then(resp => resp.json())
  .then(data => {
    // a function for adding delete buttons to Lis
    
    const imageTag = document.querySelector('img')
    imageTag.src = data.url

    const imageTitle = document.getElementById('name')
    imageTitle.innerText = data.name

    likeTag.innerText = data.like_count

    data.comments.forEach(function(comment) {
      let liTag = document.createElement('li')
      liTag.dataset.id = comment.id
      
      // liTag = addDeleteButton(liTag) // adds a delete button to the li

      liTag.innerText = comment.content
      
      ulTag.appendChild(liTag)
    })
  })

  // add the like feature, including front-end (updating the DOM) and back-end(initiating a fetch request)
  document.addEventListener('click', function(event) {
    if(event.target.id === "like_button") {
      // front-end: updates the DOM
      let likes = parseInt(likeTag.innerText)
      likes += 1
      likeTag.innerText = likes.toString()

      // back-end: sends a post request
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
    }
  })

  // add the comments feature, including front-end (adding Lis to the comment list UlTag) and back-end (sending a post request)
  document.addEventListener('submit', function(event) {
    if(event.target.id === "comment_form") {
      event.preventDefault()

      //add the comment to the DOM and clear the input box
      let comment = event.target.children[0].value
      let liTag = document.createElement('li')
      // addDeleteButton(liTag) // adds a delete button to the li
      liTag.innerText = comment
      ulTag.appendChild(liTag)

      event.target.children[0].value = "" // clears the input box
      //make a post request to the backend to persist the comment
      fetch(commentsURL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_id: imageId,
          content: comment
        })
      })


    }
  })


})
