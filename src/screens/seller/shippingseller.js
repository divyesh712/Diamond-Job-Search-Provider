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
    Alert
  } from 'react-native';

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SellerServices from '../../api/sellerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/Fontisto';
  import { ScrollView } from 'react-native-gesture-handler';
  import {MyLanguage} from '../../utils/languagehelper';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        renderAddress:null,
        userdata:{},
        appLoading:false,
        appFetchingLoader:false,
        paginationNumber:0,
        notificationcount:0,
        myCustomAlert:0,
        isFetching: false,
        loadMoreResults:true,
        renderLanguage:MyLanguage.en

      };

      this.onBackClick = this.onBackClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onChangeAddressClick = this.onChangeAddressClick.bind(this);
      this.onAddressDeleteClick = this.onAddressDeleteClick.bind(this);
      this.onContinueToPaymentClick = this.onContinueToPaymentClick.bind(this);
      this.onAddAddressClick = this.onAddAddressClick.bind(this);
      this.deleteAddress = this.deleteAddress.bind(this);
    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            console.log(this.state.userdata)
            this.ShowAddressApiCall(this.state.paginationNumber);
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


    async ShowAddressApiCall(pageno){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("status",1)
        myFormData.append("page",pageno)
        try {
            const { data } = await SellerServices.SellerShowAddress(myFormData)
            console.log(data);

            if(pageno>0){
                if( data.status == 0 ){
                    var oldLady=this.state.renderAddress;
                    this.setState({
                        renderAddress:oldLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:false,
                    })
                }
                if( data.status == 1 ){
                    var oldLady=this.state.renderAddress;
                    var newLady = oldLady.concat(data.data);
                    this.setState({
                        renderAddress:newLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
            }
            if(pageno==0){
                if( data.status == 0 ){
                    this.setState({
                        renderAddress:null,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
                if( data.status == 1 ){
                    this.setState({
                        renderAddress:data.data,
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
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.addressdeleted);
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
    loadMoreResults(info){
        if(this.state.loadMoreResults){
            var pageno = this.state.paginationNumber + 1;
            this.setState({paginationNumber:pageno},()=>{
                this.ShowAddressApiCall(pageno);
            })
        }
    }
    onRefresh() {
        this.setState({isFetching: true,paginationNumber:0,renderAddress:null,categories:null},() => {            
        this.getUserData();});
    }
    onBackClick(){
        this.props.navigation.goBack();
    }

    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }

    async onChangeAddressClick(item){
     
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("_id",item._id)
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("name",item.name)
        myFormData.append("address", item.address)
        myFormData.append("city", item.city)
        myFormData.append("state", item.state)
        myFormData.append("postal_code", item.postal)
        myFormData.append("mobile_no", item.phone)
        myFormData.append("is_default",1)

        try {
            this.setState({appLoading: true})
            const { data } = await SellerServices.SellerAddAddress(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appLoading: false})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1){
                this.setState({paginationNumber:0,renderAddress:null,categories:null},() => {            
                this.getUserData();});
            }
            this.setState({appLoading: false})
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

    onAddressDeleteClick(addressID){
        Alert.alert(
            this.state.renderLanguage.deleteaddress,
            this.state.renderLanguage.wantodeleteaddress,
            [
              {text: this.state.renderLanguage.no, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: this.state.renderLanguage.yes, onPress: () =>  this.deleteAddress(addressID)},
            ],
            {cancelable: false},
          );
    }

    onContinueToPaymentClick(){
        this.props.navigation.navigate('PaymentSeller');
    }

    onAddAddressClick(){
        this.props.navigation.navigate('CreateAddressSeller',{edit:false,item:{}});
    }

    onAddressClick(addOBJ){
        this.props.navigation.navigate('CreateAddressSeller',{edit:true,item:addOBJ});
    }

    async deleteAddress(addressID){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("id",addressID)
        myFormData.append("status",0)
        try {
            const { data } = await SellerServices.SellerShowAddress(myFormData)
            console.log(data);

                if( data.status == 0 ){
                    this.setState({
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                    this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0); 
                }
                if( data.status == 1 ){
                    this.setState({paginationNumber:0,myCustomAlert:1,renderAddress:null,categories:null},() => {            
                    this.getUserData();});
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
                <TouchableOpacity  onPress={this.onNotificationClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/bell.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>
        </View>
        
        <View style={{height: hp('93%'),width:wp('100%'),}} >

        <View style={{marginHorizontal:wp('5%'),flexDirection:'row',}}>
                <Text style={{color:'#000',fontSize:hp('2.5%'),fontWeight:"bold"}}>{this.state.renderLanguage.shippingaddress}</Text>
        </View>

        <View style={{marginTop:hp('1%'),marginHorizontal:wp('3%')}}>
            <FlatList
            contentContainerStyle={{paddingBottom:hp('20%')}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            onEndReachedThreshold={0.2}
            onEndReached={info => {
              this.loadMoreResults(info);
            }}
            data={this.state.renderAddress}
            keyExtractor={item => item.value}
            renderItem={({ item , index}) => 
                        
            <TouchableOpacity 
                    onPress={()=>{this.onAddressClick(item)}}
                    
                        style={{backgroundColor:"#fff",elevation:9,borderWidth:hp('0.2%'),borderColor:`${item.is_default == '1' ?'#4F45F0':'transparent'}`,marginHorizontal:wp('2%'),marginVertical:hp('2%')}}>

                            <View style={{flex:1}}>
                                <View style={{marginTop:15,paddingHorizontal:wp('3%')}}>
                                    <Text style={{fontSize:hp('1.7%'),fontWeight:"600"}}>{item.address}</Text>
                                </View>
                                <View style={{marginTop:hp('1.3%'),paddingHorizontal:wp('3%')}}>
                                    <Text style={{fontSize:hp('1.5%')}}>{this.state.renderLanguage.name}: {item.name}</Text>
                                </View>

                                <View style={{marginTop:hp('1%'),paddingHorizontal:wp('3%')}}>
                                    <Text style={{fontSize:hp('1.5%')}}>{this.state.renderLanguage.number}: {item.mobile_no}</Text>
                                </View>



                                <View style={{marginTop:hp('1%'),paddingHorizontal:wp('3%')}}>
                                    <Text style={{fontSize:hp('1.5%')}}>{this.state.renderLanguage.city}: {item.city}</Text>
                                </View>

                                <View style={{marginTop:hp('1%'),paddingHorizontal:wp('3%')}}>
                                    <Text style={{fontSize:hp('1.5%')}}>{this.state.renderLanguage.state}: {item.state}</Text>
                                </View>

                                <View style={{flexDirection:"row",alignSelf:"flex-end"}}>
                                {
                                    item.is_default == '1' ?
                                    null
                                    :
                                    <View>
                                    <TouchableOpacity 
                                        onPress={()=>{this.onAddressDeleteClick(item._id)}} 
                                        activeOpacity={0.5}
                                        style={{marginTop:hp('1.3%'),padding:hp('1%'),backgroundColor:"#4F45F0",borderRadius:hp('1%'),marginBottom:hp('1%'),marginRight:wp('5%'),alignSelf:"flex-end",alignItems:"center",flexDirection:"row"}}>
                                            <Icon6 name="ios-trash-outline" color={'#fff'} size={hp('3%')} />
                                        </TouchableOpacity>
                                    </View>
                                }

                                {
                                    item.is_default == '1' ? 
                                    <View style={{marginTop:hp('1.3%'),padding:hp('1%'),backgroundColor:"#4F45F0",borderRadius:hp('1%'),marginBottom:hp('1%'),marginRight:wp('3%'),alignSelf:"flex-end",alignItems:"center",flexDirection:"row"}}>
                                        <View>
                                        <Icon6 name="ios-checkmark-done-circle-sharp" color={'#fff'} size={hp('3%')} />
                                        </View>
                                    </View>
                                    :
                                    <TouchableOpacity 
                                    onPress={()=>{this.onChangeAddressClick(item)}}
                                    style={{marginTop:hp('1.3%'),padding:hp('1%'),backgroundColor:"#4F45F0",borderRadius:hp('1%'),marginBottom:hp('1%'),marginRight:wp('3%'),alignSelf:"flex-end",alignItems:"center",flexDirection:"row"}}>
                                        <View style= {{}}>
                                        <Icon6 name="md-arrow-redo-circle-sharp" color={'#fff'} size={hp('3%')} />
                                        </View>
                                    </TouchableOpacity>
                                }
                                </View>
                            </View>

            </TouchableOpacity>
     
                        }
                />


        </View>

        <TouchableOpacity 
        onPress={this.onAddAddressClick}  
        activeOpacity={0.9} 
        style={{
            position:"absolute",
            flexDirection:'row',
            alignItems:'center',
            backgroundColor:'#fafafa',
            bottom:this.state.renderAddress!=null?hp('8.5%'):hp('2%'),
            height:hp('6%'),
            width:wp('90%'),
            borderRadius:hp('1%'),
            justifyContent:'center',
            alignSelf:'center', 
            borderWidth:hp('0.2%'),
            borderStyle:'dashed',
            borderColor:"#4F45F0",
            }}>
                                <Image source={require('../../assets/icon/plus.png')} style={{height:hp('3%'),width:hp('3%'),marginRight:wp('5%')}} resizeMode='contain'></Image>
                                <Text style={{color:'#4F45F0',        fontSize:hp('2.3%')}}>Add Address</Text>
        </TouchableOpacity>
        {
            this.state.renderAddress != null ? 
                <TouchableOpacity 
                onPress={this.onContinueToPaymentClick} 
                activeOpacity={0.9} 
                style={{        
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
                }}>
                    <Text style={styles.loginButtonText}>Continue To Payment</Text>
                </TouchableOpacity>
            :null
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
        marginTop:hp('1.3%')
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
        fontSize:hp('1.7%')
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
    loginButtonContainer2:{
        position:"absolute",
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fafafa',
        bottom:hp('3%'),
        height:hp('6%'),
        width:wp('70%'),
        borderRadius:hp('1%'),
        justifyContent:'center',
        alignSelf:'center', 
        borderWidth:hp('0.2%'),
        borderStyle:'dashed',
        borderColor:"#4F45F0",
    },
    loginButtonContainer:{
        position:"absolute",
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F0',
        bottom:hp('3%'),
        height:hp('6%'),
        width:wp('70%'),
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