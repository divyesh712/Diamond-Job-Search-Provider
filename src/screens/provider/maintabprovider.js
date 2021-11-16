import React,{useState,useEffect} from 'react';
import {
  Image,
} from 'react-native';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import HomeProvider from './homeprovider';
import ActiveJobProvider from './activejobprovider';
import AllJobProvider from './alljobprovider';
import ProfileProvider from './profileprovider';
import { MyLanguage } from '../../utils/languagehelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialBottomTabNavigator();

const MainTabProvider = (props) => {

  const [userdata, setuserdata] = useState({});
  const [renderLanguage, setrenderLanguage] = useState(MyLanguage.gj);


  useEffect( () => {
    //this is component will mount
    getUserData();
  },[]);

  useEffect(() => {
   setLanguage();
  }, [userdata]);

  
  const getUserData = async() => {
    var value = await AsyncStorage.getItem('User');
    value = JSON.parse(value);
    setuserdata(value)
  }
  
  const setLanguage = () => {
    console.log('i am here 1111111111111111111111111111233333333333333333333333333333333 ========== ',userdata.lang_id)
    if(userdata.lang_id == '0' ){
      setrenderLanguage(MyLanguage.en);
      }
      if(userdata.lang_id == '1' ){
        setrenderLanguage(MyLanguage.hi);
      }
      if(userdata.lang_id == '2' ){
        setrenderLanguage(MyLanguage.gj);
      }
  }


  return(
    <Tab.Navigator
    initialRouteName="HomeProvider"
    activeColor="#4F45F0"
    barStyle={{ backgroundColor: 'white' }}
  >
    <Tab.Screen
      name="HomeProvider"
      component={HomeProvider}
      options={{
        tabBarLabel:renderLanguage.home,
        tabBarIcon: ({ color }) => (
          <Image source={color == '#4F45F0' ? require('../../assets/icon/home.png') : require('../../assets/icon/home_1.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
        ),
      }}
    />
    <Tab.Screen
      name="ActiveJobProvider"
      component={ActiveJobProvider}
      options={{
        tabBarLabel:renderLanguage.activejobs,
        tabBarIcon: ({ color }) => (
          <Image source={color == '#4F45F0' ? require('../../assets/icon/postadd_1.png') : require('../../assets/icon/postadd.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
        ),
      }}
    />
    <Tab.Screen
      name="AllJobProvider"
      component={AllJobProvider}
      options={{
        tabBarLabel: renderLanguage.alljobs,
        tabBarIcon: ({ color }) => (
          <Image source={color == '#4F45F0' ? require('../../assets/icon/bookmark.png') : require('../../assets/icon/bookmark_black.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
        ),
      }}
    />
    <Tab.Screen
      name="ProfileProvider"
      component={ProfileProvider}
      options={{
        tabBarLabel: renderLanguage.profile,
        tabBarIcon: ({ color }) => (
          <Image source={color == '#4F45F0' ? require('../../assets/icon/user.png') : require('../../assets/icon/user_1.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
        ),
      }}
    />
  </Tab.Navigator>
);
}


export default MainTabProvider;