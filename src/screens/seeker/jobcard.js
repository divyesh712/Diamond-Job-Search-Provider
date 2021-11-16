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
    StatusBar
  } from 'react-native';

  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/Fontisto';

  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Share from 'react-native-share';
  import { WebView } from 'react-native-webview';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SeekerServices from '../../api/seekerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import { ScrollView } from 'react-native-gesture-handler';
  import {MyLanguage} from '../../utils/languagehelper';



export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        job:this.props.route.params.job,
        applynow:this.props.route.params.applynow,
        userdata:{},
        jobtitle:'',
        experience:'',
        leavedate:'',
        totalexpereince:'',
        appLoading:false,
        renderLanguage:MyLanguage.en

      };

      this.onApplyNowClick = this.onApplyNowClick.bind(this);
      this.onShareClick = this.onShareClick.bind(this);
      this.onHomeClick = this.onHomeClick.bind(this);
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

    onApplyNowClick(){
        this.props.navigation.navigate('ApplyForJobSeeker',{postID:this.state.job._id});
    }

    onShareClick(){
        const options = {
            title: 'Share This Job via',
            message: `Hey Friend ,\n I found a job on di'mand \n\n ${this.state.job.company_name} is looking for ${this.state.job.job_title}.\nIt is a ${this.state.job.emp_type} Job\nSalary be ${this.state.job.salary} \n\nIf you don't have Di'mand App install it on\n${'Android:dimand.com/android'}\niOS:dimand.com/ios`,
        };
        Share.open(options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
    }

    onHomeClick(){
        this.props.navigation.pop(1);
    }

    render () {
        const INJECTEDJAVASCRIPT = "document.body.style.userSelect = 'none'";
      return (
        <View style={styles.maincontainer} >
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
            
        <View style={{ height:hp('10%') , width:wp('100%') ,justifyContent:"center",alignItems:"center" }}>
            <Text style={{fontSize:hp('2.5%'),color:'#4F45F0',fontWeight:"bold"}}>{this.state.job.category}</Text>
        </View>

        <ScrollView 
            style={{ height:hp('70%') , width:wp('80%') ,borderRadius:hp('2%'), backgroundColor:"#EDECFC" ,alignSelf:"center" }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingBottom:hp('4%'),paddingHorizontal:wp('5%')}}
        >
            <Text style={{fontSize:hp('2.3%'),color:'#4F45F0',marginTop:hp('2%'),fontWeight:"700"}}>{this.state.renderLanguage.jobtitle}</Text>
            <Text style={{fontSize:hp('2.1%'),color:'#000000',marginTop:hp('0.3%')}}>{this.state.job.job_title}</Text>

            <Text style={{fontSize:hp('2.3%'),color:'#4F45F0',marginTop:hp('2%'),fontWeight:"700"}}>{this.state.renderLanguage.companyname}</Text>
            <Text style={{fontSize:hp('2.1%'),color:'#000000',marginTop:hp('0.3%')}}>{this.state.job.company_name}</Text>

            <Text style={{fontSize:hp('2.3%'),color:'#4F45F0',marginTop:hp('2%'),fontWeight:"700"}}>{this.state.renderLanguage.experience}</Text>
            <Text style={{fontSize:hp('2.1%'),color:'#000000',marginTop:hp('0.3%')}}>{this.state.job.experience}</Text>

            <Text style={{fontSize:hp('2.3%'),color:'#4F45F0',marginTop:hp('2%'),fontWeight:"700"}}>{this.state.renderLanguage.salary}</Text>
            <Text style={{fontSize:hp('2.1%'),color:'#000000',marginTop:hp('0.3%')}}>{this.state.job.salary}</Text>

            <Text style={{fontSize:hp('2.3%'),color:'#4F45F0',marginTop:hp('2%'),fontWeight:"700"}}>{this.state.renderLanguage.description}</Text>
            <WebView
                    injectedJavaScript={INJECTEDJAVASCRIPT}
                    source={{ html: this.state.job.description }}
                    style={{height:hp('20%'),width:wp('70%'),backgroundColor:"#EDECFC"}}
            />
            <Text style={{fontSize:hp('2.3%'),color:'#4F45F0',marginTop:hp('2%'),fontWeight:"700"}}>{this.state.renderLanguage.jobtype}</Text>
            <Text style={{fontSize:hp('2.1%'),color:'#000000',marginTop:hp('0.3%')}}>{this.state.job.emp_type}</Text>


            <Text style={{fontSize:hp('2.3%'),color:'#4F45F0',marginTop:hp('2%'),fontWeight:"700"}}>{this.state.renderLanguage.employeerole}</Text>
            <Text style={{fontSize:hp('2.1%'),color:'#000000',marginTop:hp('0.3%')}}>{this.state.job.emp_role}</Text>


            <Text style={{fontSize:hp('2.3%'),color:'#4F45F0',marginTop:hp('2%'),fontWeight:"700"}}>{this.state.renderLanguage.skills}</Text>
            <Text style={{fontSize:hp('2.1%'),color:'#000000',marginTop:hp('0.3%')}}>{this.state.job.skills}</Text>


            <Text style={{fontSize:hp('2.3%'),color:'#4F45F0',marginTop:hp('2%'),fontWeight:"700"}}>{this.state.renderLanguage.qualification}</Text>
            <Text style={{fontSize:hp('2.1%'),color:'#000000',marginTop:hp('0.3%')}}>{this.state.job.qualification}</Text>

            <Text style={{fontSize:hp('2.3%'),color:'#4F45F0',marginTop:hp('2%'),fontWeight:"700"}}>{this.state.renderLanguage.vacancy}</Text>
            <Text style={{fontSize:hp('2.1%'),color:'#000000',marginTop:hp('0.3%')}}>{this.state.job.vacancy}</Text>

        </ScrollView>

        <View style={{ height:hp('20%') , width:wp('100%')  }}>
        <View style={{alignSelf:"center",justifyContent:"center",alignItems:"center",marginTop:hp('2%'),flexDirection:"row"}}>
            <TouchableOpacity onPress={this.onHomeClick}  style={styles.socialButtonContainer}>
            <Image source={require('../../assets/icon/home.png')} style={{height:hp('3.1%'),width:hp('3.1%')}} resizeMode='contain'></Image>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onShareClick}  style={styles.socialButtonContainer}>
            <Image source={require('../../assets/icon/share.png')} style={{height:hp('3.1%'),width:hp('3.1%')}} resizeMode='contain'></Image>
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={this.onApplyNowClick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.applynow}</Text>
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
        marginTop:hp('0.3%')
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
        marginTop:hp('0.3%'),
        fontSize:hp('2.1%')
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        marginHorizontal:hp('2%'),
        marginTop:hp('2%'),
        height:hp('6%'),
        width:wp('93%'),
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
        alignSelf:'center',
        marginTop:hp('2%'),
        height:hp('6%'),
        width:hp('35%'),
        borderRadius:hp('1.2%'),
        justifyContent:'center',
        alignItems:'center',
    },
    loginButtonText:{
        color:'white',
        fontSize:hp('2.3%')
    },
    socialButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"center",
        backgroundColor:'#EDECFC',
        marginHorizontal:wp('8%'),
        height:hp('6%'),
        width:hp('6%'),
        borderRadius:hp('6%')/2,
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