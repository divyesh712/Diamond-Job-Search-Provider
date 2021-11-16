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
    StatusBar
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

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import {MyLanguage} from '../../utils/languagehelper';



export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          loading:false,
          renderLanguage:MyLanguage.en
      };

      this.onBackButtonClick = this.onBackButtonClick.bind(this);
      this.onAboutUsClick = this.onAboutUsClick.bind(this);
      this.onContactUsClick = this.onContactUsClick.bind(this);
      this.onPrivacyPolicyClick = this.onPrivacyPolicyClick.bind(this);
      this.onTermsConditionClick = this.onTermsConditionClick.bind(this);
      this.onRateAppClick = this.onRateAppClick.bind(this);

    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({
            userdata: value , 
        },()=>{
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

    onBackButtonClick(){
        this.props.navigation.goBack();
    }

    onAboutUsClick(){
        this.props.navigation.navigate('AboutUs');
    }

    onContactUsClick(){
        this.props.navigation.navigate('ContactUs');
    }

    onPrivacyPolicyClick(){
        this.props.navigation.navigate('PrivacyPolicy');
    }

    onTermsConditionClick(){
        this.props.navigation.navigate('TermsAndCondition');
    }

    onRateAppClick(){
        this.props.navigation.navigate('RateApp');
    }
 


    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
        <View style={{backgroundColor : '#4F45F0' ,height: hp('7%'),width:wp('100%'),}} >

        <TouchableOpacity onPress={this.onBackButtonClick} style={{marginTop:hp('2%'),marginLeft:hp('2.2%'),flexDirection:"row",alignItems:"center"}}>
            <Image source={require('../../assets/icon/right_arrow.png')} style={{height:hp('2.5%'),width:hp('2.5%')}} resizeMode='contain'></Image>
                <Text style={{color:'white',fontSize:hp('2.5%'),marginLeft:hp('0.5%')}}>{this.state.renderLanguage.settings}</Text>
            </TouchableOpacity>

        </View>
        
        <View style={{ height:hp('93%') , width:wp('100%') }}>

        <View style={{margin:hp('3%'),borderRadius:hp('2%'), backgroundColor:'#EDECFC'}}>

        <TouchableOpacity onPress={this.onAboutUsClick}>
                <Text style={{color:'#000',fontSize:hp('2%'),marginHorizontal:hp('2%'),borderBottomWidth:0.8,paddingVertical:hp('2%')}}>{this.state.renderLanguage.aboutus}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onContactUsClick}>
                <Text style={{color:'#000',fontSize:hp('2%'),marginHorizontal:hp('2%'),borderBottomWidth:0.8,paddingVertical:hp('2%')}}>{this.state.renderLanguage.contactus}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onPrivacyPolicyClick}>
                <Text style={{color:'#000',fontSize:hp('2%'),marginHorizontal:hp('2%'),borderBottomWidth:0.8,paddingVertical:hp('2%')}}>{this.state.renderLanguage.privacypolicy}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onTermsConditionClick}>
                <Text style={{color:'#000',fontSize:hp('2%'),marginHorizontal:hp('2%'),borderBottomWidth:0.8,paddingVertical:hp('2%')}}>{this.state.renderLanguage.termsandcondition}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onRateAppClick}>
                <Text style={{color:'#000',fontSize:hp('2%'),marginHorizontal:hp('2%'),paddingVertical:hp('2%')}}>{this.state.renderLanguage.rateapp}</Text>
        </TouchableOpacity>

        </View>
        </View>
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
        backgroundColor: '#EDECFC',
        borderRadius:hp('2%'),
        padding:hp('1.2%'),
        marginHorizontal:hp('2%')
      },
      title: {
        fontSize:hp('1.8%'),
      },
    subcontainer1:{
        height:Dimensions.get('window').height/100*20,
        justifyContent:'center',
        marginLeft:'15%'
    },
    subcontainer2:{
        height:Dimensions.get('window').height/100*70,
        alignItems:'center',
        marginTop:hp('1%')
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
        fontSize:hp('2.8%'),
        color:'#4F45F0',
    },
    forgotPasswordContainer:{
        marginTop:15,
        marginRight:'10%',
        alignSelf:'flex-end'
    },
    pagesubheader:{
        marginTop:hp('1%'),
        fontSize:hp('2.1%')
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        marginHorizontal:hp('2%'),
        marginTop:hp('2%'),
        height:hp('6%'),
        width:hp('45%'),
        borderRadius:hp('1.2%'),
    },
    iconInputField:{
        marginLeft:hp('1%'),
        flex:1,
        color:"#000"
    },
    iconInputImage:{
        marginRight:20
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
        backgroundColor:'#EDECFC',
        marginTop:20,
        marginHorizontal:hp('2%'),
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