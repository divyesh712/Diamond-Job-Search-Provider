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
import HomeSeeker from './homeseeker';
import AppliedJobSeeker from './appliedjobseeker';
import SavedJobSeeker from './savedjobseeker';
import ProfileSeeker from './profileseeker';
import { MyLanguage } from '../../utils/languagehelper';
import AsyncStorage from '@react-native-async-storage/async-storage';




const Tab = createMaterialBottomTabNavigator();

const MainTabSeeker = (props) => {
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

  const temp = props.route.params ? props.route.params : 0
return(
    <Tab.Navigator
    initialRouteName="HomeSeeker"
    activeColor="#4F45F0"
    barStyle={{ backgroundColor: 'white' }}
  >
    <Tab.Screen
      name="HomeSeeker"
      component={HomeSeeker}
      initialParams={temp}
      unmountOnBlur={true}
      options={{
        tabBarLabel: renderLanguage.home,
        unmountOnBlur: true,
        tabBarIcon: ({ color }) => (
          <Image source={color == '#4F45F0' ? require('../../assets/icon/home.png') : require('../../assets/icon/home_1.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
        ),
      }}
      
    />
    <Tab.Screen
      name="AppliedJobSeeker"
      component={AppliedJobSeeker}
      options={{
        tabBarLabel: renderLanguage.appliedjob,
        tabBarIcon: ({ color }) => (
          <Image source={color == '#4F45F0' ? require('../../assets/icon/postadd_1.png') : require('../../assets/icon/postadd.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>

        ),
      }}
    />
    <Tab.Screen
      name="SavedJobSeeker"
      component={SavedJobSeeker}
      options={{
        tabBarLabel: renderLanguage.savedjob,
        tabBarIcon: ({ color }) => (
          <Image source={color == '#4F45F0' ? require('../../assets/icon/bookmark.png') : require('../../assets/icon/bookmark_black.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
        ),
      }}
    />
    <Tab.Screen
      name="ProfileSeeker"
      component={ProfileSeeker}
      options={{
        tabBarLabel: renderLanguage.profile,
        tabBarIcon: ({ color }) => (
          <Image source={color == '#4F45F0' ? require('../../assets/icon/user.png') : require('../../assets/icon/user_1.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
        ),
      }}
    />
  </Tab.Navigator>
)
}

export default MainTabSeeker;