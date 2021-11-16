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
          searchstring:'',
          toggleSeachBarVisible:false,
          renderProducts:null,
          userdata:{},
          appLoading:false,
          appFetchingLoader:false,
          paginationNumber:0,
          isFetching: false,
          loadMoreResults:true,
          renderLanguage:MyLanguage.en

      };

      this.onBackClick = this.onBackClick.bind(this);
      this.onSearchClick = this.onSearchClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onProductClick = this.onProductClick.bind(this);
      this.onCategoryClick = this.onCategoryClick.bind(this);
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
            this.WishlistProductShowApiCall(this.state.paginationNumber);
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


    async WishlistProductShowApiCall(pageno){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        // myFormData.append("langid",this.state.userdata.lang_id)
        myFormData.append("page",pageno)
        try {
            const { data } = await SellerServices.SellerWishlistShow(myFormData)
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
                    var newLady = oldLady.concat(data.data);
                    this.setState({
                        renderProducts:newLady,
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
                        renderProducts:data.data,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:true
                    })
                }     
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
                this.WishlistProductShowApiCall(pageno);
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

    onSearchClick(){
        this.setState({toggleSeachBarVisible:!this.state.toggleSeachBarVisible})
    }

    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }

    onProductClick(){
        this.dropDownAlertRef.alertWithType('success', 'Saved !', "Product Clicked!",null,1500)
    }

    onCategoryClick(){
        this.props.navigation.navigate('ProfileSeeker');
    }

    onSaveProductClick(){
        this.dropDownAlertRef.alertWithType('success',this.state.renderLanguage.productsaved, "",null,1500)
    }

    onUnsaveProductClick(){
        this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.productunsaved, "",null,1500)
    }

    searchViewHandler = function(options) {
        if(this.state.toggleSeachBarVisible)
        {
            return {
                height:hp('15%'),
              }
        }else{
            return {
                height:hp('7%'),
              }
        }
      }

      productViewHandler = function(options) {
        if(this.state.toggleSeachBarVisible)
        {
            return {
                height:hp('85%'),
              }
        }else{
            return {
                height:hp('93%'),
              }
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
        
        <View style={this.searchViewHandler()} >
        <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginHorizontal:wp('3%'),marginTop:hp('2%')}}>
            <View>        
                <TouchableOpacity  onPress={this.onBackClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/shape.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity  onPress={this.onSearchClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/loupe_2.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.onNotificationClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/bell.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>

        {
            this.state.toggleSeachBarVisible ? 
            <View style={styles.iconInputContainer}>
            {
                    this.state.searchstring.length > 0 ? 
                    <TouchableOpacity  onPress={()=>{Keyboard.dismiss()}} >
                    <Image source={require('../../assets/icon/loupe_2.png')} style={styles.iconInputImage} resizeMode='contain'></Image>
                    </TouchableOpacity>
                    :
                    <View>
                    <Image source={require('../../assets/icon/loupe_2.png')} style={styles.iconInputImage} resizeMode='contain'></Image>
                    </View>
            }
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.searchproduct}
                placeholderTextColor = "#0000008a"
                autoCapitalize = "none"
                value={this.state.searchstring}
                onChangeText={(value) => this.setState({searchstring:value},()=>{this.updateSearch()})} />
            </View>
            :
            null
        }
        </View>
        
        <View style={this.productViewHandler()}>

        {this.state.renderProducts == null ? 
            
            this.state.appFetchingLoader == true ? 
            null 
            :
            <View style={{alignItems:"center",justifyContent:"center",flex:1}}>
                <Text style={{color:'#4F45F0',fontSize:hp('3%')}}>{this.state.renderLanguage.noproductfound}</Text>
            </View>

        :
        <View>
        <View style={{marginHorizontal:wp('5%'),flexDirection:'row',}}>
            <Text style={{color:'#000',fontSize:hp('2.5%'),fontWeight:"bold"}}>{this.state.renderLanguage.bestsellers}</Text>
        </View>

        <View style={{marginTop:hp('1%')}}>
            <FlatList
            numColumns={2}
            contentContainerStyle={{paddingBottom:hp('15%')}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            onEndReachedThreshold={0.2}
            onEndReached={info => {
              this.loadMoreResults(info);
            }}
            data={this.state.renderProducts}
            keyExtractor={item => item.value}
            renderItem={({ item }) => 
                        
                    <TouchableOpacity 
                        onPress={this.onProductClick} 
                        style={{backgroundColor:"transparent",marginHorizontal:wp('2%'),marginVertical:hp('2%')}}>

                            <View style={{flexDirection:'row',elevation:9 ,height:hp('30%'),width:wp('45%'), }}>
                            <Image
                            source={{uri: `${item.image}`}} 
                                style={{
                                    height:hp('30%'),
                                    width:wp('45%'),
                                    backgroundColor:"#ffffff",
                                }} 
                                resizeMode='cover' />
                                {
                                    item.is_wish == 0 ?
                                    <TouchableOpacity 
                                    onPress={this.onSaveProductClick} 
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
                                    onPress={this.onUnsaveProductClick} 
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

                            <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",paddingHorizontal:wp('1%'),width:wp('45%')}}>

                                <View>
                                    <Text style={{fontSize:hp('1.6%'),fontWeight:"bold",color:"#4F45F08a"}}>₹{item.payable_amount}</Text>
                                </View>

                                <View>
                                    <Text style={{fontSize:hp('1.6%'),color:"#000",textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>₹{item.price}</Text>
                                </View>

                                <View style={{flexDirection:"row",alignItems:'center',justifyContent:"center",backgroundColor:"#4F45F0",margin:hp('1%'),borderRadius:hp('2%')}}>
                                    <Icon5 name="star" color={'#fff'} size={hp('1.5%')} style={{padding:hp('0.7%')}}/>
                                    <Text style={{fontSize:hp('1.6%'),color:"#fff",paddingRight:wp('1%')}}>{item.rating}</Text>
                                </View>

                            </View>

                            <View>
                            <Text style={{fontSize:hp('1.6%'),paddingHorizontal:wp('1%'),width:wp('45%')}} numberOfLines={1}>{item.product_name.length < 18? `${item.product_name}`: `${item.product_name.substring(0, 18)} ...`}</Text>
                            </View>

                        </TouchableOpacity>
     
                        }
                />
        </View>
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
        marginHorizontal:wp('4%'),
        height:hp('4%'),
        width:hp('4%')
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