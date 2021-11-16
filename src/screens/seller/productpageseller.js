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
    ScrollView,
    ActivityIndicator,
    Modal
  } from 'react-native';
  import ImageViewer from 'react-native-image-zoom-viewer';
  import FastImage from 'react-native-fast-image';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/Fontisto';

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SellerServices from '../../api/sellerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import { SliderBox } from "react-native-image-slider-box";
  import {MyLanguage} from '../../utils/languagehelper';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        productID:this.props.route.params.productID,
        renderProduct:{   
                zoomImages:[],
                image:[]
            },
        imageModalVisible:false,
        reviewcount:0,
        cartcount:0,
        notificationcount:0,
        myCustomAlert:0,
        userdata:{},
        appLoading:false,
        appFetchingLoader:false,
        renderLanguage:MyLanguage.en

      };

      this.onBackClick = this.onBackClick.bind(this);
      this.onCartClick = this.onCartClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onReviewsClick = this.onReviewsClick.bind(this);
      this.onAddToCartClick = this.onAddToCartClick.bind(this);
      this.onSaveProductClick = this.onSaveProductClick.bind(this);
      this.onUnsaveProductClick = this.onUnsaveProductClick.bind(this);
      this.onBuyNowClick = this.onBuyNowClick.bind(this);

    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            console.log(this.state.userdata)
            this.ProductDetailShowApiCall();
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


    async ProductDetailShowApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("_id",this.state.productID)
        myFormData.append("langid",this.state.userdata.lang_id)
        myFormData.append("userid",this.state.userdata._id)

        try {
            const { data } = await SellerServices.SellerProductDetails(myFormData)
            console.log(data);

                if( data.status == 0 ){
                    this.setState({
                        renderProduct:null,
                        appLoading:false,
                    })
                    this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
                }
                if( data.status == 1 ){
                    if(data.data.productdeatile[0].image.length>0){
                        let myZoomImages = data.data.productdeatile[0].image.map((myValue,myIndex)=>{
                            return(
                                {url:myValue}
                                )
                            });
                        let finalobj = data.data.productdeatile[0];
                        finalobj.zoomImages=myZoomImages;   
                        console.log("My OBJ ====",finalobj.zoomImages)
                        this.setState({
                            renderProduct:finalobj,
                            cartcount:data.cartcount,
                            notificationcount:data.notificationcount,
                            reviewcount:data.review,
                            appLoading:false,
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
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.productwishlisted,'',null,1500)

            }
            if(this.state.myCustomAlert == 3){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.productremovedfromcart,'',null,1500)
            }
            if(this.state.myCustomAlert == 4){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.productaddedtocart,'',null,1500)
            }
            if(this.state.myCustomAlert == 5){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('info', this.state.renderLanguage.productalreadyaddedincart,'',null,1500)
            }
            if(this.state.myCustomAlert == 5){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.productaddingtocartfailed,'',null,1500)
            }

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

    onBackClick(){
        this.props.navigation.goBack();
    }

    onCartClick(){
        this.props.navigation.navigate('My Cart');
    }


    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }

    onReviewsClick(){
        this.props.navigation.navigate('ReviewSeller',{productID:this.state.productID});
    }

    onLayout = e => {
        this.setState({
          sliderWidth: e.nativeEvent.layout.width
        });
      };

    async onAddToCartClick(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        // myFormData.append("seller_id",this.state.renderProduct.sellerid)
        myFormData.append("seller_id",42)
        myFormData.append("product_id",this.state.productID)
        myFormData.append("qty",1)

        try {
            const { data } = await SellerServices.SellerProductAddToCart(myFormData)
            console.log(data);

                if( data.status == 0 && data.exist == 1 ){
                    this.setState({myCustomAlert:5})
                }
                if( data.status == 0 && data.exist == 0 ){
                    this.setState({myCustomAlert:6})
                }
                if( data.status == 1 ){
                    this.setState({myCustomAlert:4})
                }  
                
                this.ProductDetailShowApiCall();

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

    onBuyNowClick(){
        this.props.navigation.navigate('ShippingSeller');
    }

    async onSaveProductClick(productid){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("product_id",productid)
        myFormData.append("status",1)
        myFormData.append("user_id",this.state.userdata._id)

        try {
            const { data } = await SellerServices.SellerWishlist(myFormData)
            console.log(data);

            if( data.status == 1 ){
                this.setState({myCustomAlert:2})
            }
            if( data.status == 0 ){
                this.setState({myCustomAlert:1})
            }
            this.ProductDetailShowApiCall();
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

    async onUnsaveProductClick(productid){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("product_id",productid)
        myFormData.append("status",0)
        myFormData.append("user_id",this.state.userdata._id)

        try {
            const { data } = await SellerServices.SellerWishlist(myFormData)
            console.log(data);

            if( data.status == 1 ){
                this.setState({myCustomAlert:3})
            }
            if( data.status == 0 ){
                this.setState({myCustomAlert:1})
            }
            this.ProductDetailShowApiCall();
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
                {this.state.imageModalVisible ?
                        <Modal
                            visible={this.state.imageModalVisible}
                            transparent={true}
                        >
                            <View style={{width:wp("100%"), height:hp("100%"), backgroundColor: "#000", justifyContent: "center"}}>
                                <View style={{width:wp("100%"), height:hp("100%")}}>
                                    <ImageViewer
                                        style={{width:wp("100%"), height:hp("100%")}}
                                        imageUrls={this.state.renderProduct.zoomImages}
                                        enableImageZoom={true}
                                        enablePreload
                                        loadingRender={() => (
                                            <View style={{width:wp("100%"), height:hp("100%"), justifyContent: "center", alignItems: "center"}}>
                                                <ActivityIndicator size="large" color="#4F45F0"/>
                                                <Text style={{marginTop: hp('2%'), color: "#4F45F0"}}>{this.state.renderLanguage.loading}</Text>
                                            </View>)}

                                    />

                                    <TouchableOpacity onPress={() => this.setState({imageModalVisible: false})} style={{
                                        width: wp("100%"),
                                        height: hp("7%"),
                                        borderTopLeftRadius:hp('2%'),
                                        borderTopRightRadius:hp('2%'),
                                        backgroundColor: "#4F45F0",
                                        alignItems: "center",
                                        alignSelf:"center",
                                        justifyContent: "center"
                                    }}>
                                        <Text style={{color: "#fff", fontSize:hp('2.1%'), fontWeight: "bold"}}>{this.state.renderLanguage.back}</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </Modal>
                : null}

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
                <TouchableOpacity  onPress={this.onCartClick} style={{marginHorizontal:hp('1.7%')}}>
                {this.state.cartcount>0?
                    <View style={{zIndex:100,elevation:3,height:hp('2.3%'),width:hp('2.3%'),borderRadius:hp("2.3%")/2,backgroundColor:"#4F45F0",position:"absolute",top:-hp('1%'),right:-wp('2%'),alignItems:"center",justifyContent:"center"}}>
                        <Text style={{fontSize:hp('1%'),color:"#ffffff"}}>{this.state.cartcount}</Text>
                    </View>
                :null
                }
                <Image source={require('../../assets/icon/cart.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
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
        
        <ScrollView style={{marginBottom:hp('7%')}} contentContainerStyle={{paddingBottom:hp('20%')}} showsVerticalScrollIndicator={false}>
        
        {
            this.state.renderProduct.image.length > 0 ?
            <View style={{marginHorizontal:wp('5%'),marginVertical:hp('2%'),}} onLayout={this.onLayout}>
            <SliderBox
            ImageComponent={FastImage}
            images={this.state.renderProduct.image}
            sliderBoxHeight={hp('30%')}
            parentWidth={this.state.sliderWidth}
            onCurrentImagePressed={index => {
                this.setState({imageModalVisible: true})
            }}
            dotColor="#4F45F0"
            inactiveDotColor="#4F45F05a"
            resizeMethod={'resize'}
            resizeMode={'cover'}
            imageLoadingColor="#4F45F0"
            />
            </View>
        :
           <View style={{marginHorizontal:wp('5%'),marginVertical:hp('2%'),}} onLayout={this.onLayout}>
           <View style={{height:hp('30%')}}></View>
           </View>
        }

        <View style={{marginHorizontal:wp('5%')}}>
            <Text style={{fontSize:hp('2.7%')}}>{this.state.renderProduct.product_name}</Text>
        </View>

        <View style={{alignItems:"center",marginHorizontal:wp('5%'),justifyContent:"space-evenly",marginTop:hp('2%'),flexDirection:"row"}}>
            <View style={{}}>
                <Text style={{fontSize:hp('2.1%'),fontWeight:"bold",color:"#4F45F08a"}}>₹{this.state.renderProduct.payable_amount}</Text>
            </View>

            <View style={{marginHorizontal:wp('20%'),top:1}}>
                <Text style={{fontSize:hp('2.1%'),color:"#000",textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>₹{this.state.renderProduct.price}</Text>
            </View>

            <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",backgroundColor:"#4F45F0",marginHorizontal:wp('1%'),borderRadius:hp('2%')}}>
                <Image source={require('../../assets/icon/star_1.png')} style={{height:hp('1.8%'),width:hp('1.8%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                <Text style={{fontSize:hp('2.1%'),color:"#fff",paddingRight:hp('1%')}}>{this.state.renderProduct.rating}</Text>
            </View>
        </View>

        <View style={{borderTopWidth:hp('0.1%'),borderBottomWidth:hp('0.1%'),paddingVertical:hp('1.3%'),marginVertical:hp('1%'),}}>
            <View style={{marginHorizontal:wp('5%'),flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                <View style={{justifyContent:"center",backgroundColor:"#4F45F0",paddingVertical:hp('1%'),paddingHorizontal:wp('5%'),borderRadius:hp('1%')}}>
                    <Text style={{fontSize:hp('2.1%'),color:"#fff"}}>{this.state.renderProduct.rating}</Text>
                </View>

                <View style={{justifyContent:"center",marginLeft:wp('5%'),marginRight:wp('10%')}}>
                    <Text style={{fontSize:hp('2.1%'),color:"#000"}}>{this.state.renderProduct.ratingstatus}</Text>
                </View>

                <TouchableOpacity onPress={this.onReviewsClick} style={{justifyContent:"center",alignItems:"center",flexDirection:"row" , marginLeft:wp('12%')}}>
                    <Text style={{fontSize:hp('1.7%'),color:"#4F45F08a"}}>{this.state.reviewcount} {this.state.renderLanguage.reviews}</Text>
                    <Icon5 name="right" color={'#4F45F08a'} size={hp('2%')} style={{paddingHorizontal:wp('1%')}}/>
                </TouchableOpacity>
            </View>        
        </View>

        <View style={{marginHorizontal:wp('5%')}}>
            <Text style={{fontSize:hp('2.1%'), color:"#4F45F0"}}>{this.state.renderLanguage.description}</Text>
        </View>

        <View style={{marginHorizontal:wp('5%'),marginTop:3}}>
            <Text style={{fontSize:hp('1.65%'),color:"#0000008a"}}>{this.state.renderProduct.description}</Text>
        </View>



        {
            this.state.renderProduct.company_name !== "" && this.state.renderProduct.opening_year !== "" && this.state.renderProduct.num_of_emp !== "" ?
            <View style={{marginHorizontal:wp('5%'),marginTop:30}}>
            <Text style={{fontSize:hp('2.1%') , color:"#4F45F0"}}>{this.state.renderLanguage.aboutthecompany}</Text>
            </View>
            :null
        }
        {
            this.state.renderProduct.company_name !== ""  ?
            <View>
            <View style={{marginHorizontal:wp('5%'),marginTop:12}}>
                <Text style={{fontSize:hp('1.65%'),color:"#0000008a"}}>{this.state.renderLanguage.companyname}</Text>
            </View>
            <View style={{marginHorizontal:wp('5%'),marginTop:3}}>
                <Text style={{fontSize:hp('1.65%'),color:"#000"}}>{this.state.renderProduct.company_name}</Text>
            </View>
            </View>
            :null
        }
        {
            this.state.renderProduct.opening_year !== "" ?
            <View>
            <View style={{marginHorizontal:wp('5%'),marginTop:15}}>
                <Text style={{fontSize:hp('1.65%'),color:"#0000008a"}}>{this.state.renderLanguage.yearofestablistment}</Text>
            </View>
            <View style={{marginHorizontal:wp('5%'),marginTop:3}}>
                <Text style={{fontSize:hp('1.65%'),color:"#000"}}>{this.state.renderProduct.opening_year}</Text>
            </View>
            </View>
            :null
        }

        {
            this.state.renderProduct.num_of_emp !== "" ?
            <View>
            <View style={{marginHorizontal:wp('5%'),marginTop:15}}>
                <Text style={{fontSize:hp('1.65%'),color:"#0000008a"}}>{this.state.renderLanguage.numberofemployees}</Text>
            </View> 
            <View style={{marginHorizontal:wp('5%'),marginTop:3}}>
                <Text style={{fontSize:hp('1.65%'),color:"#000"}}>{this.state.renderProduct.num_of_emp}</Text>
            </View>
            </View>
            :null
        }

        </ScrollView>
        {
                this.state.renderProduct.is_wish == 0 ?
                    <TouchableOpacity onPress={()=>{this.onSaveProductClick(this.state.renderProduct.productid)}} 
                    activeOpacity={0.5}
                    style= {{
                            //Here is the trick
                            position: 'absolute',
                            alignItems:'center',
                            justifyContent:'center',
                            width:hp('5%'),
                            height:hp('5%'),
                            borderRadius:hp('5%')/2,
                            backgroundColor:"#4F45F0",
                            right:wp('5%'),
                            bottom:hp('11%'),
                        }}>
                        <Image source={require('../../assets/icon/heart_1.png')} style={{height:hp('5%'),width:hp('5%')}} resizeMode='contain'></Image>
                    </TouchableOpacity>
                :
                    <TouchableOpacity onPress={()=>{this.onUnsaveProductClick(this.state.renderProduct.productid)}} 
                    activeOpacity={0.5}
                    style= {{
                            //Here is the trick
                            position: 'absolute',
                            alignItems:'center',
                            justifyContent:'center',
                            width:hp('5%'),
                            height:hp('5%'),
                            borderRadius:hp('5%')/2,
                            backgroundColor:"#4F45F0",
                            right:wp('5%'),
                            bottom:hp('11%'),
                        }}>
                        <Image source={require('../../assets/icon/hart.png')} style={{height:hp('5%'),width:hp('5%')}} resizeMode='contain'></Image>
                    </TouchableOpacity>                     
        }

        <View style={{position: 'absolute',flexDirection:"row",bottom:0}}>
                <TouchableOpacity onPress={this.onAddToCartClick} style={{borderTopLeftRadius:hp('2%'),backgroundColor:"#fafafa",paddingVertical:hp('2%'),justifyContent:"center",alignItems:"center",width:wp('50%')}}>
                    <Text style={{fontSize:hp('2.1%'),color:"#000"}}>{this.state.renderLanguage.addtocart}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onBuyNowClick} style={{borderTopRightRadius:hp('2%'),backgroundColor:"#4F45F0",paddingVertical:hp('2%'),justifyContent:"center",alignItems:"center",width:wp('50%')}}>
                    <Text style={{fontSize:hp('2.1%'),color:"#fff"}}>{this.state.renderLanguage.buynow}</Text>
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
        bottom:hp('5%'),
        height:hp('6%'),
        width:wp('70%'),
        borderRadius:hp('1%'),
        justifyContent:'center',
        alignSelf:'center'
    },
    loginButtonText:{
        color:'white',
        fontSize:hp('2%')
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