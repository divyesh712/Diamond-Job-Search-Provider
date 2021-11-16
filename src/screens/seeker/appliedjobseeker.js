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
    StatusBar,
    BackHandler
  } from 'react-native';

  import {useNavigationState} from '@react-navigation/native';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';

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
        renderjobs:null,
        userdata:{},
        appLoading:false,
        appFetchingLoader:false,
        paginationNumber:0,
        isFetching: false,
        loadMoreResults:true,
        renderLanguage:MyLanguage.en
      };

      this.onBriefcaseClick = this.onBriefcaseClick.bind(this);
      this.onSettingClick = this.onSettingClick.bind(this);
    }

    componentDidMount(){
  
        var that = this;
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            that.getUserData();
          });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }


    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            console.log(this.state.userdata)
            this.SeekerAppliedJobApiCall(this.state.paginationNumber);
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

    async SeekerAppliedJobApiCall(pageno){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        // myFormData.append("langid",this.state.userdata.lang_id)
        myFormData.append("page",pageno)
        try {
            const { data } = await SeekerServices.SeekerAppliedJob(myFormData)
            console.log(data);

            if(pageno>0){
                if( data.status == 0 ){
                    var oldLady=this.state.renderjobs;
                    this.setState({
                        renderjobs:oldLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:false,
                    })
                }
                if( data.status == 1 ){
                    var oldLady=this.state.renderjobs;
                    var newLady = oldLady.concat(data.data);
                    this.setState({
                        renderjobs:newLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
            }
            if(pageno==0){
                if( data.status == 0 ){
                    this.setState({
                        renderjobs:null,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
                if( data.status == 1 ){
                    this.setState({
                        renderjobs:data.data,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:true
                    })
                }     
            }

            if(this.state.myCustomAlert == 0){}
            if(this.state.myCustomAlert == 1){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.jobactivated);
            }
            if(this.state.myCustomAlert == 2){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.jobdeactivated);
            }
            if(this.state.myCustomAlert == 3){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.jobdeleted);
            }

          }
          catch(error){
            this.setState({appFetchingLoader:false,appLoading:false})
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    onBriefcaseClick(){
        this.props.navigation.navigate('FreelancerList');
    }

    onSettingClick(){
        this.props.navigation.navigate('SettingSeeker');
    }

    loadMoreResults(info){
        if(this.state.loadMoreResults){
            var pageno = this.state.paginationNumber + 1;
            this.setState({paginationNumber:pageno},()=>{
                this.SeekerAppliedJobApiCall(pageno);
            })
        }
    }
    onRefresh() {
        this.setState({isFetching: true,paginationNumber:0,renderjobs:null,categories:null},() => {            
        this.getUserData();});
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
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{marginTop:hp('2%'),marginLeft:hp('2.2%')}}>
                <Text style={{color:'white',fontSize:hp('2.5%')}}>{this.state.renderLanguage.appliedjobs}</Text>
            </View>

            <View style={{alignSelf:'flex-end',flexDirection:'row',marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <TouchableOpacity  onPress={this.onBriefcaseClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/portfolio_2.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.onSettingClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/settings_1.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>
        </View>
        
        <View style={{ height:hp('93%') , width:wp('100%') }}>
        {this.state.renderjobs == null ? 
            
            this.state.appFetchingLoader == true ? 
            null 
            :
            <View style={{alignItems:"center",justifyContent:"center",flex:1}}>
                <Text style={{color:'#4F45F0',fontSize:22}}>{this.state.renderLanguage.nojobsapplied}</Text>
            </View>

        :
            <View style={{marginHorizontal:20}}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: hp('20%') }}
                    data={this.state.renderjobs}
                    onRefresh={() => this.onRefresh()}
                    refreshing={this.state.isFetching}
                    onEndReachedThreshold={0.2}
                    onEndReached={info => {
                      this.loadMoreResults(info);
                    }}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => 
                    
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('JobCard',{job:item,applynow:true});}} style={{borderRadius:hp('2%'),borderWidth:0.5,marginTop:hp('2.3%'),backgroundColor:'#F7F5F7'}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{marginVertical:hp('2%'),marginLeft:hp('2%')}}>
                            <Image 
                             source={{uri: `${item.image}`}} 
                            style={{  width: hp('9%'),
                            height: hp('9%'),
                            borderRadius: hp('9%')/2,
                            backgroundColor: '#4F45F0',
                            alignItems:'center',
                            justifyContent:'center'}}>
                                </Image>
                        </View>
                        <View style={{marginVertical:hp('2%'),marginLeft:hp('3%'),width:hp('25%'),justifyContent:"center"}}> 
                            <Text style={{fontSize:hp('2.1%'),fontWeight:'bold'}}>{item.job_title}</Text>
                        </View >
                    </View>
                            <View style={{flexDirection:'row',marginTop:hp('0.1%'),marginBottom:hp('2%'),alignItems:'center',justifyContent:'space-between'}}>
                           
                                    <View style={{flexDirection:'row',marginTop:hp('1%'),alignItems:'center'}}>
                                        <View style={{alignSelf:"center",alignItems:"center",justifyContent:"center",paddingHorizontal:hp('0.6%'),marginLeft:hp('2.4%')}}>
                                        <Image source={require('../../assets/icon/calendar.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
                                        </View>
                                        <Text style={{marginLeft:hp('1.9%'),fontSize:hp('1.8%')}}>{this.state.renderLanguage.appliedon} {moment(item.created_at).format('Do MMMM,YYYY')}</Text> 
                                    </View>

                                    <View style={{padding:hp('1%'),marginRight:hp('2%'),backgroundColor:(item.status == '1') ? '#9af5a56a' : '#0000003a',alignItems:'center',borderRadius:hp('1%')}}><Text style={{color:(item.status == '1') ? '#15d12c' : '#000000',fontWeight:"900",fontSize:hp('1.8%')}}>{item.status == '1' ? this.state.renderLanguage.active : this.state.renderLanguage.closed }</Text></View>  
                            </View>
                        </TouchableOpacity>
                        }
                />
            </View>
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
        backgroundColor: '#4F45F02a',
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