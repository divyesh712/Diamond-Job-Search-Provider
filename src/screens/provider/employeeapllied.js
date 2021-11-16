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
    ScrollView,
    Linking,
    StatusBar
  } from 'react-native';

  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4, { FA5Style } from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/SimpleLineIcons';
  import Icon9 from 'react-native-vector-icons/Fontisto';

  import Accordion from 'react-native-collapsible/Accordion';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import NetworkCheck from '../../utils/networkcheck';
  import ProviderServices from '../../api/providerservices';
  import {MyLanguage} from '../../utils/languagehelper';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        postID:this.props.route.params.postID,
        userdata:{},
        appLoading:false,
        activeSections: [],
        sectionlist:[],
        renderLanguage:MyLanguage.en

      };

      this.onBackButtonClick = this.onBackButtonClick.bind(this);
      this.onSettingClick = this.onSettingClick.bind(this);
    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            console.log(this.state.postID);
            this.ProviderAppliedEmployeeApiCall();
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

    async ProviderAppliedEmployeeApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("post_id",this.state.postID)
        
        try {
            const { data } = await ProviderServices.ProvideAppliedEmployees(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    sectionlist:[],
                    appFetchingLoader:false,
                    appLoading:false
                })
            }

            if( data.status == 1 ){
                this.setState({
                    sectionlist:data.data,
                    appFetchingLoader:false,
                    appLoading:false
                })
            }

          }
          catch(error){
            this.setState({appFetchingLoader:false})
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }


    onBackButtonClick(){
        this.props.navigation.goBack();
    }

    onSettingClick(){
        this.props.navigation.navigate('SettingProvider');
    }


    _renderHeader = section => {
        return (
          <View style={{marginTop:hp('2%'),backgroundColor:'#EDECFC',borderWidth:hp('0.1%'),borderColor:'gray',borderTopLeftRadius:hp('2%'),borderTopRightRadius:hp('2%'),width:wp('90%'),alignSelf:"center"}}>
                <View style={{padding:hp('3%')}}>
                        <View>
                            <Text style={{fontSize:hp('2.5%'),fontWeight:"bold"}}>{section.fistname}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:15}}>
                            <View>
                            <Text style={{fontSize:hp('2.2%')}}>{this.state.renderLanguage.email}</Text>
                            <Text style={{fontSize:hp('2%')}}>{section.email}</Text>
                            </View>
                            <TouchableOpacity   onPress={() =>
                                Linking.openURL(`mailto:${section.email}?subject=Job Recruitment From Di'Mand&body=Hello ${section.fistname},\n This email is regarding ......`)
                                } 
                                style={{padding:hp('1.4%'),backgroundColor:"#4F45F0",borderRadius:hp('1%')}}>
                            <Icon9 name="email" color={'white'} size={hp('3%')} />
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:15}}>
                            <View>
                            <Text style={{fontSize:hp('2.2%')}}>{this.state.renderLanguage.mobile}</Text>
                            <Text style={{fontSize:hp('2%')}}>{section.mobile_no}</Text>
                            </View>
                            <TouchableOpacity  onPress={()=>{Linking.openURL(`tel:${section.mobile_no}`)}} style={{padding:hp('1.4%'),backgroundColor:"#4F45F0",borderRadius:hp('1%')}}>
                            <Icon9 name="phone" color={'white'} size={hp('3%')} />
                            </TouchableOpacity>
                        </View>
                </View>
          </View>
        );
      };

      _renderContent = section => {
        return (
            <View style={{backgroundColor:'#EDECFC',borderWidth:hp('0.1%'),borderColor:'gray',borderBottomLeftRadius:hp('2%'),borderBottomRightRadius:hp('2%'),width:wp('90%'),alignSelf:"center"}}>
            <View style={{padding:hp('3%')}}>
                    <View style={{}}>
                        <Text style={{fontSize:hp('2.2%')}}>{this.state.renderLanguage.currentjobstatus}</Text>
                        <Text style={{fontSize:hp('2%'),}}>{section.companyname}</Text>
                    </View>
                    <View style={{marginTop:hp('2%'),flexDirection:'row'}}>
                        <View>         
                            <Text style={{fontSize:hp('2.2%')}}>{this.state.renderLanguage.experience}</Text>
                            <Text style={{fontSize:hp('2%'),}}>{section.experience}</Text>
                        </View>
                        <View style={{marginLeft:wp('30%')}}>         
                            <Text style={{fontSize:hp('2.2%')}}>{this.state.renderLanguage.applieddate}</Text>
                            <Text style={{fontSize:hp('2%'),}}>{moment(section.date).format('Do MMMM,YYYY')}</Text>
                        </View>
                    </View>

                    <View style={{marginTop:hp('2%'),width:wp('90%'),alignSelf:"center"}}>
                        <Text style={{fontSize:hp('2.2%'),marginHorizontal:wp('7%')}}>{this.state.renderLanguage.skills}</Text>
                        <View style={{marginBottom:hp('1%'),marginTop:hp('1%')}}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                {
                                section.skill.map((item)=>{
                                    return(
                                        <View style={{backgroundColor: '#F7F5F7',borderRadius:hp('2%'),padding:hp('2%'),marginHorizontal:hp('2%')}}>
                                        <Text style={{fontSize:hp('2%')}}>{item}</Text>
                                        </View>
                                    )
                                })
                                }
                            </ScrollView>
 
                        </View>
                    </View>

            </View>
      </View>
        );
      };

      _updateSections = activeSections => {
        this.setState({ activeSections });
      };
    
    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
        <View style={{backgroundColor : '#4F45F0' ,height: hp('7%'),width:wp('100%'),}} >
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            
            <TouchableOpacity onPress={this.onBackButtonClick} style={{marginTop:hp('2%'),marginLeft:hp('2.2%'),flexDirection:"row",alignItems:"center"}}>
            <Image source={require('../../assets/icon/right_arrow.png')} style={{height:hp('2.5%'),width:hp('2.5%')}} resizeMode='contain'></Image>
                <Text style={{color:'white',fontSize:hp('2.5%'),marginLeft:hp('0.5%')}}>{this.state.renderLanguage.appliedemployees}</Text>
            </TouchableOpacity>

            <View style={{alignSelf:'flex-end',flexDirection:'row',marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <TouchableOpacity  onPress={this.onSettingClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/settings_1.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>
        </View>
        
        <View style={{ height:hp('93%') , width:wp('100%') }}>

        {this.state.sectionlist.length < 1 ? 
            
            this.state.appFetchingLoader == true ? 
            null 
            :
            <View style={{alignItems:"center",justifyContent:"center",height:hp('100%') , width:wp('100%') }}>
            <Text style={{color:'#4F45F0',fontSize:hp('3.5%')}}>{this.state.renderLanguage.noemployeesapplied}</Text>
            </View>

        :

        <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp('20%')}}
        >

        <Accordion
                    sections={this.state.sectionlist}
                    activeSections={this.state.activeSections}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                    onChange={this._updateSections}
                    underlayColor={"#fff"}                  
                    containerStyle={{ backgroundColor: "transparent" }}
                />  
        </ScrollView>
        }
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
    item: {
        backgroundColor: '#F7F5F7',
        borderRadius:15,
        padding:15,
        marginHorizontal:10
      },
      title: {
        fontSize: 18,
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
        flex: 1,
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
        fontSize:18
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        marginLeft:20,
        marginRight:20,
        marginTop:20,
        height:55,
        width:Dimensions.get('window').width-40,
        borderRadius:7,
    },
    iconInputField:{
        marginLeft:5,
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
