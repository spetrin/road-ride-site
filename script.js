document.addEventListener('DOMContentLoaded', function(){
  const y = new Date().getFullYear()
  document.getElementById('year').textContent = y
  const ids = ['year2','year3']
  ids.forEach(id => {
    const el = document.getElementById(id)
    if(el) el.textContent = y
  })

  const btn = document.querySelector('.menu-btn')
  const nav = document.querySelector('.nav')
  if(btn && nav){
    btn.addEventListener('click', ()=> {
      nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex'
      nav.style.flexDirection = 'column'
      nav.style.gap = '12px'
      nav.style.background = '#fff'
      nav.style.padding = '12px'
      nav.style.position = 'absolute'
      nav.style.right = '20px'
      nav.style.top = '64px'
      nav.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)'
    })
  }
})