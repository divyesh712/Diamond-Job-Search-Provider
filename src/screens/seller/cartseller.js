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
    StatusBar
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
        renderProducts:null,
        userdata:{},
        appLoading:false,
        appFetchingLoader:false,
        myCustomAlert:0,
        notificationcount:0,
        paginationNumber:0,
        isFetching: false,
        loadMoreResults:true,
        renderLanguage:MyLanguage.en

      };

      this.onBackClick = this.onBackClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onQuantityMinusClick = this.onQuantityMinusClick.bind(this);
      this.onQuantityPlusClick = this.onQuantityPlusClick.bind(this);
      this.onProductRemoveFromCartClick = this.onProductRemoveFromCartClick.bind(this);
      this.onRefresh = this.onRefresh.bind(this);
      this.onContinueClick = this.onContinueClick.bind(this);
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
            this.ShowCartApiCall(this.state.paginationNumber);
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


    async ShowCartApiCall(pageno){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        // myFormData.append("langid",this.state.userdata.lang_id)
        myFormData.append("page",pageno)
        try {
            const { data } = await SellerServices.SellerShowCart(myFormData)
            console.log(data);

            if(pageno>0){
                if( data.status == 0 ){
                    var oldLady=this.state.renderProducts;
                    this.setState({
                        renderProducts:oldLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:false,
                    })
                }
                if( data.status == 1 ){
                    var oldLady=this.state.renderProducts;
                    var newLady = oldLady.concat(data.product);
                    this.setState({
                        renderProducts:newLady,
                        notificationcount:data.notificationcount,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
            }
            if(pageno==0){
                if( data.status == 0 ){
                    this.setState({
                        renderProducts:null,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
                if( data.status == 1 ){
                    this.setState({
                        renderProducts:data.product,
                        notificationcount:data.notificationcount,
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
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500,'',null,1500)
            }
            if(this.state.myCustomAlert == 2){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.productremovedfromcart,'',null,1500)
            }
            if(this.state.myCustomAlert == 3){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.productremovefailed,'',null,1500)
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
                this.ShowCartApiCall(pageno);
            })
        }
    }
    onRefresh() {
        this.setState({isFetching: true,paginationNumber:0,renderProducts:null,categories:null},() => {            
        this.getUserData();});
    }

    onBackClick(){
        this.props.navigation.goBack();
    }

    onContinueClick(){
        this.props.navigation.navigate('ShippingSeller');
    }

    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }

    async onQuantityMinusClick(cartid){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("_id",cartid)
        myFormData.append("status",0)

        try {
            const { data } = await SellerServices.SellerCartQuantity(myFormData)
            console.log(data);

            if( data.status == 1 ){
                var myArray=this.state.renderProducts;
                myArray.find(x => x.id === cartid).qty=data.product[0].qty;
                this.setState({renderProducts:myArray},()=>{"myobj    ====",data.product[0].qty})
            }
            if( data.status == 0 ){
                this.setState({myCustomAlert:1})
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

    async onQuantityPlusClick(cartid){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("_id",cartid)
        myFormData.append("status",1)

        try {
            const { data } = await SellerServices.SellerCartQuantity(myFormData)
            console.log(data);

            if( data.status == 1 ){
                var myArray=this.state.renderProducts;
                myArray.find(x => x.id === cartid).qty=data.product[0].qty;
                this.setState({renderProducts:myArray},()=>{"myobj    ====",data.product[0].qty})
            }
            if( data.status == 0 ){
                this.setState({myCustomAlert:1})
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

    async onProductRemoveFromCartClick(cartid){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("_id",cartid)
        myFormData.append("status",2)

        try {
            const { data } = await SellerServices.SellerCartQuantity(myFormData)
            console.log(data);

            if( data.status == 1 ){
                this.setState({myCustomAlert:2})
            }
            if( data.status == 0 ){
                this.setState({myCustomAlert:3})
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
                {this.state.notificationcount>0?
                    <View style={{height:hp('2.3%'),zIndex:100,elevation:3,width:hp('2.3%'),borderRadius:hp("2.3%")/2,backgroundColor:"#4F45F0",position:"absolute",top:-hp('1%'),right:-wp('2%'),alignItems:"center",justifyContent:"center"}}>
                        <Text style={{fontSize:hp('1%'),color:"#ffffff"}}>{this.state.notificationcount}</Text>
                    </View>
                :null
                }
                <Image source={require('../../assets/icon/bell.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>
        </View>
        
        <View style={{height: hp('93%'),width:wp('100%'),}} >

        <View style={{marginHorizontal:wp('5%'),flexDirection:'row',}}>
                <Text style={{color:'#000',fontSize:hp('2.5%'),fontWeight:"bold"}}>{this.state.renderLanguage.cart}</Text>
        </View>

        <View style={{marginTop:hp('1%'),marginHorizontal:wp('3%')}}>
            <FlatList
            contentContainerStyle={{paddingBottom:hp('20%')}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.renderProducts}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            onEndReachedThreshold={0.2}
            onEndReached={info => {
              this.loadMoreResults(info);
            }}
            keyExtractor={item => item.id}
            renderItem={({ item , index}) => 
                        
                    <View style={{backgroundColor:"#ffffff",elevation:9,marginHorizontal:wp('2%'),height:hp('18%'),flexDirection:"row",marginVertical:hp('2%')}}>

                            <View >
                            <Image
                            source={{uri: `${item.image}`}} 
                            style={{
                                    height:hp('18%'),
                                    width:wp('30%'),
                                    backgroundColor:"#ffffff",
                                }} 
                                resizeMode='cover' />
                            </View>

                            <View style={{flex:1}}>
                            
                            <View>
                            <TouchableOpacity 
                                onPress={()=>{this.onProductRemoveFromCartClick(item.id)}} 
                                activeOpacity={0.5}
                                style= {{
                                        //Here is the trick
                                        position: 'absolute',
                                        alignSelf:'flex-end',
                                        justifyContent:'center',
                                        width: hp('4%'),
                                        height: hp('4%'),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        right: wp('1%'),
                                        top: hp('0.5%'),
                                    }}>
                                <Image source={require('../../assets/icon/cencel_icon.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
                                </TouchableOpacity>
                                </View>

                                <View style={{marginTop:hp('2%'),paddingHorizontal:wp('3%'),marginRight:wp('5%')}}>
                                    <Text style={{fontSize:hp('2%'),textAlign:"left"}} numberOfLines={3}>{item.product_name}</Text>
                                </View>

                                <View style={{marginTop:hp('3%'),paddingHorizontal:wp('3%'),flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                                    <Text style={{fontSize:hp('2%'),color:"#4F45F0"}}>₹{item.payable_amount}</Text>
                                        <View style={{paddingHorizontal:wp('3%'),backgroundColor:"#fafafa",borderRadius:hp('1%'),paddingVertical:hp('1%'),alignSelf:"center",alignItems:"center",flexDirection:"row"}}>
                                        <TouchableOpacity 
                                        onPress={()=>{this.onQuantityMinusClick(item.id)}}
                                        activeOpacity={0.5}
                                        style= {{marginRight:wp('5%')}}>
                                        <Image source={require('../../assets/icon/minus.png')} style={{height:hp('2.4%'),width:hp('2.4%')}} resizeMode='contain'></Image>
                                        </TouchableOpacity>

                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0"}}>{item.qty}</Text>

                                        <TouchableOpacity 
                                        onPress={()=>{this.onQuantityPlusClick(item.id)}}
                                        activeOpacity={0.5}
                                        style= {{marginLeft:wp('5%')}}>
                                        <Image source={require('../../assets/icon/plus.png')} style={{height:hp('2.4%'),width:hp('2.4%')}} resizeMode='contain'></Image>
                                        </TouchableOpacity>
                                        </View>
                                </View>


                            </View>

                        </View>
     
                        }
                />
        </View>
        {
            this.state.renderProducts != null ?
                <TouchableOpacity onPress={this.onContinueClick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.continue}</Text>
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
        backgroundColor:'#fafafa',
        marginHorizontal:hp('2%'),
        marginTop:hp('2%'),
        height:hp('6%'),
        width:wp('93%'),
        elevation:9,
        borderRadius:hp('1.2%'),
    },
    iconInputField:{
        marginLeft:hp('1%'),
        flex:1,
        color:"#000"
    },
    iconInputImage:{
        marginHorizontal:wp('4%')
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