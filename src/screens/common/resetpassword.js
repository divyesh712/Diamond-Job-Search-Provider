import React from 'react';
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    ImageBackground,
    Image,
    Dimensions, 
    TouchableOpacity,
    StatusBar,
    Keyboard
  } from 'react-native';

import AppLoader from '../component/loader';
import DropdownAlert from 'react-native-dropdownalert';
import AuthServices from '../../api/authservices';
import NetworkCheck from '../../utils/networkcheck';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          password1:'',
          password2:'',
          appLoading:false,
      };
      this.onSubmitClick = this.onSubmitClick.bind(this);
    }

    componentDidMount(){}

    onSubmitClick(){
        Keyboard.dismiss();

        if(this.state.password1.length < 1){
            this.setState({password1:''},()=>{this.password1InputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',"New Password cannot be blank");
          return
        }

        if(this.state.password1.length < 6){
            this.setState({password1:''},()=>{this.password1InputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',"New Password must be 6 characters");
          return
        }

        if(this.state.password2.length < 1){
            this.setState({password2:''},()=>{this.password2InputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',"Confirm Password cannot be blank");
          return
        }

        if(this.state.password2.length < 6){
            this.setState({password2:''},()=>{this.password2InputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',"Confirm Password must be 6 characters");
          return
        }

        if(this.state.password1.localeCompare(this.state.password2) != 0){
            this.setState({password1:'',password2:''},()=>{this.password1InputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',"Both Password must be same");
          return
        }

        this.props.navigation.pop(2);
    }

    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
        <View style={styles.subcontainer1}>
            <Text style={styles.pageheader}>Reset Password </Text>
        </View>
        <View style={styles.subcontainer2}>

            <View style={styles.iconInputContainer}>
            <Image source={require('../../assets/icon/padlock.png')} style={styles.iconInputImage} resizeMode='contain'></Image>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.password1InputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.password2InputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = "New Password"
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                onChangeText={(password1) => this.setState({password1})}  />
            </View>

            <View style={styles.iconInputContainer}>
            <Image source={require('../../assets/icon/padlock.png')} style={styles.iconInputImage} resizeMode='contain'></Image>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.password2InputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.onSubmitClick(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = "Confirm Password"
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                onChangeText={(password2) => this.setState({password2})}  />
            </View>

            <TouchableOpacity onPress={this.onSubmitClick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity>

        </View>
        </ImageBackground> 
        <DropdownAlert inactiveStatusBarStyle="light-content" inactiveStatusBarBackgroundColor="#4F45F0" ref={ref => this.dropDownAlertRef = ref} />
        <AppLoader isAppLoading={this.state.appLoading}/>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    maincontainer:{
        height: hp('100%'),
        width:wp('100%'),
        backgroundColor:"#ffffff"
    },
    subcontainer1:{
        height: hp('25%'),
        width:wp('100%'),
        justifyContent:'center',
        marginLeft:wp('15%')
    },
    subcontainer2:{
        height: hp('60%'),
        width:wp('100%'),        
        alignItems:'center',
    },

    backgroundImage: {
        height: hp('100%'),
        width:wp('100%'),
    },
    pageheader:{
        fontSize:hp('3.5%'),
        color:'#4F45F0'
    },
    pagesubheader:{
        marginTop:hp('1%'),
        fontSize:hp('2%'),
        color:'#000'
    },
    forgotPasswordText:{
        fontSize:22,
        color:'#4F45F0',
    },
    forgotPasswordContainer:{
        marginTop:15,
        marginRight:'10%',
        alignSelf:'flex-end'
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#EDECFC',
        alignSelf:"center",
        marginTop:hp('2%'),
        height:hp('7%'),
        width:wp('86%'),
        borderRadius:hp('1.2%'),
    },
    iconInputField:{
        marginHorizontal:hp('1%'),
        flex:1,
        color:"#4F45F0"
    },
    iconInputImage:{
        height:hp('3%'),
        width:hp('3%'),
        margin:hp('2%')
    },
    loginButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F0',
        marginHorizontal:'10%',
        marginTop:hp('5%'),
        height:hp('7%'),
        width:wp('70%'),
        borderRadius:hp('1.2%'),
        justifyContent:'center',
    },
    loginButtonText:{
        color:'white',
        fontSize:hp('3%')
    },
    socialButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F01a',
        marginTop:20,
        marginHorizontal:10,
        height:45,
        width:Dimensions.get('window').width/2-60,
        borderRadius:7,
    },
    socialButtonText:{
        color:'#4F45F0'
    },
    socialButtonImage:{
        height:25,
        width:25,
        margin:10
    },
    



})