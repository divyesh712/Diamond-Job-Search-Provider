import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    Image,
    Dimensions,
    StatusBar
  } from 'react-native';


import AsyncStorage from '@react-native-async-storage/async-storage';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import messaging from '@react-native-firebase/messaging';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          userdata:null,
      };
    }

    componentDidMount(){
        this.onNotificationReceive()
        setTimeout(() => {
            this.getUserData();
        }, 3000);


    }

    onNotificationReceive()
    {
            // Assume a message-notification contains a "type" property in the data payload of the screen to open
            messaging().onNotificationOpenedApp(remoteMessage => {
              console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
              );
            //   navigation.navigate(remoteMessage.data.type);
            });
        
            // Check whether an initial notification is available
            messaging()
              .getInitialNotification()
              .then(remoteMessage => {
                if (remoteMessage) {
                  console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                  );
                //   setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
                }
              });  
    }

    async getUserData() {
        var value = await AsyncStorage.getItem('User');
        if (value == null){
            this.props.navigation.replace('LandingPage');
        } 
        else {
            AsyncStorage.getItem("User").then((value) => {
                var mainValue = JSON.parse(value)
                console.log(mainValue);
                if (mainValue.type == 0) {
                    this.props.navigation.replace('MainTabSeeker');
                } 
                 else if (mainValue.type == 1) {
                    this.props.navigation.replace("MainTabProvider");
                } 
                else if (mainValue.type == 2) {
                    this.props.navigation.replace("MainTabSeller");
                } 
            }).done();
        }
    }

    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
        <View style={styles.subcontainer}>
                <View style={styles.CircleShapeView}>
                <Image source={require('../../assets/image/splash_logo.png')} style={styles.image} resizeMode='contain'></Image>
                </View>

                <Text style={styles.logotext}>Di'mand</Text>
        </View>
        </ImageBackground> 
        </View>
      );
    }
}

const styles = StyleSheet.create({
    maincontainer:{
        height: hp('100%'),
        width: wp('100%') ,
        backgroundColor:"#fff" 
    },
    subcontainer:{
        height: hp('100%'),
        width: wp('100%') ,
        alignItems:'center',
        justifyContent:'center' 
    },
    logotext:{
        color:'#4F45F06a',
        fontSize:hp('5%'),
        alignItems:'center',
        marginTop:hp('5%')
    },
    image:{
        height:hp('90%'),
        width:wp('90%')
    },
    backgroundImage: {
        height: hp('100%'),
        width: wp('100%') ,
    },
    CircleShapeView: {
        width: hp('35%'),
        height: hp('35%'),
        borderRadius: hp('35%')/2,
        backgroundColor: '#4F45F0',
        alignItems:'center',
        justifyContent:'center'
    },
})