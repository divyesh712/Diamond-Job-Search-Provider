import React from 'react';
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    ImageBackground,
    Image,
    FlatList,
    Dimensions, 
    TouchableOpacity,
    KeyboardAvoidingView ,
    StatusBar,
    ScrollView
  } from 'react-native';

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SellerServices from '../../api/sellerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import LottieView from 'lottie-react-native';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/Fontisto';

  import {MyLanguage} from '../../utils/languagehelper';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        loading:false,
        userdata:{},
        renderLanguage:MyLanguage.en
      };
      this.onHomeClick = this.onHomeClick.bind(this);
      this.onTrackOrderClick = this.onTrackOrderClick.bind(this);
    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            this.setLanguage();
        })
    }

    setLanguage(){
        if(this.state.userdata.lang_id == '0' ){
            this.setState({renderLanguage:MyLanguage.en})
        }
        if(this.state.userdata.lang_id == '1' ){
            this.setState({renderLanguage:MyLanguage.hi})
        }
        if(this.state.userdata.lang_id == '2' ){
            this.setState({renderLanguage:MyLanguage.gj})
        }
    }


    onHomeClick(){
        this.props.navigation.navigate('Home');
    }

    onTrackOrderClick(){
        this.props.navigation.navigate('Home');
    }

 
    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <DropdownAlert inactiveStatusBarStyle="light-content" inactiveStatusBarBackgroundColor="#4F45F0" ref={ref => this.dropDownAlertRef = ref} />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
        
        <View style={{height:hp('100%'),alignItems:"center",justifyContent:"center"}}>

            <View style={{width:wp('100%'),height:hp('30%')}}>
            <LottieView source={require('../../assets/animation/success.json')} autoPlay loop />
            </View>

            <View style={{}}>
                <Text style={{fontSize:hp('3%')}}>{this.state.renderLanguage.confirmation}</Text>
            </View>
            <View style={{marginTop:hp('3%'),alignItems:"center",justifyContent:"center"}}>
                <Text style={{fontSize:hp('2%'),color:"#0000006a"}}>{this.state.renderLanguage.youhavesuccessfully}</Text>
                <Text style={{fontSize:hp('2%'),color:"#0000006a"}}>{this.state.renderLanguage.completedyourpaymentprocedure}</Text>
            </View>
            <View style={{marginTop:hp('2%'),alignItems:"center",justifyContent:"center"}}>
                <Text style={{fontSize:hp('2%'),color:"#0000006a"}}>ID : 2560XXXXXXXXXXXXXX</Text>
            </View>


            <TouchableOpacity onPress={this.onTrackOrderClick} activeOpacity={0.9} 
            style={{
                alignItems:'center',
                backgroundColor:'#4F45F0',
                marginTop:hp('4%'),
                height:hp('6%'),
                width:wp('50%'),
                borderRadius:hp('1%'),
                justifyContent:'center',
                alignSelf:'center'
            }}>
                <Text style={{color:'white',fontSize:hp('2.5%')}}>{this.state.renderLanguage.trackorder}</Text>
            </TouchableOpacity>

        </View>

        <TouchableOpacity onPress={this.onHomeClick} activeOpacity={0.9} style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.backtohome}</Text>
        </TouchableOpacity>
        
        </ImageBackground> 
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
    item: {
        borderRadius:15,
        paddingHorizontal:20,
        paddingVertical:10,
        marginHorizontal:10,
      },
      title: {
        fontSize: 15,
      },
    subcontainer1:{
        height:Dimensions.get('window').height/100*20,
        justifyContent:'center',
        marginLeft:'15%'
    },
    subcontainer2:{
        height:Dimensions.get('window').height/100*70,
        alignItems:'center',
        marginTop:10
    },

    backgroundImage: {
        height: hp('100%'),
        width:wp('100%'),
    },
    pageheader:{
        fontSize:28,
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
        marginTop:8,
        fontSize:15
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        marginHorizontal:20,
        marginTop:20,
        height:45,
        width:Dimensions.get('window').width-40,
        borderRadius:7,
        elevation:9
    },
    iconInputField:{
        marginLeft:5,
        flex:1,
        color:"#000"
    },
    iconInputImage:{
        marginLeft:10
    },
    loginButtonContainer:{
        position:"absolute",
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F0',
        bottom:hp('2%'),
        height:hp('6%'),
        width:wp('90%'),
        borderRadius:hp('1%'),
        justifyContent:'center',
        alignSelf:'center'
    },
    loginButtonText:{
        color:'white',
        fontSize:hp('2.3%')
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