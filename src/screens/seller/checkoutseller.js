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
        renderProducts:null,
        address:{},
        billing:{},
        userdata:{},
        appLoading:false,
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
      this.onBuyClick = this.onBuyClick.bind(this);
    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            console.log(this.state.userdata)
            this.CheckoutApiCall(this.state.paginationNumber);
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

    async CheckoutApiCall(pageno){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("langid",this.state.userdata.lang_id)
        myFormData.append("page",pageno)
        try {
            const { data } = await SellerServices.SellerCheckout(myFormData)
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
                    // var oldLady=this.state.renderProducts;
                    // var newLady = oldLady.concat(data.product);
                    // this.setState({
                    //     renderProducts:newLady,
                    //     appFetchingLoader:false,
                    //     appLoading:false,
                    //     isFetching:false,
                    // })
                }
            }
            if(pageno==0){
                if( data.status == 0 ){
                    this.setState({
                        renderProducts:null,
                        address:{},
                        billing:{},
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
                if( data.status == 1 ){
                    this.setState({
                        renderProducts:data.data.product,
                        address:data.data.address[0],
                        billing:data.data.finalpayment[0],
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
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.somethingwentwrong,'',null,1500)
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

    onBackClick(){
        this.props.navigation.goBack();
    }

    onBuyClick(){
        this.props.navigation.navigate('OrderCompletionSeller');
    }

    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }

    onQuantityMinusClick(index){
        var productArray = this.state.renderProducts;
        var clickedProduct = productArray[index];

        if(clickedProduct.quantity > 1)
        {
            var updatedQuantity = clickedProduct.quantity - 1 ;
            productArray[index].quantity = updatedQuantity;
            this.setState({renderProducts:productArray})
        }
    }

    onQuantityPlusClick(index){
        var productArray = this.state.renderProducts;
        var clickedProduct = productArray[index];

        if(clickedProduct.quantity > 0)
        {
            var updatedQuantity = clickedProduct.quantity + 1 ;
            productArray[index].quantity = updatedQuantity;
            this.setState({renderProducts:productArray})
        }
    }

    onProductRemoveFromCartClick(){
        this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.productremovedfromcart,'',null,1500)
    }

    loadMoreResults(info){
        if(this.state.loadMoreResults){
            var pageno = this.state.paginationNumber + 1;
            this.setState({paginationNumber:pageno},()=>{
                this.CheckoutApiCall(pageno);
            })
        }
    }
    onRefresh() {
        this.setState({isFetching: true,paginationNumber:0,renderProducts:null,categories:null},() => {            
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
                <Text style={{color:'#000',fontSize:hp('2.5%'),fontWeight:"bold"}}>{this.state.renderLanguage.checkout}</Text>
        </View>

        <View style={{marginTop:hp('1%'),marginHorizontal:wp('3%'),height:hp('40%')}}>
            <FlatList
            contentContainerStyle={{paddingBottom:hp('8%')}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.renderProducts}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            onEndReachedThreshold={0.2}
            onEndReached={info => {
              this.loadMoreResults(info);
            }}
            keyExtractor={item => item.productid}
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

        <ScrollView style={{height:hp('53%'),marginTop:hp('1%')}} contentContainerStyle={{paddingBottom:hp('20%')}}>
        <View style={{marginHorizontal:wp('3%')}}>
                <View style={{marginTop:hp('1%'),paddingHorizontal:wp('1%')}}>
                    <Text style={{fontSize:hp('1.7%'),fontWeight:"600"}}>{this.state.address.address}</Text>
                </View>
                <View style={{marginTop:hp('1.5%'),paddingHorizontal:wp('1%')}}>
                    <Text style={{fontSize:hp('1.5%')}}>{this.state.renderLanguage.name}: {this.state.address.name}</Text>
                </View>

                <View style={{marginTop:hp('1%'),paddingHorizontal:wp('1%')}}>
                    <Text style={{fontSize:hp('1.5%')}}>{this.state.renderLanguage.number}: {this.state.address.mobile_no}</Text>
                </View>



                <View style={{marginTop:hp('1%'),paddingHorizontal:wp('1%')}}>
                    <Text style={{fontSize:hp('1.5%')}}>{this.state.renderLanguage.city}: {this.state.address.city}</Text>
                </View>

                <View style={{marginTop:hp('1%'),paddingHorizontal:wp('1%')}}>
                    <Text style={{fontSize:hp('1.5%')}}>{this.state.renderLanguage.state}: {this.state.address.state}</Text>
                </View>
        </View>

        <View style={{marginHorizontal:wp('3%'),marginTop:hp('1%'),borderTopWidth:hp('0.2%')}}>
                <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:hp('1%'),paddingHorizontal:wp('2%')}}>
                <Text style={{color:'#0000008a',fontSize:hp('1.7%')}}>{this.state.renderLanguage.subtotal}</Text>
                <Text style={{color:'#000',fontSize:hp('1.7%')}}>₹{this.state.billing.subtotal}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:hp('1%'),paddingHorizontal:wp('2%')}}>
                <Text style={{color:'#0000008a',fontSize:hp('1.7%')}}>{this.state.renderLanguage.shipping}</Text>
                <Text style={{color:'#000',fontSize:hp('1.7%')}}>₹{this.state.billing.shiping}</Text>
                </View>
                <View style={{borderTopWidth:hp('0.2%'),marginTop:hp('1%')}}></View>
                <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:hp('1.5%'),paddingHorizontal:wp('2%')}}>
                <Text style={{color:'#0000008a',fontSize:hp('1.7%')}}>{this.state.renderLanguage.total}</Text>
                <Text style={{color:'#000',fontSize:hp('1.7%')}}>₹{this.state.billing.total}</Text>
                </View>
        </View>

        </ScrollView>

        <TouchableOpacity onPress={this.onBuyClick} activeOpacity={0.9} style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.buy}</Text>
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