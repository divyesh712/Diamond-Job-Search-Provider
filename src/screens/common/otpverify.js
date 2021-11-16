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
  
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import AppLoader from '../component/loader';
import DropdownAlert from 'react-native-dropdownalert';
import AuthServices from '../../api/authservices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetworkCheck from '../../utils/networkcheck';

export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          otpCode:'',
          appLoading:false,
      };

      this.onResendOtpClick = this.onResendOtpClick.bind(this);
      this.onSubmitClick = this.onSubmitClick.bind(this);
      this.onSuccess = this.onSuccess.bind(this);

    }

    componentDidMount(){}

    onResendOtpClick(){
        console.log('Outside value =',this.state.otpCode);
    }

    async onSubmitClick(code){

        this.setState({appLoading:true,otpCode:code})

        console.log('State =',this.state.otpCode);
        console.log('param =',code);
        if(code == "1111" ){
          this.setState({appLoading:false})
          this.dropDownAlertRef.alertWithType('success', 'Number Verified !', "",null,1500)

          setTimeout( () => {
            this.onSuccess();
          },2000);

        }else{
          this.setState({otpCode:'',appLoading:false})
          this.dropDownAlertRef.alertWithType('error', 'Otp Invalid !', "try again",null,1500)  
        }
    }


    onSuccess(){
      this.props.navigation.replace('ResetPassword');
    }

    isEmptyString(code){
      if(code=== ''){
        return true
      }else{
        return false
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
        <View style={styles.subcontainer1}>
            <Text style={styles.pageheader}>Verify Number</Text>
            <Text style={{fontSize:hp('1.8%'),color:"#0000005a",marginTop:hp('1%')}}>enter otp sent to your device</Text>
        </View>
        <View style={styles.subcontainer2}>
 
 
            <OTPInputView
                style={{ height: hp('30%'),width:wp("70%") ,alignSelf:"center"}}
                pinCount={4}
                code={this.state.otpCode} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                onCodeChanged = {otpCode => { this.setState({otpCode})}}
                clearInputs={this.isEmptyString(this.state.otpCode)} 
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                placeholderTextColor='#000'
                onCodeFilled = {(code => {
                      this.onSubmitClick(code);
                })}
            />
 
 
 
 
            {/* <TouchableOpacity onPress={this.onSubmitClick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity> */}
 
 
            <TouchableOpacity  onPress={this.onResendOtpClick} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Resend Otp ?</Text>
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
      height:hp('100%'),
      width:wp('100%'),
      backgroundColor:"#fff" 
  },
  subcontainer1:{
      height:hp('15%'),
      justifyContent:'center',
      marginLeft:hp('7%')
  },
  subcontainer2:{
      height:hp('85%'),
      alignItems:'center',
  },
  backgroundImage: {
      height:hp('100%'),
      width:wp('100%'),
  },
  pageheader:{
    fontSize:hp('3.5%'),
    color:'#4F45F0'
},
forgotPasswordText:{
  fontSize:hp('2.5%'),
  color:'#4F45F0',
},
forgotPasswordContainer:{
  marginTop:hp('2%'),
  marginRight:hp('7'),
  alignSelf:'flex-end'
},
pagesubheader:{
  marginTop:hp('2%'),
  fontSize:hp('2.5%')
},
  iconInputContainer:{
      flexDirection:'row',
      alignItems:'center',
      backgroundColor:'#EDECFC',
      marginHorizontal:'10%',
      marginTop:15,
      height:55,
      width:Dimensions.get('window').width-70,
      borderRadius:7,
  },
  iconInputField:{
      marginLeft:5,
      flex:1,
      color:"#000"
  },
  iconInputImage:{
      height:25,
      width:25,
      margin:10
  },
  loginButtonContainer:{
      flexDirection:'row',
      alignItems:'center',
      backgroundColor:'#4F45F0',
      marginHorizontal:'10%',
      marginTop:35,
      height:55,
      width:Dimensions.get('window').width-70,
      borderRadius:7,
      justifyContent:'center',
      alignItems:'center'
  },
  loginButtonText:{
      color:'white',
      fontSize:21
  },
  socialButtonContainer:{
      flexDirection:'row',
      alignItems:'center',
      backgroundColor:'#EDECFC',
      marginTop:20,
      marginHorizontal:10,
      height:55,
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

  borderStyleBase: {
    width: 30,
    height: 45
  },
 
  borderStyleHighLighted: {
    borderColor: "#4F45F0",
  },
 
  underlineStyleBase: {
    width: hp('5%'),
    height: hp('7%'),
    borderWidth: 0,
    borderBottomWidth: 1,
    color:"#4F45F0",
    borderColor: "#000",
  },
 
  underlineStyleHighLighted: {
    borderColor: "#4F45F0",
  },
  
})