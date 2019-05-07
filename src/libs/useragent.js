export default () => {
  const phone = /iPad|iPhone|iPod|android/i.test(navigator.userAgent || navigator.platform) 

  console.log(navigator.userAgent, navigator.platform, phone)

  console.log(phone)

  return phone
}