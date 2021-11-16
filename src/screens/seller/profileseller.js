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
    Keyboard
  } from 'react-native';

  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/Fontisto';

  import { launchImageLibrary,launchCamera} from 'react-native-image-picker';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SellerServices from '../../api/sellerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import {Picker} from '@react-native-picker/picker';
  import debounce from 'lodash/debounce';
  import {MyLanguage} from '../../utils/languagehelper';



export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        imageOBJ:null,
        apiimageObJ:null,
        firstname:'',
        lastname:'',
        email:'',
        langid:'0',
        appLoading:false,
        renderLanguage:MyLanguage.en

      };

      this.onBackClick = this.onBackClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onSaveProfileClick = this.onSaveProfileClick.bind(this);
      this.onProfilePictureClick= debounce(this.onProfilePictureClick.bind(this), 200);
    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            console.log(this.state.userdata)
            this.ShowProfileApiCall();
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


    async ShowProfileApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("userid",this.state.userdata._id)
        try {
            const { data } = await SellerServices.SellerShowProfile(myFormData)
            console.log(data);

            
                if( data.status == 0 ){
                    this.setState({
                        renderAddress:null,
                        appLoading:false,
                    })
                    this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
                }
                if( data.status == 1 ){
                    this.setState({
                        firstname:data.data.firstname,
                        lastname:data.data.lastname,
                        email:data.data.email,
                        langid:data.data.lang_id,
                        imageOBJ:{uri:data.data.image},
                        apiimageObJ:{uri:data.data.image},
                        appLoading:false,
                    })
                await AsyncStorage.setItem('User',JSON.stringify(data.data)).then(
                    this.trytorefresh()
                )
                }    
            if(this.state.myCustomAlert == 0){}
            if(this.state.myCustomAlert == 1){
                this.setState({myCustomAlert:0});
                this.props.navigation.popToTop();
                this.props.navigation.replace("MainTabSeller");
            }
            if(this.state.myCustomAlert == 2){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.profileupdatefailed);
            }
            // this.getUserData();
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

    trytorefresh(){
        if(this.state.myCustomAlert == 1){
            this.props.navigation.popToTop();
            this.props.navigation.replace("MainTabSeller");
        }
    }


    onBackClick(){
        this.props.navigation.goBack();
    }

    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }


    async onSaveProfileClick(){
        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        if(this.state.imageOBJ == null || this.state.imageOBJ.uri == null){
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.imageblank);
          return
        }


        let myFormData = new FormData();
        myFormData.append("_id",this.state.userdata._id)
        myFormData.append("firstname",this.state.firstname)
        myFormData.append("lastname",this.state.lastname)
        myFormData.append("email",this.state.email)
        myFormData.append("langid",this.state.langid)

        if(this.state.apiimageObJ.uri != this.state.imageOBJ.uri){
            myFormData.append("image", {
                name: "filedocument.png",
                uri: this.state.imageOBJ.uri,
                type: "*/*"
            })
        }

        try {
            this.setState({appLoading: true})
            const { data } = await SellerServices.SellerUpdateProfile(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({myCustomAlert:2})
                this.ShowProfileApiCall();
            }

            if( data.status == 1){
                this.setState({myCustomAlert:1})
                this.ShowProfileApiCall();
            }

          }
          catch(error){
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    onProfilePictureClick = () => {

        let options = {
            mediaType:"photo"
        };

        launchCamera(options, (res) => {
            console.log('Response = ', res);
      
            if (res.didCancel) {
              this.setState({
                  imageOBJ:this.state.apiimageObJ
                });
              console.log('User cancelled image picker');
            } else if (res.error) {
              console.log('ImagePicker Error: ', res.error);
            } else {
              console.log('response', JSON.stringify(res));
              this.setState({
                  imageOBJ:res
              });
            }
          });
    
    }
 
    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
        
        <View style={{height: hp('7%'),width:wp('100%'),}} >
        <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginHorizontal:wp('3%'),marginTop:hp('2%')}}>
            <View>        
                <TouchableOpacity  onPress={this.onBackClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/shape.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
                {/* <TouchableOpacity  onPress={this.onNotificationClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/bell.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity> */}
            </View>
        </View>
        </View>
        
        <KeyboardAwareScrollView 
            style={{height: hp('93%'),width:wp('100%'),}} 
            extraHeight={hp('20%')} enableOnAndroid>

        <View style={{marginHorizontal:wp('5%'),flexDirection:'row',}}>
                <Text style={{color:'#000',fontSize:hp('2.5%'),fontWeight:"bold"}}>{this.state.renderLanguage.profile}</Text>
        </View>

        <View style={{marginTop:hp('2%')}}>
            <TouchableOpacity  onPress={this.onProfilePictureClick} 
            style={{
                borderRadius: hp('20%')/2,
                width: hp('20%'),
                height: hp('20%'),
                backgroundColor:'#4F45F0',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf:"center",
                }}
                activeOpacity={1}>  
                {
                    this.state.imageOBJ == null || this.state.imageOBJ.uri === ""  || this.state.imageOBJ.uri == null ?
                    <Image source={require('../../assets/image/dummy_avatar.png')} style={{borderWidth:hp('0.5%'),height:hp('20%'),width:hp('20%'),borderRadius:hp('20%')/2}} resizeMode='contain'></Image>
                    :
                    <Image source={{uri: `${this.state.imageOBJ.uri}`}} style={{height:hp('20%'),width:hp('20%'),borderRadius:hp('20%')/2}} />
                }   
            </TouchableOpacity>
            </View>


        <View style={{marginTop:hp('2%'),marginHorizontal:wp('5%')}}>
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                <View>
                        <View style={{marginTop:hp('4%')}}>
                        <Text style={{fontSize:hp('2%'),color:"#0000005a"}}>{this.state.renderLanguage.firstname}</Text>
                        </View>
                        <View style={styles.iconInputContainer2}>
                        <TextInput style = {styles.iconInputField2}
                            underlineColorAndroid = "transparent"
                            autoCapitalize = "none"
                            value={this.state.firstname}
                            onChangeText={(firstname) => this.setState({firstname})}  />
                        </View>
                </View>
                <View>
                <View style={{marginTop:hp('4%')}}>
                        <Text style={{fontSize:hp('2%'),color:"#0000005a"}}>{this.state.renderLanguage.lastname}</Text>
                        </View>
                        <View style={styles.iconInputContainer2}>
                        <TextInput style = {styles.iconInputField2}
                            underlineColorAndroid = "transparent"
                            autoCapitalize = "none"
                            value={this.state.lastname}
                            onChangeText={(lastname) => this.setState({lastname})}  />
                        </View>
                </View>
            </View>

            <View style={{marginTop:hp('4%')}}>
                <Text style={{fontSize:hp('2%'),color:"#0000005a"}}>{this.state.renderLanguage.email}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                autoCapitalize = "none"
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={(email) => this.setState({email})}  />
            </View>

            <View style={{marginTop:hp('4%')}}>
                <Text style={{fontSize:hp('2%'),color:"#0000005a"}}>{this.state.renderLanguage.language}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <Picker
                mode="dropdown"
                style = {styles.iconInputField}
                selectedValue={this.state.langid}
                enabled={true}
                dropdownIconColor={'#4F45F0'}
                onValueChange={(g) => this.setState({langid: g})}
            >
               <Picker.Item label={'English'} value={'0'} key={0}/>
               <Picker.Item label={'हिंदी'} value={'1'} key={1}/>
               <Picker.Item label={'ગુજરાતી'} value={'2'} key={2}/>
            </Picker>
            </View>


            <TouchableOpacity onPress={this.onSaveProfileClick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.saveprofile}</Text>
            </TouchableOpacity>

        </View>

        </KeyboardAwareScrollView>
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
        fontSize:hp('2%')
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'transparent',
        height:hp('7%'),
        borderBottomWidth:hp('0.1%'),
        width:wp('90%'),
    },
    iconInputField:{
        flex:1,
        color:"#000",
    },
    iconInputImage:{
        marginLeft:10
    },
    iconInputContainer2:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'transparent',
        height:hp('7%'),
        borderBottomWidth:hp('0.1%'),
        width:wp('40%'),
    },
    iconInputField2:{
        flex:1,
        color:"#000",
    },
    iconInputImage2:{
        marginLeft:10
    },
    loginButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F0',
        marginVertical:hp('6%'),
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