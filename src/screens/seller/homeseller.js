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
    Keyboard,
    BackHandler,
    Animated
  } from 'react-native';
  let {width, height} = Dimensions.get('window');
  import {useNavigationState} from '@react-navigation/native';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/SimpleLineIcons';
  import Icon9 from 'react-native-vector-icons/Feather';
  import Icon10 from 'react-native-vector-icons/MaterialIcons';

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SellerServices from '../../api/sellerservices';
  import SeekerServices from '../../api/seekerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {MyLanguage} from '../../utils/languagehelper';


  export default function(props) {
    const routesLength = useNavigationState(state => state.routes.length);
    return <SplashHome {...props} routesLength={routesLength} />;
  }

class SplashHome extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          categories:null,
          renderProducts:{feature:null,best:null},
          cartcount:0,
          notificationcount:0,
          apijobs:null,
          userdata:{},
          searchstring:'',
          appLoading:false,
          appFetchingLoader:false,
          backClickCount: 0,
          renderLanguage:MyLanguage.en,
          routesLength:this.props.routesLength,
      };

      this.generateRandomColor = this.generateRandomColor.bind(this);
      this.onDrawerClick = this.onDrawerClick.bind(this);
      this.onFilterClick = this.onFilterClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onCategoriesSeeAllClick = this.onCategoriesSeeAllClick.bind(this);
      this.onFeaturedSeeAllClick = this.onFeaturedSeeAllClick.bind(this);
      this.onBestSellSeeAllClick = this.onBestSellSeeAllClick.bind(this);
      this.onProductClick = this.onProductClick.bind(this);
      this.onCategoryClick = this.onCategoryClick.bind(this);
      this.onApplyNowClick = this.onApplyNowClick.bind(this);
      this.onSaveProductClick = this.onSaveProductClick.bind(this);
      this.onUnsaveProductClick = this.onUnsaveProductClick.bind(this);
      this.springValue = new Animated.Value(100) ;
      this.handleBackButton = this.handleBackButton.bind(this);
    }

    componentDidMount(){
        var that = this;
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            that.getUserData();
            that._backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
          });
        this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
            that._backHandler.remove();
          });
    }

    componentWillUnmount() {
        this._unsubscribe();
        this._unsubscribe2();
    }

    _spring() {
        this.setState({backClickCount: 1}, () => {
            Animated.sequence([
                Animated.spring(
                    this.springValue,
                    {
                        toValue: -.1 * height,
                        friction: 5,
                        duration: 300,
                        useNativeDriver: true,
                    }
                ),
                Animated.timing(
                    this.springValue,
                    {
                        toValue: 100,
                        duration: 300,
                        useNativeDriver: true,
                    }
                ),

            ]).start(() => {
                this.setState({backClickCount: 0});
            });
        });

    }

    handleBackButton = () => {
        let index = this.state.routesLength
        console.log('Index == ',index)
        if(index==6){
            this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
            return true;
        }else{
            return true;
        }
    };

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            this.SellerHomeApiCall();
            this.SellerHomeCategoryApiCall();
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

    async SellerHomeCategoryApiCall(){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("langid",this.state.userdata.lang_id)
          try {
            const { data } = await SellerServices.SellerHomeCategory(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    categories:null,
                    appFetchingLoader:false,
                    appLoading:false
                })
            }

            if( data.status == 1 ){
                this.setState({
                    categories:data.data,
                    appFetchingLoader:false,
                    appLoading:false
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

    async SellerHomeApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("userid",this.state.userdata._id)
        myFormData.append("langid",this.state.userdata.lang_id)

        try {
            this.setState({
                appFetchingLoader:true,
            })
            const { data } = await SellerServices.SellerHome(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    renderProducts:{feature:null,best:null},
                    cartcount:0,
                    notificationcount:0,
                    appFetchingLoader:false,
                    appLoading:false
                })
                this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1 ){
                this.setState({
                    renderProducts:data.data,
                    cartcount:data.cartcount,
                    notificationcount:data.notificationcount,
                    appFetchingLoader:false,
                    appLoading:false
                })
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

          }
          catch(error){
            console.log(error)
            this.setState({appFetchingLoader:false,appLoading:false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    generateRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        color = color + '7a';
        return color;
      }

    onDrawerClick(){
        this.props.navigation.toggleDrawer();
    }

    onFilterClick(){
        this.props.navigation.navigate('Home');
    }

    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }

    onCategoriesSeeAllClick(){
        this.props.navigation.navigate('AllCategorySeller');
    }

    onFeaturedSeeAllClick(){
        this.props.navigation.navigate('FeaturedSeller');
    }

    onBestSellSeeAllClick(){
        this.props.navigation.navigate('BestSellSeller');
    }

    onProductClick(pid){
        this.props.navigation.navigate('ProductPageSeller',{productID:pid});
    }

    onCategoryClick(){
    }

    onApplyNowClick(){
        this.props.navigation.navigate('ApplyForJobSeeker');
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
            this.SellerHomeApiCall();
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
            this.SellerHomeApiCall();
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
        
        <View style={{height: hp('15%'),width:wp('100%'),}} >
        <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginHorizontal:wp('3%'),marginTop:hp('2%')}}>
            <View>        
                <TouchableOpacity  onPress={this.onDrawerClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/menu.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity  onPress={this.onFilterClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/filter_black.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
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

            <View style={styles.iconInputContainer}>
            <Image source={require('../../assets/icon/loupe_2.png')} style={{marginHorizontal:wp('3%'),height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.searchyourproduct}
                placeholderTextColor = "#0000008a"
                autoCapitalize = "none"
                onChangeText={(value) => this.setState({searchstring:value})}  />
            </View>

        </View>
        
        <View style={{height: hp('15%'),width:wp('100%'),}} >

        <View style={{marginHorizontal:wp('5%'),marginTop:hp('2%'),justifyContent:"space-between",flexDirection:'row',}}>
                <Text style={{color:'#000',fontSize:hp('2%'),fontWeight:"bold"}}>{this.state.renderLanguage.categories}</Text>
                <TouchableOpacity onPress={this.onCategoriesSeeAllClick} style={{}}>
                 <Text style={{color:'#0000008a',fontSize:hp('2%')}}>{this.state.renderLanguage.seeall}</Text>
                </TouchableOpacity>
        </View>

        <View style={{marginTop:hp('1.5%')}}>
            <FlatList
            horizontal={true}
            contentContainerStyle={{paddingLeft:10}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.categories}
            keyExtractor={item => item.value}
            renderItem={({ item }) => 
      
                <ImageBackground 
                source={{uri: `${item.image}`}} 
                style={{
                    borderRadius:hp('2%'),
                    marginHorizontal:wp('3%'),
                }} 
                imageStyle={{borderRadius:15,overflow:"hidden"}} 
                resizeMode='cover' >

                <TouchableOpacity  style={{
                    height:hp('10%'),
                    width:wp('40%'),       
                    borderRadius:hp('2%'),
                    paddingHorizontal:hp('2%'),
                    paddingVertical:hp('1%'),
                    alignItems:"center",
                    justifyContent:"center"}}>

                <Text style={{color:"#fff",fontSize:hp('1.5%'),fontWeight:"bold"}}>{item.name}</Text>

                </TouchableOpacity>
                </ImageBackground>
            }
            />
        </View>
        </View>

        <View style={{height: hp('35%'),width:wp('100%'),}} >
        <View style={{marginHorizontal:wp('5%'),marginTop:hp('3%'),justifyContent:"space-between",flexDirection:'row',}}>
                <Text style={{color:'#000',fontSize:hp('2%'),fontWeight:"bold"}}>{this.state.renderLanguage.featured}</Text>
                <TouchableOpacity onPress={this.onFeaturedSeeAllClick} style={{}}>
                <Text style={{color:'#0000008a',fontSize:hp('2%')}}>{this.state.renderLanguage.seeall}</Text>
                </TouchableOpacity>
        </View>

        <View style={{marginTop:hp('1%')}}>
            <FlatList
            horizontal={true}
            contentContainerStyle={{paddingRight:wp('5%')}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.renderProducts.feature}
            keyExtractor={item => item.value}
            renderItem={({ item }) => 
                        
                        <TouchableOpacity 
                        onPress={()=>{this.onProductClick(item.productid)}} 
                        style={{backgroundColor:'white',marginHorizontal:wp('5%'),padding:hp('1.3%'),borderRadius:hp('1%')}}>

                            <View style={{flexDirection:'row',elevation:9}}>
                            <Image
                                source={{uri: `${item.image}`}} 
                                style={{
                                    borderRadius:hp('2%'),
                                    height:hp('22%'),
                                    width:wp('35%'),
                                    backgroundColor:"white",
                                }} 
                                resizeMode='cover' />

                                {
                                    item.is_wish == 0 ?
                                    <TouchableOpacity 
                                    onPress={()=>{this.onSaveProductClick(item.productid)}} 
                                    activeOpacity={0.5}
                                    style= {{
                                            //Here is the trick
                                            position: 'absolute',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            width: hp('5%'),
                                            height: hp('5%'),
                                            borderRadius:hp('5%')/2,
                                            backgroundColor:"#4F45F0",
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            right: wp('0.5%'),
                                            top: hp('0.2%'),
                                        }}>
                                    <Image source={require('../../assets/icon/heart_1.png')} style={{height:hp('5%'),width:hp('5%')}} resizeMode='contain'></Image>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity 
                                    onPress={()=>{this.onUnsaveProductClick(item.productid)}} 
                                    activeOpacity={0.5}
                                    style= {{
                                            //Here is the trick
                                            position: 'absolute',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            width: hp('5%'),
                                            height: hp('5%'),
                                            borderRadius:hp('5%')/2,
                                            backgroundColor:"#4F45F0",
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            right: wp('0.5%'),
                                            top: hp('0.2%'),
                                        }}>
                                    <Image source={require('../../assets/icon/hart.png')} style={{height:hp('5%'),width:hp('5%')}} resizeMode='contain'></Image>
                                    </TouchableOpacity>
                                }
                            </View>

                            <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",marginTop:hp('0.5%')}}>

                                <View>
                                    <Text style={{fontSize:hp('1.5%'),color:"#4F45F0"}}>{item.payable_amount.length < 4? `₹${item.payable_amount}`: `₹${item.payable_amount.substring(0,4)}..`}</Text>
                                </View>

                                <View>
                                    <Text style={{fontSize:hp('1.5%'),color:"#000",textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>{item.price.length < 4? `₹${item.price}`: `₹${item.price.substring(0,4)}..`}</Text>
                                </View>

                                <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",backgroundColor:"#4F45F0",borderRadius:hp('2%')}}>
                                    <Image source={require('../../assets/icon/star_1.png')} style={{height:hp('1.3%'),width:hp('1.3%'),marginHorizontal:hp('0.5%'),marginVertical:hp('0.5%')}} resizeMode='contain'></Image>
                                    <Text style={{fontSize:hp('1.5%'),color:"#fff",paddingRight:wp('2%')}}>{item.rating.toFixed(1)}</Text>
                                </View>

                            </View>

                            <View>
                            <Text style={{fontSize:hp('1.5%')}} numberOfLines={1}>{item.product_name.length < 20? `${item.product_name}`: `${item.product_name.substring(0, 20)} ...`}</Text>
                            </View>

                        </TouchableOpacity>
                        }
                />
        </View>

        </View>

        <View style={{height: hp('35%'),width:wp('100%'),}} >
        <View style={{marginHorizontal:wp('5%'),justifyContent:"space-between",flexDirection:'row',}}>
                <Text style={{color:'#000',fontSize:hp('2%'),fontWeight:"bold"}}>{this.state.renderLanguage.bestsellers}</Text>
                <TouchableOpacity onPress={this.onBestSellSeeAllClick} style={{}}>
                <Text style={{color:'#0000008a',fontSize:hp('2%')}}>{this.state.renderLanguage.seeall}</Text>
                </TouchableOpacity>
        </View>

        <View style={{marginTop:hp('1%')}}>
            <FlatList
            horizontal={true}
            contentContainerStyle={{paddingRight:wp('5%')}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.renderProducts.best}
            keyExtractor={item => item.value}
            renderItem={({ item }) => 
                        
                        <TouchableOpacity 
                        onPress={()=>{this.onProductClick(item.productid)}} 
                        style={{backgroundColor:"white",marginHorizontal:wp('5%'),padding:hp('1.3%'),borderRadius:hp('1%')}}>

                            <View style={{flexDirection:'row',elevation:9}}>
                            <Image
                                source={{uri: `${item.image}`}} 
                                style={{
                                    borderRadius:hp('2%'),
                                    height:hp('22%'),
                                    width:wp('35%'),
                                    backgroundColor:"white",
                                }} 
                                resizeMode='cover' />

                                {
                                    item.is_wish == 0 ?
                                    <TouchableOpacity 
                                    onPress={()=>{this.onSaveProductClick(item.productid)}} 
                                    activeOpacity={0.5}
                                    style= {{
                                            //Here is the trick
                                            position: 'absolute',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            width: hp('5%'),
                                            height: hp('5%'),
                                            borderRadius:hp('5%')/2,
                                            backgroundColor:"#4F45F0",
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            right: wp('0.5%'),
                                            top: hp('0.2%'),
                                        }}>
                                    <Image source={require('../../assets/icon/heart_1.png')} style={{height:hp('5%'),width:hp('5%')}} resizeMode='contain'></Image>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity 
                                    onPress={()=>{this.onUnsaveProductClick(item.productid)}} 
                                    activeOpacity={0.5}
                                    style= {{
                                            //Here is the trick
                                            position: 'absolute',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            width: hp('5%'),
                                            height: hp('5%'),
                                            borderRadius:hp('5%')/2,
                                            backgroundColor:"#4F45F0",
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            right: wp('0.5%'),
                                            top: hp('0.2%'),
                                        }}>
                                    <Image source={require('../../assets/icon/hart.png')} style={{height:hp('5%'),width:hp('5%')}} resizeMode='contain'></Image>
                                    </TouchableOpacity>
                                }
                            </View>

                            <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",marginTop:hp('0.5%')}}>

                                <View>
                                    <Text style={{fontSize:hp('1.5%'),color:"#4F45F0"}}>{item.payable_amount.length < 4? `₹${item.payable_amount}`: `₹${item.payable_amount.substring(0,4)}..`}</Text>
                                </View>

                                <View>
                                    <Text style={{fontSize:hp('1.5%'),color:"#000",textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>{item.price.length < 4? `₹${item.price}`: `₹${item.price.substring(0,4)}..`}</Text>
                                </View>

                                <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",backgroundColor:"#4F45F0",borderRadius:hp('2%')}}>
                                    <Image source={require('../../assets/icon/star_1.png')} style={{height:hp('1.3%'),width:hp('1.3%'),marginHorizontal:hp('0.5%'),marginVertical:hp('0.5%')}} resizeMode='contain'></Image>
                                    <Text style={{fontSize:hp('1.5%'),color:"#fff",paddingRight:wp('2%')}}>{item.rating.toFixed(1)}</Text>
                                </View>

                            </View>

                            <View>
                            <Text style={{fontSize:hp('1.5%')}} numberOfLines={1}>{item.product_name.length < 20? `${item.product_name}`: `${item.product_name.substring(0, 20)} ...`}</Text>
                            </View>


                        </TouchableOpacity>
                        }
                />
        </View>
        </View>
        <Animated.View style={[styles.animatedView, {transform: [{translateY: this.springValue}]}]}>
                    <Text style={styles.exitTitleText}>{this.state.renderLanguage.backhandlerstatement}</Text>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => BackHandler.exitApp()}
                    >
                        <Text style={styles.exitText}>{this.state.renderLanguage.backhandlertitle}</Text>
                    </TouchableOpacity>

        </Animated.View>
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
    animatedView: {
        width:wp('100%'),
        backgroundColor: "#4F45F0",
        elevation: 2,
        position: "absolute",
        bottom:0,
        padding: hp('2%'),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    exitTitleText: {
        textAlign: "center",
        color: "#ffffff",
        fontSize:hp('1.8%'),
        marginRight: wp('3%'),
    },
    exitText: {
        color: "#e5933a",
        fontSize:hp('2%'),
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('0.5%')
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
        alignSelf:"center",
        marginTop:hp('2%'),
        height:hp('6%'),
        width:wp('90%'),
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