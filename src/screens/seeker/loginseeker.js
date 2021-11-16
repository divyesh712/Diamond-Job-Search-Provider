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
    Keyboard,
    Platform
  } from 'react-native';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AppLoader from '../component/loader';
import DropdownAlert from 'react-native-dropdownalert';
import AuthServices from '../../api/authservices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetworkCheck from '../../utils/networkcheck';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          mobile:'',
          password:'',
          my_fb_obj:{
              type:0,
              firstname:null,
              lastname:null,
              email:null,
              fb_id:null,
              device_type:null,
              device_token:null
          },

          my_google_obj:{
            type:0,
            firstname:null,
            lastname:null,
            email:null,
            google_id:null,
            device_type:null,
            device_token:null
        },
          togglePasswordVisibility:true,
          appLoading:false,
      };

      this.onForgotPasswordClick = this.onForgotPasswordClick.bind(this);
      this.onLoginClick = this.onLoginClick.bind(this);
      this.onFacebookClick = this.onFacebookClick.bind(this);
      this.onGoogleClick = this.onGoogleClick.bind(this);
      this.onRegisterClick = this.onRegisterClick.bind(this);
      this.registerGOOGLEuser = this.registerGOOGLEuser.bind(this);
      this.registerFBuser = this.registerFBuser.bind(this);

    }

    componentDidMount(){
        GoogleSignin.configure({
            webClientId: '1019554328431-90r8be1ntde50avcor2s7letf9fvnjns.apps.googleusercontent.com',
          });
        GoogleSignin.signOut()
        LoginManager.logOut() 
        auth().signOut()

        auth().onAuthStateChanged( (user) => {
            if (user) {
                // Obviously, you can add more statements here,
                //       e.g. call an action creator if you use Redux.
                console.log("FIREBASE Auth Changed !!");
                console.log("login --> ",user);
                // alert(JSON.stringify(user))
                // that.loginusersoc()
      
                // auth().signOut()
                // navigate the user away from the login screens:
                // props.navigation.navigate("PermissionsScreen");
            }
            else
            {
                // reset state if you need to
                console.log("FIREBASE Auth Changed !!");
                console.log("logout");
      
                // dispatch({ type: "reset_user" });
            }
        });
    }

    onForgotPasswordClick(){
        this.props.navigation.navigate('ForgotPassword');
    }

    async onLoginClick(){

        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable();

        if (isConnected) {  

            if(this.state.mobile.trim() == ''){
                this.setState({mobile:''},()=>{this.mobileInputRef.focus(); })
                this.dropDownAlertRef.alertWithType('error',"Mobile Number cannot be blank");
              return
            }
            if(this.state.mobile.length < 10 ){
                this.mobileInputRef.focus();
                this.dropDownAlertRef.alertWithType('error',"Number should contain atleast 10 digits");
              return
            }
            if(this.state.password == ''){
                this.passwordInputRef.focus();
                this.dropDownAlertRef.alertWithType('error',"Password cannot be blank");
              return
            }
            if(this.state.password.length < 6 ){
                this.passwordInputRef.focus();
                this.dropDownAlertRef.alertWithType('error',"Password should contain atleast 6 letters");
              return
            }

            let myFormData = new FormData();
            myFormData.append("mobile_no",this.state.mobile)
            myFormData.append("password", this.state.password)
            myFormData.append("type",0)
            myFormData.append("device_type",Platform.OS)
            myFormData.append("device_token",'test123')

            try {
                this.setState({appLoading: true})
                const { data } = await AuthServices.LoginUser(myFormData)
                console.log(data);

                if( data.status == 0 ){
                    this.setState({appLoading: false})
                    this.dropDownAlertRef.alertWithType('error', 'Invalid Number or Password', "Try Again");
                }

                if( data.status == 1){
                    this.setState({appLoading: false})
                    await AsyncStorage.setItem('User',JSON.stringify(data.userdata[0])).then(this.props.navigation.popToTop(),this.props.navigation.replace('MainTabSeeker'))                
                }
                this.setState({appLoading: false})
            }
            catch(error){
                console.log(error)
                this.setState({appLoading: false})
                console.log(error.data)
                this.dropDownAlertRef.alertWithType('error', " Server Error : 500 ");
            }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', 'No Internet Connection', "please check your device connection");
        }
    }

    async onFacebookClick(){

        Keyboard.dismiss();

        try{

            const result = await LoginManager.logInWithPermissions(["email", "public_profile"]);

            if (result.isCancelled) {
              throw 'User cancelled the login process';
            }

            this.setState({appLoading:true})
          
            // Once signed in, get the users AccesToken
            const data = await AccessToken.getCurrentAccessToken();
          
            if (!data) {
              throw 'Something went wrong obtaining access token';
            }

            console.log('FB RESULT-1 ---->>>',data);
          
            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

            // Sign-in the user with the credential
            let firebaseresult = await auth().signInWithCredential(facebookCredential);

            console.log('FB RESULT-2 ---->>>',firebaseresult);

            this.setState({
                my_fb_obj:{
                    type:0,
                    firstname:firebaseresult.additionalUserInfo.profile.first_name,
                    lastname:firebaseresult.additionalUserInfo.profile.last_name,
                    email:firebaseresult.additionalUserInfo.profile.email,
                    fb_id:firebaseresult.additionalUserInfo.profile.id,
                    device_type:Platform.OS,
                    device_token:data.accessToken
                },   
            },()=>{
                this.registerFBuser();
            })
  
        }
        catch(error){
            this.setState({appLoading:false})
            console.log('Firebase/Sign In Error ',error);
            this.dropDownAlertRef.alertWithType('error', 'Facebook Login Failed', "Firebase/Signin Error");
        }
    }

    async registerFBuser(){
        console.log("Facebook Register this ----------------------->",this.state.my_fb_obj)
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();

        if(this.state.my_fb_obj.type != 0){
            this.dropDownAlertRef.alertWithType('error',"User-type Error");
            return
        }else{
            myFormData.append("type",this.state.my_fb_obj.type)
        }

        if(this.state.my_fb_obj.firstname == null){
            this.dropDownAlertRef.alertWithType('error',"First Name Error");
            return
        }else{
            myFormData.append("firstname",this.state.my_fb_obj.firstname)
        }

        if(this.state.my_fb_obj.lastname == null){
            this.dropDownAlertRef.alertWithType('error',"Last Name Error");
            return
        }else{
            myFormData.append("lastname",this.state.my_fb_obj.lastname)
        }

        // if(this.state.my_fb_obj.email == null){
        //     this.dropDownAlertRef.alertWithType('error',"Email Error");
        //     return
        // }else{
        //     myFormData.append("email",this.state.my_fb_obj.email)
        // }

        if(this.state.my_fb_obj.fb_id == null){
            this.dropDownAlertRef.alertWithType('error',"Facebook ID Error");
            return
        }else{
            myFormData.append("facebook_id",this.state.my_fb_obj.fb_id)
        }

        if(this.state.my_fb_obj.device_type == null){
            this.dropDownAlertRef.alertWithType('error',"Device Type Error");
            return
        }else{
            myFormData.append("device_type",this.state.my_fb_obj.device_type)
        }

        if(this.state.my_fb_obj.device_token == null){
            this.dropDownAlertRef.alertWithType('error',"Device Token Error");
            return
        }else{
            myFormData.append("device_token",this.state.my_fb_obj.device_token)
        }

        try {
            const { data } = await AuthServices.FbRegister(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appLoading: false})
                this.dropDownAlertRef.alertWithType('error', 'APi Status : 0', "Try Again"); 
            }

            if( data.status == 1){
                this.setState({appLoading: false})
                await AsyncStorage.setItem('User',JSON.stringify(data.userdata[0])).then( this.props.navigation.replace('MainTabSeeker') );  
            }
            this.setState({appLoading: false})
          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', " Server Error : 500 ");
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', 'No Internet Connection', "please check your device connection");
        }
    }

    async onGoogleClick(){
        Keyboard.dismiss();

        try{
              // Get the users ID token
            const googleresult = await GoogleSignin.signIn();
            console.log("GOOGLE USER Step - 1 --->",googleresult);

            this.setState({appLoading:true})
            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(googleresult.idToken);

            // Sign-in the user with the credential
            let result = await auth().signInWithCredential(googleCredential);

            console.log("GOOGLE USER Step - 2 --->",result);

            this.setState({
                my_google_obj:{
                    type:0,
                    firstname:googleresult.user.givenName,
                    lastname:googleresult.user.familyName,
                    email:googleresult.user.email,
                    google_id:googleresult.user.id,
                    device_type:Platform.OS,
                    device_token:googleresult.idToken
                },   
            },()=>{
                this.registerGOOGLEuser();
            })
        }
        catch(error){
            this.setState({appLoading:false})
            console.log('Firebase/Sign In Error ',error);
            this.dropDownAlertRef.alertWithType('error', 'Google Login Failed', "Firebase/Signin Error");
        }
    }

    async registerGOOGLEuser(){
        console.log("Google Register this ----------------------->",this.state.my_google_obj)
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();

        if(this.state.my_google_obj.type != 0){
            this.dropDownAlertRef.alertWithType('error',"User-type Error");
            return
        }else{
            myFormData.append("type",this.state.my_google_obj.type)
        }

        if(this.state.my_google_obj.firstname == null){
            this.dropDownAlertRef.alertWithType('error',"First Name Error");
            return
        }else{
            myFormData.append("firstname",this.state.my_google_obj.firstname)
        }

        if(this.state.my_google_obj.lastname == null){
            this.dropDownAlertRef.alertWithType('error',"Last Name Error");
            return
        }else{
            myFormData.append("lastname",this.state.my_google_obj.lastname)
        }

        if(this.state.my_google_obj.email == null){
            this.dropDownAlertRef.alertWithType('error',"Email Error");
            return
        }else{
            myFormData.append("email",this.state.my_google_obj.email)
        }

        if(this.state.my_google_obj.google_id == null){
            this.dropDownAlertRef.alertWithType('error',"Google ID Error");
            return
        }else{
            myFormData.append("google_id",this.state.my_google_obj.google_id)
        }

        if(this.state.my_google_obj.device_type == null){
            this.dropDownAlertRef.alertWithType('error',"Device Type Error");
            return
        }else{
            myFormData.append("device_type",this.state.my_google_obj.device_type)
        }

        if(this.state.my_google_obj.device_token == null){
            this.dropDownAlertRef.alertWithType('error',"Device Token Error");
            return
        }else{
            myFormData.append("device_token",this.state.my_google_obj.device_token)
        }

        try {
            const { data } = await AuthServices.GoogleRegister(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appLoading: false})
                this.dropDownAlertRef.alertWithType('error', 'APi Status : 0', "Try Again"); 
            }

            if( data.status == 1){
                this.setState({appLoading: false})
                await AsyncStorage.setItem('User',JSON.stringify(data.userdata[0])).then( this.props.navigation.replace('MainTabSeeker') );  
            }
            this.setState({appLoading: false})
          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', " Server Error : 500 ");
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', 'No Internet Connection', "please check your device connection");
        }
    }


    onRegisterClick(){
        this.props.navigation.navigate('RegisterSeeker');
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
            <Text style={styles.pageheader}>Login</Text>
        </View>
        <View style={styles.subcontainer2}>

            <View style={styles.iconInputContainer}>
            <Image source={require('../../assets/icon/mobile-phone.png')} style={styles.iconInputImage} resizeMode='contain'></Image>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.mobileInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.passwordInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = "Mobile Number"
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                keyboardType="phone-pad"
                onChangeText={(mobile) => this.setState({mobile})}  />
            </View>


            <View style={styles.iconInputContainer}>
            <Image source={require('../../assets/icon/padlock.png')} style={styles.iconInputImage} resizeMode='contain'></Image>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.passwordInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { Keyboard.dismiss() }}
                blurOnSubmit={false}            
                underlineColorAndroid = "transparent"
                placeholder = "Password"
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                secureTextEntry={this.state.togglePasswordVisibility}
                onChangeText={(password) => this.setState({password})}  />
            </View>

            <TouchableOpacity  onPress={this.onForgotPasswordClick} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onLoginClick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <Text style={{fontSize:hp('2.3%'),color:'#000',alignSelf:'center',marginTop:hp('3%')}}>Or Continue With</Text>

            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={this.onFacebookClick}style={styles.socialButtonContainer}>
                <Image source={require('../../assets/icon/facebook.png')} style={styles.socialButtonImage} resizeMode='contain'></Image>
                <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.onGoogleClick} style={styles.socialButtonContainer}>
                <Image source={require('../../assets/icon/google-glass-logo.png')} style={styles.socialButtonImage} resizeMode='contain'></Image>
                <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row',marginTop:hp('5%')}}>
            <Text style={{fontSize:hp('2.3%'),color:'#000',alignSelf:'center'}}>Don't have an account?</Text>
            <TouchableOpacity onPress={this.onRegisterClick}>
                <Text style={{fontSize:hp('2.3%'),color:'#4F45F0',alignSelf:'center'}}>  REGISTER</Text>
            </TouchableOpacity>
            </View>

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
        marginTop:hp('5%')
    },

    backgroundImage: {
        height: hp('100%'),
        width:wp('100%'),
    },
    pageheader:{
        fontSize:hp('4%'),
        color:'#4F45F0'
    },
    forgotPasswordText:{
        fontSize:hp('2.2%'),
        color:'#4F45F0',
    },
    forgotPasswordContainer:{
        marginTop:hp('2%'),
        marginRight:wp('12%'),
        alignSelf:'flex-end'
    },
    pagesubheader:{
        marginTop:hp('2%'),
        fontSize:16
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
        marginTop:hp('2%'),
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
        backgroundColor:'#EDECFC',
        marginTop:hp('2.3'),
        marginHorizontal:hp('1%'),
        height:hp('7%'),
        width:wp('41%'),
        borderRadius:hp('1.2%'),
    },
    socialButtonText:{
        marginHorizontal:hp('1%'),
        flex:1,
        color:"#4F45F0"
    },
    socialButtonImage:{
        height:hp('3%'),
        width:hp('3%'),
        margin:hp('2%')
    },
    
})