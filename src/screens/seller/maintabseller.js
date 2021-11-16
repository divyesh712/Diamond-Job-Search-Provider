import React,{ useState , useEffect} from 'react';
import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList} from '@react-navigation/drawer';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import HomeSeller from './homeseller';
import ProfileSeller from './profileseller';
import CartSeller from './cartseller';
import FavouriteSeller from './favouriteseller';
import MyOrderSeller from './myorderseller';
import SettingSeller from './settingseller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MyLanguage} from '../../utils/languagehelper';



function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }

const Drawer = createDrawerNavigator();

const MainTabSeller = () => {
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
    <Drawer.Navigator 
        initialRouteName="HomeSeller" 
        drawerType={"slide"}
        drawerStyle={{ width:wp('50%'),backgroundColor:"#4F45F0" }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        drawerContentOptions={{
            activeTintColor: 'white',
            inactiveBackgroundColor:"#4F45F0",
            itemStyle: { marginVertical: hp('1%') },
            labelStyle:{color:'#fff'}
          }}

        >
    <Drawer.Screen name={'Home'} options={{ drawerLabel:renderLanguage.home }} component={HomeSeller} />
    <Drawer.Screen name={'Profile'} options={{ drawerLabel:renderLanguage.profile }} component={ProfileSeller} />
    <Drawer.Screen name={'My Cart'} options={{ drawerLabel:renderLanguage.mycart }} component={CartSeller} />
    <Drawer.Screen name={'Favourite'} options={{ drawerLabel:renderLanguage.favourite }} component={FavouriteSeller} />
    <Drawer.Screen name={'My Orders'} options={{ drawerLabel:renderLanguage.myorders }} component={MyOrderSeller} />
    <Drawer.Screen name={'Settings'} options={{ drawerLabel:renderLanguage.settings }} component={SettingSeller} />
    </Drawer.Navigator>
  );
}

export default MainTabSeller;