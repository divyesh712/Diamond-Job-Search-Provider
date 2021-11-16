import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    Image,
    Dimensions, 
    TouchableOpacity,
    StatusBar,
    Alert,
    Keyboard,    
    BackHandler,
    Animated
  } from 'react-native';
  let {width, height} = Dimensions.get('window');
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/SimpleLineIcons';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        selectedButtonIndex:0
      };

      this.onSeekerClick = this.onSeekerClick.bind(this);
      this.onProviderClick = this.onProviderClick.bind(this);
      this.onSellerClick = this.onSellerClick.bind(this);
      this.springValue = new Animated.Value(100) ;
      this.handleBackButton = this.handleBackButton.bind(this);
    }

    componentDidMount(){
        var that = this;
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
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

    onSeekerClick(){
        this.setState({selectedButtonIndex:1})
        this.props.navigation.navigate('LoginSeeker');
        // this.props.navigation.navigate('PaytmTest');

    }

    onProviderClick(){
        this.setState({selectedButtonIndex:2})
        this.props.navigation.navigate('LoginProvider');
    }

    onSellerClick(){
        this.setState({selectedButtonIndex:3})
        this.props.navigation.navigate('LoginSeller');
    }

    handleBackButton = () => {         
        this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
        return true;
    };
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

    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
        <View style={styles.subcontainer1}>
            <Text style={styles.pageheader}>Welcome To DI'mand Jobs</Text>
            <Text style={styles.pagesubheader}>you can now find the job that suits you</Text>
        </View>
        <View style={styles.subcontainer2}>
        <Image source={require('../../assets/icon/main.png')} style={{height:hp('80%'),width:wp('80%')}} resizeMode='contain'></Image>
        </View>
        <View style={styles.subcontainer3}>
            <Text style={[styles.pagesubheader,{marginLeft:hp('7%')}]}>Select Your Role</Text>

            <View style={{marginLeft:hp('7%'),marginRight:hp('7%'),marginTop:hp('1.5%')}}>
                <TouchableOpacity onPress={this.onSeekerClick} style={{backgroundColor:this.state.selectedButtonIndex == 1 ? '#4F45F0' : '#EDECFC',borderRadius:hp('2%')}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        {
                            this.state.selectedButtonIndex == 1 ?
                            <Image source={require('../../assets/icon/landing_search_white.png')} style={{height:hp('5%'),width:hp('5%'),marginLeft:hp('2.5%')}} resizeMode='contain'></Image>
                            :
                            <Image source={require('../../assets/icon/landing_search_blue.png')} style={{height:hp('5%'),width:hp('5%'),marginLeft:hp('2.5%')}} resizeMode='contain'></Image>

                        }
                    <Text style={{color:this.state.selectedButtonIndex == 1 ? 'white' : 'black',marginLeft:hp('1.4%'),padding:hp('2.5%'),fontSize:hp('2.2%')}}>Job Seeker</Text>
                    </View>  
                </TouchableOpacity>
            </View>

            <View style={{marginLeft:hp('7%'),marginRight:hp('7%'),marginTop:hp('1.5%')}}>
                <TouchableOpacity onPress={this.onProviderClick} style={{backgroundColor:this.state.selectedButtonIndex == 2 ? '#4F45F0' : '#EDECFC',borderRadius:hp('2%')}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                    {
                            this.state.selectedButtonIndex == 2 ?
                            <Image source={require('../../assets/icon/portfolio_2.png')} style={{height:hp('4%'),width:hp('4%'),marginLeft:hp('2.5%')}} resizeMode='contain'></Image>
                            :
                            <Image source={require('../../assets/icon/portfolio.png')} style={{height:hp('4%'),width:hp('4%'),marginLeft:hp('2.5%')}} resizeMode='contain'></Image>
                    }
                   
                    {/* <Icon3 style={{marginLeft:hp('3%')}} name="diamond" color={this.state.selectedButtonIndex == 2 ? '#fff' : '#4F45F0'} size={hp('4%')} /> */}
                    <Text style={{color:this.state.selectedButtonIndex == 2 ? 'white' : 'black',marginLeft:hp('2%'),padding:hp('2.5%'),fontSize:hp('2.2%')}}>Job Provider</Text>
                    </View>  
                </TouchableOpacity>
            </View>

            <View style={{marginLeft:hp('7%'),marginRight:hp('7%'),marginTop:hp('1.5%')}}>
                <TouchableOpacity  onPress={this.onSellerClick} style={{backgroundColor:this.state.selectedButtonIndex == 3 ? '#4F45F0' : '#EDECFC',borderRadius:hp('2%')}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                    {
                            this.state.selectedButtonIndex == 3 ?
                            <Image source={require('../../assets/icon/store_1.png')} style={{height:hp('4%'),width:hp('4%'),marginLeft:hp('2.5%')}} resizeMode='contain'></Image>
                            :
                            <Image source={require('../../assets/icon/store.png')} style={{height:hp('4%'),width:hp('4%'),marginLeft:hp('2.5%')}} resizeMode='contain'></Image>
                    }
                    {/* <Icon4 style={{marginLeft:hp('3%')}} name="store" color={this.state.selectedButtonIndex == 3 ? '#fff' : '#4F45F0'} size={hp('4%')} /> */}
                    <Text style={{color:this.state.selectedButtonIndex == 3 ? 'white' : 'black',marginLeft:hp('2%'),padding:hp('2.5%'),fontSize:hp('2.2%')}}>Job Seller</Text>
                    </View>  
                </TouchableOpacity>
            </View>

        </View>
        <Animated.View style={[styles.animatedView, {transform: [{translateY: this.springValue}]}]}>
                    <Text style={styles.exitTitleText}>press back again to exit the app</Text>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => BackHandler.exitApp()}
                    >
                        <Text style={styles.exitText}>Exit</Text>
                    </TouchableOpacity>

        </Animated.View>
        </ImageBackground> 
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
    subcontainer1:{
        height:hp('20%'),
        alignItems:'center',
        justifyContent:'center'
    },
    subcontainer2:{
        height:hp('40%'),
        alignItems:'center',
        justifyContent:'center'
    },
    subcontainer3:{
        height:hp('40%'),
    },
    backgroundImage: {
        height: hp('100%'),
        width:wp('100%')
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
    pageheader:{
        fontSize:hp('3%')
    },
    pagesubheader:{
        marginTop:8,
        fontSize:hp('2%')
    }
})