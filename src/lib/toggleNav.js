export const useToggleNav = () => {
  const toggleNav = () => {
    const sideNav = document.querySelector('#side-nav')
    if (sideNav.classList.contains('hidden')) {
      sideNav.classList.remove('hidden')
      sideNav.classList.add('fixed')
    } else {
      sideNav.classList.remove('fixed')
      sideNav.classList.add('hidden')
    }
  }

  return {
    toggleNav
  }
}
