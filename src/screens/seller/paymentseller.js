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
  import CreditCardDisplay from 'react-native-credit-card-display';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/Fontisto';
  import { ScrollView } from 'react-native-gesture-handler';

export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        renderCards:[
            {   
                name:'Kashyap J Karkar',
                cvc:'123',
                expiration:'04/21',
                number:'4242424242424242',
                selected:false,
                id:1
            },
            {   
                name:'My Card 2',
                cvc:'793',
                expiration:'10/11',
                number:'5324264232669069',
                selected:true,
                id:2
            },
            {   
                name:'User 3',
                cvc:'321',
                expiration:'04/22',
                number:'377593672852950',
                selected:false,
                id:3
            },
            {   
                name:'Demo 4',
                cvc:'342',
                expiration:'04/19',
                number:'6011706318543689',
                selected:false,
                id:4
            },
        ],
        billing:{
            subtotal:160.00,
            discount:5,
            shipping:10.00,
            total:170
        },
        notificationcount:0,
        myCustomAlert:0,
        paginationNumber:0,
        userdata:{},
        appLoading:false,
        appFetchingLoader:false,
        isFetching: false,
        loadMoreResults:true,
      };

      this.onBackClick = this.onBackClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onChangeCardClick = this.onChangeCardClick.bind(this);
      this.onCardDeleteClick = this.onCardDeleteClick.bind(this);
      this.onCheckoutClick = this.onCheckoutClick.bind(this);
      this.onAddCardClick = this.onAddCardClick.bind(this);
      this.onEditCardClick = this.onEditCardClick.bind(this);
      this.deleteCard = this.deleteCard.bind(this);
    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            console.log(this.state.userdata)
            this.ShowCardsApiCall(this.state.paginationNumber);
        })
    }


    async ShowCardsApiCall(pageno){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("page",pageno)
        myFormData.append("status",1)

        try {
            const { data } = await SellerServices.SellerShowCard(myFormData)
            console.log(data);
            if(pageno>0){
                if( data.status == 0 ){
                    var oldLady=this.state.renderCards;
                    this.setState({
                        renderCards:oldLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:false,
                    })
                }
                if( data.status == 1 ){
                    var oldLady=this.state.renderCards;
                    var newLady = oldLady.concat(data.card);
                    this.setState({
                        renderCards:newLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
            }
            if(pageno==0){
                if( data.status == 0 ){
                    this.setState({
                        billing:{},
                        renderSimilarProduct:[],
                        renderCards:[],
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                    this.dropDownAlertRef.alertWithType('error', "API Status 0");
                }
                if( data.status == 1 )
                {
                     this.setState({
                            billing:data.total[0],
                            renderCards:data.card,
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
                this.dropDownAlertRef.alertWithType('error', 'Something went wrong ....','',null,1500)

            }
            if(this.state.myCustomAlert == 2){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', 'Product wishlisted','',null,1500)

            }
            if(this.state.myCustomAlert == 3){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', 'Product removed from wishlist','',null,1500)
            }
            if(this.state.myCustomAlert == 4){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', 'Product added to cart','',null,1500)
            }
            if(this.state.myCustomAlert == 5){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('info', 'Product already added in cart','',null,1500)
            }
            if(this.state.myCustomAlert == 5){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('error', 'Product adding to cart failed','',null,1500)
            }

          }
          catch(error){
            this.setState({appLoading:false})
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', " Server Error : 500 ");
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', 'No Internet Connection', "please check your device connection");
        }
    }

    loadMoreResults(info){
        if(this.state.loadMoreResults){
            var pageno = this.state.paginationNumber + 1;
            this.setState({paginationNumber:pageno},()=>{
                this.ShowCardsApiCall(pageno);
            })
        }
    }
    onRefresh() {
        this.setState({isFetching: true,paginationNumber:0,
            billing:{},
            categories:null},() => {            
        this.getUserData();});
    }

    onBackClick(){
        this.props.navigation.goBack();
    }

    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }

    onChangeCardClick(index){
        var addressArray = this.state.renderCards;
        var clickedAddress = addressArray[index];

        addressArray.forEach(function (item, i) {
            addressArray[i].selected = false;
        });

        if(clickedAddress.selected == false)
        {
            addressArray[index].selected = true;
            this.setState({renderCards:addressArray})
        }
    }

    onCardDeleteClick(){
        Alert.alert(
            'Delete Card',
            'want to delete this card ?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Yes', onPress: () =>  this.deleteCard()},
            ],
            {cancelable: false},
          );
    }

    onCheckoutClick(){        
        this.props.navigation.navigate('CheckoutSeller');
    }

    onAddCardClick(){
        this.props.navigation.navigate('CreateCardSeller',{edit:false,item:{}});
    }

    onEditCardClick(cardOBJ){
        this.props.navigation.navigate('CreateCardSeller',{edit:false,item:cardOBJ});
    }

    deleteCard(){
        this.dropDownAlertRef.alertWithType('error', 'Card Deleted !','',null,1500)
    }
 
    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <DropdownAlert inactiveStatusBarStyle="light-content" inactiveStatusBarBackgroundColor="#4F45F0" ref={ref => this.dropDownAlertRef = ref} />
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
                <Text style={{color:'#000',fontSize:hp('2.5%'),fontWeight:"bold"}}>Payment</Text>
        </View>

        <View style={{marginTop:hp('2%')}}>
            <FlatList
            horizontal={true}
            contentContainerStyle={{}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isFetching}
            onEndReachedThreshold={0.2}
            onEndReached={info => {
              this.loadMoreResults(info);
            }}
            data={this.state.renderCards}
            keyExtractor={item => item.value}
            renderItem={({ item , index}) => 
                        
                        <View style={{marginHorizontal:wp('5%')}}>
                        <CreditCardDisplay
                            number={item.card_number}
                            cvc={item.expiry_data}
                            expiration={item.expiration}
                            name={item.card_name}
                        />

                        {
                                    item.is_default == '1' ? 
                                    <View style={{flexDirection:"row",justifyContent:"center"}}>
                                    <View style={{top:0,right:wp('3%'),position:'absolute',marginTop:hp('2%'),padding:hp('1%'),backgroundColor:"#4F45F0",borderRadius:hp('1%'),alignItems:'center'}}>
                                        <Icon6 name="ios-checkmark-done-circle-sharp" color={'#fff'} size={hp('3%')} />
                                    </View>
                                    <TouchableOpacity 
                                    onPress={()=>{this.onEditCardClick(item)}}
                                    style={{padding:hp('1%'),backgroundColor:"#4F45F0",borderRadius:hp('1%'),margin:hp('1%'),alignSelf:"center",alignItems:"center",marginRight:wp('5%')}}>
                                        <View style= {{}}>
                                        <Icon4 name="edit" color={'#fff'} size={hp('3%')} />
                                        </View>
                                    </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={{flexDirection:"row",justifyContent:"center"}}>
                                    <TouchableOpacity 
                                    onPress={()=>{this.onEditCardClick(item)}}
                                    style={{padding:hp('1%'),backgroundColor:"#4F45F0",borderRadius:hp('1%'),margin:hp('1%'),alignSelf:"center",alignItems:"center",marginRight:wp('5%')}}>
                                        <View style= {{}}>
                                        <Icon4 name="edit" color={'#fff'} size={hp('3%')} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                    onPress={()=>{this.onChangeCardClick(index)}}
                                    style={{padding:hp('1%'),backgroundColor:"#4F45F0",borderRadius:hp('1%'),margin:hp('1%'),alignSelf:"center",alignItems:"center",marginRight:wp('5%')}}>
                                        <View style= {{}}>
                                        <Icon6 name="md-arrow-redo-circle-sharp" color={'#fff'} size={hp('3%')} />
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                    onPress={()=>{this.onCardDeleteClick(index)}}
                                    style={{padding:hp('1%'),backgroundColor:"#4F45F0",borderRadius:hp('1%'),margin:hp('1%'),alignSelf:"center",alignItems:"center",marginLeft:wp('5%')}}>
                                        <View style= {{}}>
                                        <Icon6 name="ios-trash-outline" color={'#fff'} size={hp('3%')} />
                                        </View>
                                    </TouchableOpacity>

                                    </View>
                                }
                        </View>
                        }
                />
        </View>

        <View style={{marginHorizontal:wp('6%'),marginTop:hp('5%')}}>
                <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:hp('2%')}}>
                <Text style={{color:'#0000008a',fontSize:hp('2.5%')}}>Subtotal</Text>
                <Text style={{color:'#000',fontSize:hp('2.5%')}}>₹{this.state.billing.subtotal}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:hp('2%')}}>
                <Text style={{color:'#0000008a',fontSize:hp('2.5%')}}>Discount</Text>
                <Text style={{color:'#000',fontSize:hp('2.5%')}}>{this.state.billing.discount}%</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:hp('2%')}}>
                <Text style={{color:'#0000008a',fontSize:hp('2.5%')}}>Shipping</Text>
                <Text style={{color:'#000',fontSize:hp('2.5%')}}>₹{this.state.billing.shiping}</Text>
                </View>
                <View style={{borderTopWidth:hp('0.2%'),marginTop:hp('1')}}></View>
                <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:hp('1.5%')}}>
                <Text style={{color:'#0000008a',fontSize:hp('2.5%')}}>Total</Text>
                <Text style={{color:'#000',fontSize:hp('2.5%')}}>₹{this.state.billing.total}</Text>
                </View>
        </View>

        <TouchableOpacity 
        onPress={this.onAddCardClick}  
        activeOpacity={0.9} 
        style={{
            position:"absolute",
            flexDirection:'row',
            alignItems:'center',
            backgroundColor:'#fafafa',
            bottom:hp('8.5%'),
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
                <Text style={{color:'#4F45F0',fontSize:hp('2.3%')}}>Add Card</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={this.onCheckoutClick} 
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
                <Text style={styles.loginButtonText}>Checkout</Text>
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
        fontSize:15
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
        marginHorizontal:20,
        bottom:65,
        height:45,
        width:Dimensions.get('window').width-60,
        borderRadius:7,
        borderWidth:1.2,
        borderStyle:'dashed',
        borderColor:"#4F45F0",
        justifyContent:'center',
        alignSelf:'center'
    },
    loginButtonContainer:{
        position:"absolute",
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F0',
        marginHorizontal:20,
        bottom:10,
        height:45,
        width:Dimensions.get('window').width-60,
        borderRadius:7,
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