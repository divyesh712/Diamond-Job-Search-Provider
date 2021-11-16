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
  import { Container, Header, Content, Tab, Tabs } from 'native-base';
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
        renderReviews:[],
        renderSimilarProduct:[],
        imageModalVisible:false,
        reviewcount:0,
        cartcount:0,
        notificationcount:0,
        myCustomAlert:0,
        paginationNumber:0,
        userdata:{},
        appLoading:false,
        appFetchingLoader:false,
        isFetching: false,
        loadMoreResults:true,
        renderLanguage:MyLanguage.en

      };

      this.onBackClick = this.onBackClick.bind(this);
      this.onCartClick = this.onCartClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onReviewsClick = this.onReviewsClick.bind(this);
      this.onSaveProductClick = this.onSaveProductClick.bind(this);
      this.onUnsaveProductClick = this.onUnsaveProductClick.bind(this);
    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            console.log(this.state.userdata)
            this.ProductDetailShowApiCall(this.state.paginationNumber);
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


    async ProductDetailShowApiCall(pageno){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("_id",this.state.productID)
        myFormData.append("langid",this.state.userdata.lang_id)
        myFormData.append("userid",this.state.userdata._id)
        myFormData.append("page",pageno)

        try {
            const { data } = await SellerServices.SellerProductDetails(myFormData)
            console.log(data);
            if(pageno>0){
                if( data.status == 0 ){
                    var oldLady=this.state.renderReviews;
                    this.setState({
                        renderReviews:oldLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:false,
                    })
                }
                if( data.status == 1 ){
                    var oldLady=this.state.renderReviews;
                    var newLady = oldLady.concat(data.data.productreviews);
                    this.setState({
                        renderReviews:newLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
            }
            if(pageno==0){
                if( data.status == 0 ){
                    this.setState({
                        renderProduct:[],
                        renderSimilarProduct:[],
                        renderReviews:[],
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                    this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
                }
                if( data.status == 1 )
                {
                    if(data.data.productdeatile[0].image.length>0){
                        let myZoomImages = data.data.productdeatile[0].image.map((myValue,myIndex)=>{
                            return(
                                {url:myValue}
                                )
                            });
                        let finalobj = data.data.productdeatile[0];
                        finalobj.zoomImages=myZoomImages;   

                        this.setState({
                            renderProduct:finalobj,
                            renderReviews:data.data.productreviews,
                            renderSimilarProduct:data.data.similarproduct,
                            cartcount:data.cartcount,
                            notificationcount:data.notificationcount,
                            reviewcount:data.review,
                            appFetchingLoader:false,
                            appLoading:false,
                            isFetching:false,
                            loadMoreResults:true
                        })
                    }
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
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.productremovedfromwishlist,'',null,1500)
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
        // this.props.navigation.navigate('NotificationSeller');
    }

    onLayout = e => {
        this.setState({
          sliderWidth: e.nativeEvent.layout.width
        });
      };


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

    onProductClick(pid){
        this.props.navigation.replace('ProductPageSeller',{productID:pid});
    }

    onReviewClick(rid){
    }
 
    loadMoreResults(info){
        if(this.state.loadMoreResults){
            var pageno = this.state.paginationNumber + 1;
            this.setState({paginationNumber:pageno},()=>{
                this.ProductDetailShowApiCall(pageno);
            })
        }
    }
    onRefresh() {
        this.setState({isFetching: true,paginationNumber:0,renderProduct:null,categories:null},() => {            
        this.getUserData();});
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
                <TouchableOpacity  onPress={this.onBackClick} style={{marginHorizontal:hp('1.7%'),}}>
                <Image source={require('../../assets/icon/shape.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
            <View style={{width:wp('60%')}}>        
                <View style={{marginHorizontal:wp('5%')}}>
                <Text style={{fontSize:hp('1.7%')}} numberOfLines={1}>{this.state.renderProduct.product_name}</Text>
                </View>
                <View style={{alignItems:"center",marginHorizontal:wp('4%'),justifyContent:"center",flexDirection:"row"}}>
                    <View style={{}}>
                        <Text style={{fontSize:hp('1.5%'),fontWeight:"bold",color:"#4F45F08a"}}>₹{this.state.renderProduct.payable_amount}</Text>
                    </View>
                    <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",backgroundColor:"#4F45F0",marginHorizontal:wp('4%'),borderRadius:hp('2%')}}>
                        <Image source={require('../../assets/icon/star_1.png')} style={{height:hp('1.3%'),width:hp('1.3%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                        <Text style={{fontSize:hp('1.5%'),color:"#fff",paddingRight:hp('1%')}}>{this.state.renderProduct.rating}</Text>
                    </View>
                </View>
            </View>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity  onPress={this.onCartClick} style={{marginHorizontal:hp('1.7%')}}>
                {this.state.cartcount>0?
                    <View style={{height:hp('2.3%'),width:hp('2.3%'),borderRadius:hp("2.3%")/2,backgroundColor:"#4F45F0",position:"absolute",top:-hp('1%'),right:-wp('2%'),alignItems:"center",justifyContent:"center"}}>
                        <Text style={{fontSize:hp('1%'),color:"#ffffff"}}>{this.state.cartcount}</Text>
                    </View>
                :null
                }
                <Image source={require('../../assets/icon/cart.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>
        </View>

        <View style={{height: hp('40%'),width:wp('100%'),}} >
        {
            this.state.renderProduct.image.length > 0 ?
            <View style={{marginHorizontal:wp('5%'),marginVertical:hp('2%'),}} onLayout={this.onLayout}>
            <SliderBox
            ImageComponent={FastImage}
            images={this.state.renderProduct.image}
            sliderBoxHeight={hp('40%')}
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
           <View style={{height:hp('40%')}}></View>
           </View>
        } 
        </View>

        <View style={{height: hp('53%'),width:wp('100%')}} >
                        <Tabs tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                              tabContainerStyle={{elevation:2,width:wp('90%'),alignSelf:"center"}}
                        >
                          <Tab heading={"Products"} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyleactive}
                                 activeTextStyle={{color: '#ffffff',}} textStyle={{color: '#4F45F0'}}>
                                <ScrollView 
                                contentContainerStyle={{paddingBottom:hp('5%')}}
                                style={{
                                    flex: 1,
                                    marginTop:hp('0.5%'),
                                    
                                }}>
                                        <FlatList
                                        numColumns={3}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        data={this.state.renderSimilarProduct}
                                        keyExtractor={item => item.productid}
                                        renderItem={({ item }) => 
                                                    
                                                <TouchableOpacity 
                                                onPress={()=>{this.onProductClick(item.productid)}} 
                                                style={{backgroundColor:"transparent",marginHorizontal:wp('2%'),marginVertical:hp('2%')}}>

                                                        <View style={{flexDirection:'row',elevation:9 ,height:hp('10%'),width:wp('26%'), }}>
                                                        <Image
                                                        source={{uri: `${item.image}`}} 
                                                            style={{
                                                                height:hp('10%'),
                                                                width:wp('26%'),
                                                                backgroundColor:"#ffffff",
                                                            }} 
                                                            resizeMode='cover' />
                                                        </View>

                                                        <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",paddingHorizontal:wp('1%'),width:wp('30%')}}>
                                                            <View>
                                                                <Text style={{fontSize:hp('1.1%'),fontWeight:"bold",color:"#4F45F08a"}}>₹{item.payable_amount}</Text>
                                                            </View>
                                                            <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",backgroundColor:"#4F45F0",margin:hp('1%'),borderRadius:hp('2%')}}>
                                                                <Icon5 name="star" color={'#fff'} size={hp('1%')} style={{padding:hp('0.7%')}}/>
                                                                <Text style={{fontSize:hp('1.1%'),color:"#fff",paddingRight:wp('1%')}}>{item.rating.toFixed(1)}</Text>
                                                            </View>
                                                        </View>

                                                        <View>
                                                        <Text style={{fontSize:hp('1.1%'),paddingHorizontal:wp('1%'),width:wp('30%')}} numberOfLines={1}>{item.product_name.length < 18? `${item.product_name}`: `${item.product_name.substring(0, 18)} ...`}</Text>
                                                        </View>

                                                    </TouchableOpacity>
                                
                                                    }
                                        />
                                </ScrollView>
                            </Tab>

                            <Tab heading={"Details"} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyleactive}
                                 activeTextStyle={{color: '#ffffff',}} textStyle={{color: '#4F45F0'}}>
                                <ScrollView style={{
                                    flex: 1,
                                    marginTop: hp('1%'),
                                }}>
                                    <View style={{marginHorizontal:wp('5%')}}>
                                        <Text style={{fontSize:hp('2.1%'), color:"#4F45F0"}}>{this.state.renderLanguage.productdetails}</Text>
                                    </View>

                                    <View style={{marginHorizontal:wp('5%'),marginTop:3}}>
                                        <Text style={{fontSize:hp('1.65%'),color:"#0000008a"}}>{this.state.renderProduct.description}</Text>
                                    </View>
                                </ScrollView>
                            </Tab>

                            <Tab heading={"Reviews"} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyleactive}
                                 activeTextStyle={{color: '#ffffff',}} textStyle={{color: '#4F45F0'}}>
                                <ScrollView 
                                contentContainerStyle={{paddingBottom:hp('5%')}}
                                style={{
                                    flex: 1,
                                    marginTop:hp('0.5%'),
                                    
                                }}>
                                        <FlatList
                                        numColumns={1}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        onRefresh={() => this.onRefresh()}
                                        refreshing={this.state.isFetching}
                                        onEndReachedThreshold={0.2}
                                        onEndReached={info => {
                                          this.loadMoreResults(info);
                                        }}
                                        data={this.state.renderReviews}
                                        keyExtractor={item => item._id}
                                        contentContainerStyle={{justifyContent:"center",alignItems:"center"}}
                                        renderItem={({ item }) => 
                                                
                                                <TouchableOpacity 
                                                onPress={()=>{this.onReviewClick(item._id)}} 
                                                style={{backgroundColor:"#ffffff",height:hp('20.2%'),width:wp("96%"),marginVertical:hp('0.5%'),borderBottomWidth:hp('0.2%'),borderColor:"#000000" , flexDirection:"row"}}>

                                                <View style={{backgroundColor:"#ffffff",height:hp('20%'),width:wp("26%"),justifyContent:"center",alignItems:"center"}}>
                                                    <View style={{height:hp('10%'),width:hp("10%"),borderRadius:hp("10%")/2,justifyContent:"center",alignItems:"center"}}>
                                                    <Image
                                                        source={{uri: `${item.image}`}} 
                                                            style={{
                                                                height:hp('10%'),width:hp("10%"),borderRadius:hp("10%")/2,
                                                            }} 
                                                        resizeMode='cover' /> 
                                                    </View>  
                                                </View>

                                                <View style={{backgroundColor:"#ffff",height:hp('20%'),width:wp("55%")}}>
                                                <View style={{backgroundColor:"#ffffff",height:hp('5%'),width:wp("55%"),paddingHorizontal:wp('3%'),justifyContent:"center"}}>
                                                {
                                                    item.rating == 1 ?
                                                    <View style={{flexDirection:"row"}}>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginRight:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_3.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_3.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_3.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_3.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                                                                {
                                                    item.rating == 2 ?
                                                    <View style={{flexDirection:"row"}}>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginRight:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_3.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_3.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_3.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                                                                {
                                                    item.rating == 3 ?
                                                    <View style={{flexDirection:"row"}}>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginRight:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_3.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_3.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                                                                {
                                                    item.rating == 4 ?
                                                    <View style={{flexDirection:"row"}}>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginRight:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_3.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                                                                {
                                                    item.rating == 5 ?
                                                    <View style={{flexDirection:"row"}}>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginRight:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    <Image source={require('../../assets/icon/star_2.png')} style={{height:hp('2%'),width:hp('2%'),marginHorizontal:hp('1%'),marginVertical:hp('1%')}} resizeMode='contain'></Image>
                                                    </View>
                                                    :
                                                    null
                                                }
                                                </View>
                                                <View style={{backgroundColor:"#ffffff",height:hp('5%'),width:wp("55%"),paddingHorizontal:wp('3%'),justifyContent:"center"}}>
                                                <Text style={{fontSize:hp('1.7%'),color:"#000000"}} numberOfLines={2}>{item.username}</Text> 
                                                </View>
                                                <View style={{backgroundColor:"#ffffff",height:hp('10%'),width:wp("55%"),paddingHorizontal:wp('3%'),justifyContent:"flex-start"}}>
                                                <Text style={{fontSize:hp('1.4%'),color:"#000000"}} numberOfLines={5} >{item.description}</Text> 
                                                </View>
                                                </View>

                                                <View style={{backgroundColor:"#ffffff",height:hp('20%'),width:wp("15%")}}>
                                                    <View style={{justifyContent:"center",alignSelf:"center"}}>
                                                        <Text style={{fontSize:hp('1.1%'),color:"gray"}}>{moment(item.updated_at).format('D MMM,YYYY')}</Text> 
                                                    </View>
                                                </View>

                                                </TouchableOpacity>                                
                                            }
                                        />
                                </ScrollView>
                            </Tab>

                        </Tabs>
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
    tabStyle: {
        backgroundColor: "#fff"
    },
    tabStyleactive: {
        backgroundColor: "#4F45F0",
        elevation:9,
    },
    tabBarUnderlineStyle: {
        backgroundColor: "#ffffff9a",
        marginBottom:hp('0%'),
    },


})