
const mainWrapper = document.querySelector('.main-wrapper')
const exitSectionButton = document.querySelector('.exit-section')
const catButton = document.querySelector('#cat')
const rightMenu = document.querySelector('#right-menu')
catButton.addEventListener("click", expandRightMenu, false)
exitSectionButton.addEventListener("click", hideRightMenu, false)

const menuButton = document.querySelector('#menu-button-wrapper')
const marker = document.querySelector('#marker')
const touchArea = document.querySelector('#touch-area')
const lateralMenu = document.querySelector('[data-lateral-menu]')
const sectionLinks = [...document.querySelectorAll('[data-link]')]
const sections = [...document.querySelectorAll('section')]
const sectionsWrapper = document.querySelector('#sections-wrapper')
const scrollRoot = document.querySelector('[data-scroller]')
const headerLinks = [...document.querySelectorAll('[data-link]')]

menuButton.addEventListener("click", expandLateralMenu, false)
sectionsWrapper.addEventListener("touchstart", expandLateralMenu, false)
sectionLinks.forEach(link => {
      link.addEventListener("click", expandLateralMenu, false)
});

let lateralMenuExpanded = false
let currentSection;

    
const options = {
      root: scrollRoot,
      rootMargin: '-400px 0px',
      threshold: 0
}



document.addEventListener('readystatechange', e => {
      if (e.target.readyState === 'complete') {
            updateMarker(sections[0])
      }
})



let direction = 'up'
let prevYPosition = 0

const setScrollDirection = () => {
      if (scrollRoot.scrollTop > prevYPosition) {
            direction = 'down'
      } else {
            direction = 'up'
      }

      prevYPosition = scrollRoot.scrollTop
}


const shouldUpdate = (entry) => {
      if (direction === 'down' && !entry.isIntersecting) {
            return true
      }

      if (direction === 'up' && entry.isIntersecting) {
            return true
      }

      return false
}


const getTargetSection = (target) => {
      if (direction === 'up') return target

      if (target.nextElementSibling) {
            return target.nextElementSibling
      } else {
            return target
      }
}


/* The callback that will fire on intersection */
const onIntersect = (entries) => {
      entries.forEach((entry) => {
            setScrollDirection()

            /* Do nothing if no need to update */
            if (!shouldUpdate(entry)) return

            const target = getTargetSection(entry.target)
            
            if (target.id == 'portada') {
                  hideLateralMenu(true)
            }
            else {
                  hideLateralMenu(false)
                  updateMarker(target)
            }
      })
}

/* Create the observer */
const observer = new IntersectionObserver(onIntersect, options)

/* Set our observer to observe each section */
sections.forEach((section) => {
      observer.observe(section)
})


const hideLateralMenu = (hide) => {
      if (hide) {
            if (!lateralMenu.classList.contains('hidden')) lateralMenu.classList.add('hidden');
      }
      else {
            if (lateralMenu.classList.contains('hidden')) lateralMenu.classList.remove('hidden');
      }
}


function expandLateralMenu() {
      if (lateralMenuExpanded) {
            if (lateralMenu.classList.contains('expanded')) {
                  lateralMenu.classList.remove('expanded')
            }
            touchArea.classList.remove('active')
            lateralMenuExpanded = false;
            if (this.dataset.link)
            document.getElementById(this.dataset.link).scrollIntoView();
      }
      else {
            if (this.dataset.link === currentSection || this.id === 'menu-button-wrapper') {
                  touchArea.classList.add('active');
                  lateralMenu.classList.add('expanded');
                  lateralMenuExpanded = true;
            }
            else {
                  if (this.dataset.link)
                  document.getElementById(this.dataset.link).scrollIntoView();
            }
      }
}



function expandRightMenu() {
      rightMenu.classList.add('expanded');
      mainWrapper.classList.add('moved');
      lateralMenu.classList.add('lat-moved');
      
}

function hideRightMenu() {
      rightMenu.classList.remove('expanded');
      mainWrapper.classList.remove('moved');
      lateralMenu.classList.remove('lat-moved');
}


const updateMarker = (target) => {
      const id = target.id

      /* Do nothing if no target ID */
      if (!id) return
      
      currentSection = id

      /* Find the corresponding nav link, or use the first one */
      let link = headerLinks.find((el) => {
            return el.dataset.link === id
      })

      link = link || headerLinks[0]

      /* Get the values and set the custom properties */
      const distanceFromTop = link.getBoundingClientRect().top

      marker.style.setProperty('--markerTop', `${distanceFromTop}px`)
}
