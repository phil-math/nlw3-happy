import React,{useState,useEffect, FormEvent, ChangeEvent} from "react";
import { useHistory } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { Map, Marker, TileLayer } from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet'

import happyMapIcon from '../utils/mapIcon';
import Sidebar from '../components/Sidebar'

import '../styles/pages/create-orphanage.css';
import api from "../services/api";

export default function CreateOrphanage() {
    const history = useHistory()

    const [position,setPosition] = useState({latitude:0,longitude:0})
    const [mapSetupPosition, setMapSetupPosition] = useState({
      latitude:0,
      longitude:0,
      zoom:3
    })

    const [name,setName] = useState('')
    const [about,setAbout] = useState('')
    const [instructions,setInstructions] = useState('')
    const [opening_hours,setOpeningHours] = useState('')
    const [open_on_weekends,setOpenOnWeekends] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [previewImages,setPreviewImages] = useState<string[]>([])

  useEffect(()=>{

    const geolocation = navigator.geolocation
    if(geolocation){
      geolocation.getCurrentPosition(currentPosition=>{
        const {latitude, longitude} = currentPosition.coords
        setMapSetupPosition({latitude,longitude,zoom:14})
      },err=>console.log(err))
    }

  },[])

  function handleMapClick(event:LeafletMouseEvent){
    const {lat,lng} = event.latlng
    setPosition({
      latitude:lat,
      longitude:lng
    })
  }

  function handleSelectImages(event:ChangeEvent<HTMLInputElement>){
    if(!event.target.files){
      return;
    }

    const selectedImages = Array.from(event.target.files)
    const selectedImagesPreview = selectedImages.map(image=>URL.createObjectURL(image))

    setPreviewImages(selectedImagesPreview)
    setImages(selectedImages)    
  }

  async function handleSubmit(event:FormEvent){

    event.preventDefault()
    const {latitude,longitude} = position
    const data = new FormData()
    
    data.append('name',name)
    data.append('about',about)
    data.append('instructions',instructions)
    data.append('latitude',String(latitude))
    data.append('longitude',String(longitude))
    data.append('opening_hours',opening_hours)
    data.append('open_on_weekends',String(open_on_weekends))

    images.forEach(image=>{
      data.append('images',image)
    })

    await api.post('orphanages/new',data)

    history.push('/app')
  }


  return (
    <div id="page-create-orphanage">
      
      <Sidebar/>

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[mapSetupPosition.latitude,mapSetupPosition.longitude]} 
              style={{ width: '100%', height: 280 }}
              zoom={mapSetupPosition.zoom}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {position.latitude !== 0 && <Marker interactive={false} icon={happyMapIcon} position={[position.latitude, position.longitude]} />}
              
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={event=>setName(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="about" value={about} onChange={event=>setAbout(event.target.value)} maxLength={300} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image=>(
                  <img key={image} src={image} alt={name}></img>
                ))}                
                <label  htmlFor="images[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                  <input multiple onChange={handleSelectImages} type="file" id="images[]"/>
                </label>
              </div>

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={event=>setInstructions(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horários</label>
              <input id="opening_hours" value={opening_hours} onChange={event=>setOpeningHours(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button" 
                  className={open_on_weekends ? "active" : ''}
                  onClick={()=>setOpenOnWeekends(true)}
                >Sim</button>
                <button 
                  type="button"
                  className={!open_on_weekends ? "active" : ''}
                  onClick={()=>setOpenOnWeekends(false)}
                >Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
