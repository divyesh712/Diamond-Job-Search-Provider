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
    Alert,
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
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import ProviderServices from '../../api/providerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {MyLanguage} from '../../utils/languagehelper';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          renderjobs:null,
          userdata:{},
          toggleOptionsVisibility:false,
          toggleCardID:null,
          appLoading:false,
          appFetchingLoader:false,
          myCustomAlert:0,
          paginationNumber:0,
          isFetching: false,
          loadMoreResults:true,
          renderLanguage:MyLanguage.en

      };

      this.onSettingClick = this.onSettingClick.bind(this);
      this.onCategoryClick = this.onCategoryClick.bind(this);
      this.onApplyNowClick = this.onApplyNowClick.bind(this);
      this.onOptionClick = this.onOptionClick.bind(this);
      this.onDeactivatePostClick = this.onDeactivatePostClick.bind(this);
      this.onActivatePostClick = this.onActivatePostClick.bind(this);
      this.onDeletePostClick = this.onDeletePostClick.bind(this);
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
            this.ProviderAllPostApiCall(this.state.paginationNumber);
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


    async ProviderAllPostApiCall(pageno){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("lang_id",this.state.userdata.lang_id)
        myFormData.append("status",0)
        myFormData.append("page",pageno)


        try {
            const { data } = await ProviderServices.ProvideActivePosts(myFormData)
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
                        loadMoreResults:true
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


    onNotificationClick(){
        this.props.navigation.navigate('HomeSeeker');
    }

    onSettingClick(){
        this.props.navigation.navigate('SettingSeeker');
    }

    onCategoryClick(){
        this.props.navigation.navigate('ProfileSeeker');
    }

    onApplyNowClick(){
        this.props.navigation.navigate('ApplyForJobSeeker');
    }

    onOptionClick(paramid){
        if(this.state.toggleOptionsVisibility == false && this.state.toggleCardID == null){
            this.setState({toggleCardID:paramid,toggleOptionsVisibility:true,})
            return
        }
        if(this.state.toggleOptionsVisibility == true && this.state.toggleCardID != null && this.state.toggleCardID != paramid){
            this.setState({toggleCardID:paramid,toggleOptionsVisibility:true})
            return
        }
        if(this.state.toggleOptionsVisibility == true && this.state.toggleCardID != null){
            this.setState({toggleCardID:null,toggleOptionsVisibility:false})
            return
        }
    }

    onDeactivatePostClick(postid){
        this.setState({toggleCardID:null,toggleOptionsVisibility:false,})
        Alert.alert(
            this.state.renderLanguage.deactivatepost,
            this.state.renderLanguage.wanttodeactivate,
            [
              {text: this.state.renderLanguage.no, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: this.state.renderLanguage.yes, onPress: () =>  this.deactivateJobPost(postid)},
            ],
            {cancelable: false},
          );
    }

    onActivatePostClick(postid){
        this.setState({toggleCardID:null,toggleOptionsVisibility:false,})
        Alert.alert(
            this.state.renderLanguage.activatepost,
            this.state.renderLanguage.wanttoactivatepost,
            [
              {text: this.state.renderLanguage.no, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: this.state.renderLanguage.yes, onPress: () =>  this.activateJobPost(postid)},
            ],
            {cancelable: false},
          );
    }


    onDeletePostClick(postid){
        this.setState({toggleCardID:null,toggleOptionsVisibility:false,})
        Alert.alert(
            this.state.renderLanguage.deletepost,
            this.state.renderLanguage.wanttodelete,
            [
              {text: this.state.renderLanguage.no, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: this.state.renderLanguage.yes, onPress: () =>  this.deleteJobPost(postid)},
            ],
            {cancelable: false},
          );
    }
 
    async deleteJobPost(postID){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("_id",postID)
        myFormData.append("status",3)

        try {
            const { data } = await ProviderServices.ProvideTogglePosts(myFormData)
            console.log(data);

            if( data.status == 3 ){
                this.setState({myCustomAlert:3})
            }
  
            this.ProviderAllPostApiCall(this.state.paginationNumber);
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

    async deactivateJobPost(postID){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("_id",postID)
        myFormData.append("status",2)

        try {
            const { data } = await ProviderServices.ProvideTogglePosts(myFormData)
            console.log(data);

            if( data.status == 2 ){
                this.setState({myCustomAlert:2})
            }
  
            this.onRefresh();          
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

    async activateJobPost(postID){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("_id",postID)
        myFormData.append("status",1)

        try {
            const { data } = await ProviderServices.ProvideTogglePosts(myFormData)
            console.log(data);

            if( data.status == 1){
                this.setState({myCustomAlert:1})
            }

            this.onRefresh();
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

    loadMoreResults(info){
        if(this.state.loadMoreResults){
            var pageno = this.state.paginationNumber + 1;
            this.setState({paginationNumber:pageno},()=>{
                this.ProviderAllPostApiCall(this.state.paginationNumber);
            })
        }
    }
    onRefresh() {
        this.setState({isFetching: true,paginationNumber:0,renderjobs:null},() => {            
            this.getUserData()
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
        <View style={{backgroundColor : '#4F45F0' ,height: hp('7%'),width:wp('100%'),}} >
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{marginTop:hp('2%'),marginLeft:hp('2.2%')}}>
                <Text style={{color:'white',fontSize:hp('2.5%')}}>{this.state.renderLanguage.alljobs}</Text>
            </View>

            <View style={{alignSelf:'flex-end',flexDirection:'row',marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
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
            <View style={{alignItems:"center",justifyContent:"center",height:hp('100%') , width:wp('100%') }}>
            <Text style={{color:'#4F45F0',fontSize:hp('3.5%')}}>{this.state.renderLanguage.nojobsfound}</Text>
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate('CreateJobProvider')}} style={{marginTop:hp('4%'),paddingHorizontal:hp('3%'),paddingVertical:hp('2%'),borderRadius:hp('2%'),backgroundColor:"#4F45F0"}}>
                        <Text style={{color:'white',fontSize:18}}>{this.state.renderLanguage.addpost}</Text>
                </TouchableOpacity>
            </View>
        :
        <View style={{marginHorizontal:hp('2.3%')}}>
            <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: hp('20%') }}
                        data={this.state.renderjobs}
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.isFetching}
                        onEndReachedThreshold={0.1}
                        onEndReached={info => {
                          this.loadMoreResults(info);
                        }}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => 
                            
                        <View  style={{borderRadius:hp('2%'),borderWidth:0.5,marginTop:hp('2%'),backgroundColor:'#F7F5F7'}}>
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
                                            <Text style={{marginTop:hp('1%')}}>{item.company_name}</Text>
                                        </View >
                                    
                                    <TouchableOpacity onPress={()=>this.onOptionClick(item._id)} style={{position:'absolute',right:10}}><Image source={require('../../assets/icon/dote.png')} style={{height:hp('3.5%'),width:hp('3.5%'),top:2}} resizeMode='contain'></Image></TouchableOpacity>

                                    {this.state.toggleOptionsVisibility && (this.state.toggleCardID == item._id) ?
                                    <View style={{backgroundColor:'#ffffff5a',right:hp('1%'),top:hp('7%'),justifyContent:'center',alignItems:'center',borderRadius:hp('1%'),width:hp('13%'),borderWidth:0.8,position:"absolute"}}>
                                        <TouchableOpacity onPress={()=>{item.status == '1' ? this.onDeactivatePostClick(item._id) : this.onActivatePostClick(item._id) }}  style={{borderBottomWidth:0.8}}>
                                        <Text style={{padding:hp('1%'),fontSize:hp('1.7%')}}>{item.status == '1' ? this.state.renderLanguage.deactivatepost : this.state.renderLanguage.activatepost}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{this.onDeletePostClick(item._id)}} >
                                        <Text style={{padding:hp('1%'),fontSize:hp('1.7%')}}>{this.state.renderLanguage.deletepost}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :null
                                    }
                        </View>


                                    <View style={{flexDirection:'row',marginTop:hp('1%'),alignItems:'center'}}>
                                        <View style={{alignSelf:"center",alignItems:"center",justifyContent:"center",paddingHorizontal:hp('0.6%'),marginLeft:hp('2.4%')}}>
                                        <Image source={require('../../assets/icon/location.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
                                        </View>
                                        <Text style={{marginLeft:hp('1.9%'),fontSize:hp('1.8%')}}>{item.location}</Text>
                                    </View>

                                    <View style={{flexDirection:'row',marginTop:hp('1%'),alignItems:'center'}}>
                                        <View style={{alignSelf:"center",alignItems:"center",justifyContent:"center",paddingHorizontal:hp('0.6%'),marginLeft:hp('2.4%')}}>
                                        <Image source={require('../../assets/icon/portfolio_1.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
                                        </View>
                                        <Text style={{marginLeft:hp('1.9%'),fontSize:hp('1.8%')}}>{item.experience}</Text>
                                    </View>

                                    <View style={{flexDirection:'row',marginTop:hp('1%'),alignItems:'center'}}>
                                        <View style={{alignSelf:"center",alignItems:"center",justifyContent:"center",paddingHorizontal:hp('0.6%'),marginLeft:hp('2.4%')}}>
                                        <Image source={require('../../assets/icon/portfolio_1.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
                                        </View>
                                        <Text style={{marginLeft:hp('1.9%'),fontSize:hp('1.8%')}} numberOfLines={1}>{item.description.length < 35? `${item.description}`: `${item.description.substring(0, 34)} ...`}</Text>
                                    </View>

                                    <View style={{flexDirection:'row',marginTop:hp('1%'),alignItems:'center'}}>
                                        <View style={{alignSelf:"center",alignItems:"center",justifyContent:"center",paddingHorizontal:hp('0.6%'),marginLeft:hp('2.4%')}}>
                                        <Image source={require('../../assets/icon/calendar.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
                                        </View>
                                        <Text style={{marginLeft:hp('1.9%'),fontSize:hp('1.8%')}}>{this.state.renderLanguage.postedon} {moment(item.created_at).format('Do MMMM,YYYY')}</Text> 
                                    </View>

                                <View style={{flexDirection:'row',marginLeft:hp('2%'),marginTop:hp('2%'),marginBottom:hp('2%'),alignItems:'center',justifyContent:'space-between'}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{marginLeft:hp('1%'),color:'#000',fontWeight:"900"}}>{this.state.renderLanguage.status}</Text>
                                    <View style={{paddingHorizontal:hp('2%'),paddingVertical:hp('1%'),alignItems:'center',borderRadius:hp('1%'),backgroundColor:(item.status == '1') ? '#9af5a56a' : '#0000003a'}}>
                                        <Text style={{color:(item.status == '1') ? '#15d12c' : '#000000',fontWeight:"900"}}>{item.status == '1' ? this.state.renderLanguage.active : this.state.renderLanguage.closed}</Text>
                                    </View>
                                </View>
                                  
                                </View>
                            </View>
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
