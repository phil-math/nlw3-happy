import  React,{useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {FiPlus, FiArrowRight} from 'react-icons/fi'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet'
import mapMarkerIcon from '../utils/mapIcon'

import markImg from '../images/mark.svg'

import '../styles/pages/orphanages-map.css'
import api from '../services/api'


interface Orphanages{
    id:number    
    name:string
    latitude:number
    longitude:number
}

function OrphanagesMap(){
  const [orphanages,setOrphanages] = useState<Orphanages[]>([])

  useEffect(()=>{
    api.get('orphanages').then(response=>{
      setOrphanages(response.data)
    })
  },[])

  console.log(process.env.REACT_APP_MAPBOX_TOKEN)
  return (
    <div id='page-map'>
      <aside>
        <header>
          <img src={markImg} alt="Happy"/>
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>
        <footer>
          <strong>Fortaleza</strong>
          <span>Ceará</span>
        </footer>
      </aside>
      <Map
        center={[-3.7917793,-38.5165226]}
        zoom={15}
        style={{width:'100%',height:'100%'}}
      >
        <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}/>
      
        {orphanages.map(orphanage=>(
          <Marker 
            key={orphanage.id}
            icon={mapMarkerIcon}
            position={[orphanage.latitude,orphanage.longitude]}
          >
            <Popup             
              closeButton={false}
              minWidth={240}
              maxWidth={240}
              className='map-popup'
            >
              {orphanage.name}
              <Link to={`/orphanage/${orphanage.id}`}>
                <FiArrowRight size={32} color='#fff'/>
              </Link>
            </Popup>
          </Marker>
        ))}
      </Map>
      <Link to="/orphanage/new" className='to-create'>
        <FiPlus size={32} color="#fff"/>
      </Link>
    </div>
  );
}

export default OrphanagesMap