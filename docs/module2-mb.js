const style = href => {
  const e = document.createElement('link')
  e.href = href
  e.rel = 'stylesheet'
  document.head.appendChild(e)
}

const script = src => {
  const e = document.createElement('script')
  e.src = src
  document.head.appendChild(e)
}

const init = () => {
  style('style.css')
  style('mapbox-gl-js/v2.8.2/mapbox-gl.css')
  script('mapbox-gl-js/v2.8.2/mapbox-gl.js')

  const inputs = document.getElementById('menu').getElementsByTagName('input');
  for (const input of inputs) {
    input.onclick = (layer) => {
      map.setStyle(layer.target.id)
    }
  }
}
init()

const mapgl = mapboxgl
mapgl.accessToken = 
    'pk.eyJ1IjoidC11YnVrYXdhIiwiYSI6ImNrb3NuemYxeDAwazQybm55YXUwZ281MmkifQ.MDqjOP45DIUcpLSCI9JAGg'

let map
const showMap = async (texts) => {
  map = new mapgl.Map({
    container: 'map',
    hash: true,
    style: 'style2.json',
    maxZoom: 20,
    maxPitch: 85
  })
  map.addControl(new mapgl.NavigationControl())
  map.addControl(new mapgl.ScaleControl({
    maxWidth: 200, unit: 'metric'
  }))

  let voice = null
  for(let v of speechSynthesis.getVoices()) {
    console.log(v.name)
    if ([
      'Daniel',
      'Google UK English Male',
      'Microsoft Libby Online (Natural) - English (United Kingdom)'
    ].includes(v.name)) voice = v
  }

  map.on('load', () => {
    map.on('click', 'voxel', e => {
      let u = new SpeechSynthesisUtterance()
      u.lang = 'en-GB'
      u.text = 'a voxel of ' + e.features[0].properties.spacing + 'meters.'
      if (voice) u.voice = voice
      speechSynthesis.cancel()
      speechSynthesis.speak(u)
    })
    map.on('moveend', e => {
      let fs = map.queryRenderedFeatures(
	[window.innerWidth / 2, window.innerHeight / 2], 
        { layers : ['voxel'] }
      )
      if (fs.length == 0) return
      let height = fs[0].properties.h 
      console.log(height)
    })
  })
}

window.onload = () => {
  showMap()
}