// Step #1

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 3001 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`
// When page loads I should see an image
  const commentsURL = `https://randopic.herokuapp.com/comments/`
  fetch(imageURL)
  .then(res => res.json())
  .then(imgData => {
    //console.log(imgData)
    //imgData.message.forEach(function(){
    
    const imgTag = document.getElementById("src")
    //<img src="" id="image" data-id=""/> //comment out
    console.log("src")
    //})
  })







})

// Step #1
// When page loads I should see an image
// See comments the image has
// See the number of likes the image has

// Step #2
// I can click o button to like an image

// Step #3
// User can enter text in field
// The app should add comment to the image without page refreshing.

// Step $4
// User can refresh page and still see the comments and likes.
// When user adds a like/comment make sure changes are sent to the backen API.c
