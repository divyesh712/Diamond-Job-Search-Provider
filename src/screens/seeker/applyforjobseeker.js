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

  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/Fontisto';

  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SeekerServices from '../../api/seekerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {MyLanguage} from '../../utils/languagehelper';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        postID:this.props.route.params.postID,
        userdata:{},
        name:'',
        number:'',
        email:'',
        location:'',
        jobtitle:'',
        experience:'',
        leavedate:'',
        totalexpereince:'',
        experience:[],
        appLoading:false,
        renderLanguage:MyLanguage.en
      };

      this.onSubmitClick = this.onSubmitClick.bind(this);
    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
        this.SeekerProfileApiCall();
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

    async SeekerProfileApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("userid",this.state.userdata._id)
        this.setState({
            appLoading:true
        })

        try {
            const { data } = await SeekerServices.SeekerProfile(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    appLoading:false
                })
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1){
                this.setState({
                    appLoading:false,
                    name:data.data.firstname,
                    mobile:data.data.mobile_no,
                    email:data.data.email,
                    location:data.data.city,
                    experience:data.userexperience,
                })
            }
          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async onSubmitClick(){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("post_id",this.state.postID)
        myFormData.append("user_id",this.state.userdata._id)

        try {
            const { data } = await SeekerServices.SeekerApplyJob(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.applyfailed);
            }
            if( data.status == 1 ){
                this.props.navigation.replace('ApplySuccess');
            }
            this.setState({appLoading:false})
          }
          catch(error){
            this.setState({appLoading:false})
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    render () {
      return (
        <View style={styles.maincontainer}>
        <KeyboardAwareScrollView extraHeight={hp('13%')} enableOnAndroid>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
            <Text style={{marginTop:hp('3%'),marginLeft:hp('8%'),fontSize:hp('3%'),color:'#000'}}>{this.state.renderLanguage.applynow}</Text>

            <View style={{borderRadius:hp('2%'),borderWidth:hp('0.1%'),marginHorizontal:hp('7%'),marginTop:hp('1%'),paddingBottom:hp('2%'),backgroundColor:'#fff'}}>

            <View style={styles.iconInputContainer}>
            <Icon4 name="user" color={'#4F45F08a'} size={26}  style={styles.iconInputImage}/>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.firstname}
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                value={this.state.name}
                editable={false}
                onChangeText={(email) => this.setState({email})}  />
            </View>

            <View style={styles.iconInputContainer}>
            <Icon6 name="call" color={'#4F45F08a'} size={26}  style={styles.iconInputImage}/>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.mobilenumber}
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                value={this.state.mobile}
                editable={false}
                onChangeText={(email) => this.setState({email})}  />
            </View>

            <View style={styles.iconInputContainer}>
            <Icon8 name="email" color={'#4F45F08a'} size={24}  style={styles.iconInputImage}/>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.emailid}
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                value={this.state.email}
                editable={false}
                onChangeText={(email) => this.setState({email})}  />
            </View>

            <View style={styles.iconInputContainer}>
            <Icon2 name="home-map-marker" color={'#4F45F08a'} size={28}  style={styles.iconInputImage}/>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.currentcity}
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                value={this.state.city}
                editable={false}
                onChangeText={(email) => this.setState({email})}  />
            </View>

            </View>

            {
                this.state.experience.length < 1 ? null 
                :
                <View>
            <Text style={{marginTop:hp('3%'),marginLeft:hp('8%'),fontSize:hp('3%'),color:'#000'}}>{this.state.renderLanguage.previousjobinfo}</Text>

            <View style={{borderRadius:hp('2%'),borderWidth:hp('0.1%'),marginHorizontal:hp('7%'),marginTop:hp('1%'),paddingBottom:hp('2%'),backgroundColor:'#fff'}}>

            <View style={styles.iconInputContainer}>
            <Icon2 name="briefcase" color={'#4F45F08a'} size={26}  style={styles.iconInputImage}/>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = "Last Job title"
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                value={this.state.experience[0].job_title}
                editable={false}
                onChangeText={(jobtitle) => this.setState({jobtitle})}  />
            </View>

            <View style={styles.iconInputContainer}>
            <Icon2 name="file-certificate" color={'#4F45F08a'} size={26}  style={styles.iconInputImage}/>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = "Last Experience"
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                editable={false}
                value={this.state.experience[0].last_job_experience}
                onChangeText={(experience) => this.setState({experience})}  />
            </View>

            <View style={styles.iconInputContainer}>
            <Icon2 name="calendar" color={'#4F45F08a'} size={26}  style={styles.iconInputImage}/>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = "Last Job Leave Date"
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                editable={false}
                value={this.state.experience[0].leave_date}
                onChangeText={(leavedate) => this.setState({leavedate})}  />
            </View>

            <View style={styles.iconInputContainer}>
            <Icon4 name="user-graduate" color={'#4F45F08a'} size={25}  style={styles.iconInputImage}/>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = "Total Experience"
                placeholderTextColor = "#000"
                autoCapitalize = "none"
                editable={false}
                value={this.state.experience[0].total_experience}                
                onChangeText={(totalexpereince) => this.setState({totalexpereince})}  />
            </View>

            </View>
                </View>
            }
       

            <TouchableOpacity onPress={this.onSubmitClick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.submit}</Text>
            </TouchableOpacity>
        
        </ImageBackground> 
        <DropdownAlert inactiveStatusBarStyle="light-content" inactiveStatusBarBackgroundColor="#4F45F0" ref={ref => this.dropDownAlertRef = ref} />
        <AppLoader isAppLoading={this.state.appLoading}/>
        </KeyboardAwareScrollView>
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
        height:Dimensions.get('window').height,
    },
    subcontainer2:{
        height:Dimensions.get('window').height/100*0,
        alignItems:'center',
        marginTop:10
    },

    backgroundImage: {
        height: hp('100%'),
        width:wp('100%'),
    },
    pageheader:{
        fontSize:hp('3%'),
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
    pagesubheader:{
        marginTop:8,
        fontSize:18
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        height:hp('6%'),
        margin:hp('1%'),
    },
    iconInputField:{
        marginLeft:hp('1%'),
        flex:1,
        color:"#000",
        borderBottomWidth:hp('0.1%')
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
        alignSelf:'center',
        marginTop:hp('3%'),
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