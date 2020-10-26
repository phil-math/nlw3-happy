import React,{useState} from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker,Callout} from 'react-native-maps'
import {RectButton} from 'react-native-gesture-handler'
import {Feather} from '@expo/vector-icons' 

import mapMarker from '../images/map-marker.png'
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import api from '../services/api';


interface Orphanage {
  id:number,
  name:string,
  latitude:number,
  longitude:number
}

export default function OrphanagesMap() {

    const [orphanages,setOphanages] = useState<Orphanage[]>([])
    const navigation = useNavigation()

  useFocusEffect(()=>{
    api.get('orphanages').then(response =>{
      setOphanages(response.data)
    })
  },[])

  function handleNavigateToDetails(id:number){
      navigation.navigate('OrphanageDetails',{id})
  }
  function handleNavigateToCreateOrphange(){
      navigation.navigate('SelectMapPosition')
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude:-3.7968543,
          longitude:-38.5091679,
          latitudeDelta:0.008,
          longitudeDelta:0.008,
        }}
      >
        {orphanages.map(orphanage=>(
          <Marker
            key={orphanage.id}
            icon={mapMarker}
            calloutAnchor={{
              x:2.7,
              y:0.85
            }}
            coordinate={{            
            latitude:orphanage.latitude,
            longitude:orphanage.longitude
            }}
          >
            <Callout tooltip onPress={()=>handleNavigateToDetails(orphanage.id)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>
                  {orphanage.name}
                </Text>
              </View>              
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {`${orphanages.length} orfanatos encontrados`}
        </Text>
        <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphange}>
          <Feather name='plus'size={20} color='#fff'/>
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height
  },
  calloutContainer:{
    width:160,
    height:46,
    paddingHorizontal:16,
    backgroundColor:'rgba(255,255,255,.95)',
    borderRadius:16,
    justifyContent:'center'
  },
  calloutText:{
    fontFamily:'Nunito_700Bold',
    color:'#0089a5',
    fontSize:14
  },
  footer:{  
    position:'absolute',
    left:24,
    right:24,
    bottom:32,

    backgroundColor:'#fff',
    borderRadius:20,
    height:56,
    paddingLeft:24,

    elevation:3,

    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  footerText:{
    fontFamily:'Nunito_700Bold',
    color:'#8fa7b3'
  },
  createOrphanageButton:{
    width:56,
    height:56,

    backgroundColor:'#15c3d6',
    borderRadius:20,

    elevation:3,

    justifyContent:'center',
    alignItems:'center'

    
  }
});
