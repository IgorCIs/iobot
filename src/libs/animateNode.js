export default function animateNode(element, animationName, callback, notDelete) {
  const node = element
  node.classList.add('animated', animationName)

  function handleAnimationEnd() {
      !notDelete && node.classList.remove('animated')
      !notDelete && node.classList.remove(animationName)

      if (typeof callback === 'function') callback()
  }

  //lol iOs :c 
  node.addEventListener('animationend', () => handleAnimationEnd(), true)
  node.addEventListener('webkitAnimationEnd', () => handleAnimationEnd(), true)
  node.addEventListener('webkitanimationend', () => handleAnimationEnd(), true)
  node.addEventListener('animationend', () => handleAnimationEnd(), true)
  node.addEventListener('animationiteration', () => handleAnimationEnd(), true)
}

export function animate(active, elements, cb, notDelete) {
  if(active) 
    elements.forEach(item => {
      if(item) animateNode(item, item.dataset.animation, cb, notDelete)
    })
}