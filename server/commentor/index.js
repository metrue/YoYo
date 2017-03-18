window.onload = function() {
  const id = 'COMMENTOR-BOX-ID'

  var container = document.createElement('div')
  container.id = 'COMMENTOR-CONTANER'

  var textarea = document.createElement('textarea')
  textarea.id = 'COMMENTOR-BOX-TEXTAREA'

  var button = document.createElement('button')
  button.id = 'COMMENTOR-BOX-SUBMIT-BUTTON'
  button.innerText = 'Submit'

  var root = document.getElementById(id)
  root.appendChild(container)
  container.appendChild(textarea)
  container.appendChild(button)

  button.addEventListener('click', function() {
    console.log('submit your content')
  })
}
