import React from 'react';
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    ImageBackground,
    Image,
    Dimensions,
    ScrollView, 
    TouchableOpacity,
    StatusBar,
    Platform
  } from 'react-native';

  
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/SimpleLineIcons';
  import Icon9 from 'react-native-vector-icons/Fontisto';

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import AuthServices from '../../api/authservices';
  import NetworkCheck from '../../utils/networkcheck';
  import { WebView } from 'react-native-webview';

export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          title:'',
          image:'',
          text:'',
          loading:false,
      };

      this.onGoogleClick = this.onGoogleClick.bind(this);
      this.onRegisterClick = this.onRegisterClick.bind(this);
    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            console.log(this.state.userdata)
            this.ApiCall();
        })
    }

    async ApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("langid",this.state.userdata.lang_id)
        this.setState({
            appLoading: true
        })

        try {
            const { data } = await AuthServices.AboutUs(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    appLoading: false
                })
                this.dropDownAlertRef.alertWithType('error', 'Something went wrong ...');
            }

            if( data.status == 1){
                this.setState({
                    title: data.data[2].page_name,
                    image: data.data[2].image,
                    text: data.data[2].description,
                    appLoading: false
                })
            }

          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', 'Failed', "Authentication Failed");
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', 'No Internet Connection', "please check your device connection");
        }
    }




    onGoogleClick(){
        this.props.navigation.replace('MainTabSeeker');
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
        <ImageBackground source={this.state.text} style={styles.backgroundImage} resizeMode='stretch' >
        <View style={styles.subcontainer1}>
            <Text style={styles.pageheader}>{this.state.title}</Text>
        </View>
        <View style={styles.subcontainer2}>
        <Image source={{uri: `${this.state.image}`}}  style={{height:hp('43%'),width:hp('43%')}} resizeMode='contain'></Image>
        </View>

        <WebView
                    source={{ html: this.state.text }}
                    style={[styles.subcontainer3]}
        />
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
        backgroundColor:"#fff" ,
    },
    subcontainer1:{
        height:hp('7%'),
        justifyContent:'center',
        marginLeft:wp('11%')
    },
    subcontainer2:{
        height:hp('43%'),
        justifyContent:'center',
        alignItems:"center"
    },
    subcontainer3:{
        height:hp('50%'),
        width:wp('90%'),
        alignSelf:"center",
        marginTop:hp('5%'),
    },

    backgroundImage: {
        flex: 1,
    },
    pageheader:{
        fontSize:hp('3%'),
        color:'#4F45F0'
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
    pagesubheader:{
        fontSize:hp('2%'),
        textAlign:"left",
        alignSelf:"flex-start"
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F01a',
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
        marginTop:15,
        height:55,
        width:Dimensions.get('window').width-70,
        borderRadius:7,
        justifyContent:'center',
        alignItems:'center'
    },
    loginButtonText:{
        color:'white',
        fontSize:25
    },
    socialButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F01a',
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
    



})