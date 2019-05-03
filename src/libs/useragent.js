export default () => {
  const phone = /iPad|iPhone|iPod|android/.test(navigator.userAgent || navigator.platform) 

  console.log(phone)

  return phone
}