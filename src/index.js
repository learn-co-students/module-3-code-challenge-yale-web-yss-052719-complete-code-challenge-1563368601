document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 3004 
  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`

  fetch(imageURL).then(response => response.json()).then(image => {


  	const title = document.querySelector('h4')
  	const img = document.querySelector('img')
  	const likes = document.getElementById('likes')
  	const comments = document.getElementById('comments')
  	const button = document.getElementById('like_button')

  	title.innerText = image.name
  	likes.innerText = image.like_count
  	img.src = image.url
  	img.dataset.id = image.id
  	button.dataset.id = image.id

  	for (let comment of image.comments){
  		comments.innerHTML += `<li data-comment-id=${comment.id}>${comment.content} <button id="delete">x</button></li>`
  	}
  }).then(response => {
	document.addEventListener('click', function(e){
		if (e.target.id === 'like_button'){
			let like_text = e.target.previousElementSibling.children[0]
			let like_count = parseInt(like_text.innerText, 10)
			
			like_count += 1

			like_text.innerText = `${like_count}`
			fetch(likeURL, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					image_id: imageId
				})
			})

		} else if (e.target.id === 'delete'){
			delComment = e.target.parentElement
			delCommentId = delComment.dataset.commentId
			delComment.remove()
		
			fetch(commentsURL + delCommentId, {
				method: "DELETE",
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			})
		}
	})	
  })

  document.addEventListener('submit', function(e){
  	e.preventDefault()

  	let commentEl = document.getElementById('comment_input')
  	let content = commentEl.value

  	let newComment = document.createElement('li')
  	newComment.innerHTML = `${content}<button id="delete">x</button>`
  	comments.append(newComment)

  	commentEl.value = ""

  	fetch(commentsURL, {
  		method: "POST",
  		headers: {
  			'Content-Type': 'application/json',
  			'Accept': 'application/json'
  		},
  		body: JSON.stringify({
  			image_id: imageId,
  			content: content
  		})
  	}).then(response => response.json()).then(comment => {
  		newComment.dataset.id = comment.id
  	})

  })
})
