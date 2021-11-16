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
    ScrollView,
    StatusBar,
    Keyboard,
    Alert
  } from 'react-native';

  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/MaterialIcons';
  import debounce from 'lodash/debounce';

  import { launchImageLibrary,launchCamera} from 'react-native-image-picker';
  import ImagePicker from 'react-native-image-crop-picker';
  import {Picker} from '@react-native-picker/picker';
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
          userdata:{},
          totalpost:0,
          totalactive:0,
          firstname:'',
          lastname:'',
          email:'',
          mobile:'',
          address:'',
          city:'',
          state:'',
          cname:'',
          cdesc:'',
          cwebsite:'',
          cemail:'',
          number_of_emp:'',
          langid:'0',
          imageOBJ:null,
          apiimageObJ:null,
          adharOBJ:[{uri:null},{uri:null}],
          apiadharOBJ:null,
          panOBJ:{uri:null},
          apipanObJ:null,
          aadhar_status:null,
          pan_status:null,
          appLoading:false,
          appFetchingLoader:false,
          myCustomAlert:0,
          renderLanguage:MyLanguage.en
      };

      this.onSettingClick = this.onSettingClick.bind(this);
      this.onSaveProfileClick = this.onSaveProfileClick.bind(this);
      this.onLogoutCLick = this.onLogoutCLick.bind(this);
      this.onProfilePictureClick= debounce(this.onProfilePictureClick.bind(this), 200);
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
            this.ProviderProfileApiCall();
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

    async onLogoutCLick(){
        await AsyncStorage.removeItem('User').then(
            this.props.navigation.popToTop(),
            this.props.navigation.replace("LandingPage")
        )
    }

    async ProviderProfileApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("userid",this.state.userdata._id)

        try {
            const { data } = await ProviderServices.ProviderProfile(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1){
                this.setState({
                    totalpost:data.totalpost,
                    totalactive:data.totalactive,
                    firstname:data.data.firstname,
                    lastname:data.data.lastname,
                    email:data.data.email,
                    mobile:data.data.mobile_no,
                    address:data.data.address,
                    city:data.data.city,
                    state:data.data.state,
                    langid:data.data.lang_id,
                    cname:data.companay.company_name,
                    number_of_emp:data.companay.num_of_emp,
                    cdesc:data.companay.description,
                    cwebsite:data.companay.website,
                    cemail:data.companay.email,
                    imageOBJ:{uri:data.data.image},
                    apiimageObJ:{uri:data.data.image},
                    adharOBJ:[{uri:data.data.adhar_image_f},{uri:data.data.adhar_image_b}],
                    panOBJ:{uri:data.data.pan_image},
                    apipanObJ:{uri:data.data.pan_image},
                    apiadharOBJ:[{uri:data.data.adhar_image_f},{uri:data.data.adhar_image_b}],
                    aadhar_status:data.data.adhar_status,
                    pan_status:data.data.pan_status,
                })
                await AsyncStorage.setItem('User',JSON.stringify(data.data)).then(
                    this.trytorefresh()
                );
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

    trytorefresh(){
        if(this.state.myCustomAlert == 1){
            this.props.navigation.popToTop();
            this.props.navigation.replace("MainTabProvider");
        }
    }


    onSettingClick(){
        this.props.navigation.navigate('SettingProvider');
    }

    async onSaveProfileClick(){
        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        if(this.state.imageOBJ == null || this.state.imageOBJ.uri == null){
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.imageblank);
          return
        }


        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("firstname",this.state.firstname)
        myFormData.append("lastname",this.state.lastname)
        myFormData.append("email",this.state.email)
        myFormData.append("address",this.state.address)
        myFormData.append("city",this.state.city)
        myFormData.append("state",this.state.state)
        myFormData.append("company_name",this.state.cname)
        myFormData.append("num_of_emp",this.state.number_of_emp)
        myFormData.append("description",this.state.cdesc)
        myFormData.append("website",this.state.cwebsite)
        myFormData.append("emailc",this.state.cemail)
        myFormData.append("langid",this.state.langid)

        if(this.state.apiimageObJ.uri != this.state.imageOBJ.uri){
            myFormData.append("image", {
                name: "filedocument.png",
                uri: this.state.imageOBJ.uri,
                type: "*/*"
            })
        }

        if(this.state.apipanObJ.uri != this.state.panOBJ.uri){
            myFormData.append("pan_image", {
                name: "filedocument.png",
                uri: this.state.panOBJ.uri,
                type: "*/*"
            })
        }

        if(this.state.apiadharOBJ[0].uri != this.state.adharOBJ[0].uri){
            myFormData.append("adhar_image_f", {
                name: "filedocument.png",
                uri: this.state.adharOBJ[0].uri,
                type: "*/*"
            })

            myFormData.append("adhar_image_b", {
                name: "filedocument.png",
                uri: this.state.adharOBJ[1].uri,
                type: "*/*"
            })

        }

        try {
            this.setState({appLoading: true})
            const { data } = await ProviderServices.ProviderProfileUpdate(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appFetchingLoader:false,appLoading:false})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.somethingwentwrong);
            }

            if( data.status == 1){
                this.setState({appFetchingLoader:false,appLoading:false,myCustomAlert:1})
                this.dropDownAlertRef.alertWithType('success',this.state.renderLanguage.profilesaved);
                this.ProviderProfileApiCall();
            }

            this.setState({appLoading: false})
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

    onProfilePictureClick = () => {

        let options = {
            mediaType:"photo"
        };

        launchCamera(options, (res) => {
            console.log('Response = ', res);
      
            if (res.didCancel) {
              this.setState({
                  imageOBJ:this.state.apiimageObJ
                });
              console.log('User cancelled image picker');
            } else if (res.error) {
              console.log('ImagePicker Error: ', res.error);
            } else {
              console.log('response', JSON.stringify(res));
              this.setState({
                  imageOBJ:res
              });
            }
          });
    
    }

    onAadharCardClick = () => {

        ImagePicker.openPicker({
            multiple: true,
            mediaType :'photo',
            minFiles:2,
            maxFiles:2,
          }).then(images => {
              if(images.length < 2 ){
                this.setState({
                    aadharOBJ:this.state.apiadharOBJ
                  });
                Alert.alert(
                    this.state.renderLanguage.select2photos,
                    this.state.renderLanguage.aadharmustcontain2,
                    [
                      {text: this.state.renderLanguage.cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: this.state.renderLanguage.tryagain, onPress: () =>  this.onAadharCardClick()},
                    ],
                    {cancelable: false},
                  );
              }
              if(images.length > 2 ){
                this.setState({
                    aadharOBJ:this.state.apiadharOBJ
                  });
                Alert.alert(
                    this.state.renderLanguage.select2photos,
                    this.state.renderLanguage.aadharmustcontain2,
                    [
                      {text: this.state.renderLanguage.cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: this.state.renderLanguage.tryagain, onPress: () =>  this.onAadharCardClick()},
                    ],
                    {cancelable: false},
                  );
              }

              if(images.length == 2 ){
                this.setState({
                    adharOBJ:[{uri:images[0].path},{uri:images[1].path}]
                });
              }
            console.log(images);
          });

    }

    onPanCardClick = () => {

        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
    
        launchImageLibrary(options, (res) => {
          console.log('Response = ', res);
          if (res.didCancel) {
            this.setState({
                panOBJ:this.state.apipanObJ
              });
            console.log('User cancelled image picker');
          } else if (res.error) {
            console.log('ImagePicker Error: ', res.error);
          } else {
            const source = { uri: res.uri };
            console.log('response', JSON.stringify(res));
            this.setState({
                panOBJ:res
            });
          }
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
                <Text style={{color:'white',fontSize:hp('2.5%')}}>{this.state.renderLanguage.profile}</Text>
            </View>

            <View style={{alignSelf:'flex-end',flexDirection:'row',marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <TouchableOpacity  onPress={this.onSettingClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/settings_1.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>
        </View>
        
        <View style={{ height:hp('93%') , width:wp('100%') }}>
            <ScrollView style={{height:hp('93%') , width:wp('100%') }}
            contentContainerStyle={{paddingBottom:hp('10%')}}
            showsVerticalScrollIndicator={false}
            >

            <View style={{backgroundColor:"#4F45F0",}}>
            <View style={{alignSelf:"center",height: hp('10%'),}}>
            <TouchableOpacity  onPress={this.onProfilePictureClick} 
            style={{
                borderRadius: hp('20%')/2,
                width: hp('20%'),
                height: hp('20%'),
                backgroundColor:'#4F45F0',
                justifyContent: 'center',
                alignItems: 'center',
                }}
                activeOpacity={1}>  
                {
                    this.state.imageOBJ == null || this.state.imageOBJ.uri === ""  || this.state.imageOBJ.uri == null ?
                    <Image source={require('../../assets/image/dummy_avatar.png')} style={{borderWidth:hp('0.5%'),height:hp('20%'),width:hp('20%'),borderRadius:hp('20%')/2}} resizeMode='contain'></Image>
                    :
                    <Image source={{uri: `${this.state.imageOBJ.uri}`}} style={{height:hp('20%'),width:hp('20%'),borderRadius:hp('20%')/2}} />
                }   
            </TouchableOpacity>
            </View>
            </View>
            <TouchableOpacity  onPress={this.onProfilePictureClick} 
            style={{
                borderBottomLeftRadius: hp('10%')*2,
                borderBottomRightRadius: hp('10%')*2,
                width: hp('10%')*2,
                height: hp('10%'),
                alignSelf:"center"
                }}>
            </TouchableOpacity>

            <View style={{alignItems:'center',alignSelf:"center",flexDirection:"row",marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2.3%')}}>{this.state.firstname}</Text>
                {
                    this.state.pan_status == 2 && this.state.aadhar_status == 2 ?
                    <Icon8 name="verified" color={"#4F45F0"} size={hp('4%')} style={{bottom:5,left:2}} />
                    :null
                }                
            </View>


            <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',borderTopWidth:0.8,borderBottomWidth:0.8,marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <View style={{justifyContent:"center",alignItems:"center",margin:hp('2%')}}>
                        <Text>{this.state.renderLanguage.activepost}</Text>
                        <Text style={{backgroundColor:"#C3BCFC",marginTop:hp('1%'),height:hp('5%'),width:hp('5%'),borderRadius:hp('5%')/2,fontSize:hp('2%'),textAlign:"center",textAlignVertical:"center"}}>{this.state.totalactive}</Text>
                </View>

                <View style={{justifyContent:"center",alignItems:"center",margin:hp('2%')}}>
                        <Text>{this.state.renderLanguage.totalpost}</Text>
                        <Text style={{backgroundColor:"#C3BCFC",marginTop:hp('1%'),height:hp('5%'),width:hp('5%'),borderRadius:hp('5%')/2,fontSize:hp('2%'),textAlign:"center",textAlignVertical:"center"}}>{this.state.totalpost}</Text>
                </View>
            </View>
            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{color:"#fff",alignSelf:'flex-start',backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%'),fontSize:hp('2%')}}>{this.state.renderLanguage.personaldetails}</Text>
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.firstname}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.firstnameInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.lastnameInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.firstname}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.firstname}
                onChangeText={(c) => this.setState({firstname:c})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.lastname}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.lastnameInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.emailInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.lastname}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.lastname}
                onChangeText={(lastname) => this.setState({lastname})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.emailid}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.emailInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.addressInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.emailid}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={(email) => this.setState({email})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.mobilenumber}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.mobilenumber}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                keyboardType='phone-pad'
                editable={false}
                value={this.state.mobile}
                onChangeText={(mobile) => this.setState({mobile})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.address}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.addressInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.cityInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.address}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.address}
                onChangeText={(address) => this.setState({address})}  />
            </View>

            <View style={{marginTop:hp('2%'),marginHorizontal:hp('2%'),flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View style={{}}>
            <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.currentcity}</Text>
                <View style={{
                        flexDirection:'row',
                        alignItems:'center',
                        backgroundColor:'#EDECFC',
                        marginTop:hp('0.5%'),
                        height:hp('7%'),
                        width:wp('40%'),
                        borderRadius:hp('1.2%'),
                    }}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.cityInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.stateInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.currentcity}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.city}
                onChangeText={(city) => this.setState({city})}  />
            </View>
            </View>

            <View style={{}}>
            <Text style={{fontSize:hp('2%'),marginHorizontal:hp('2%')}}>{this.state.renderLanguage.state}</Text>
                <View style={{
                        flexDirection:'row',
                        alignItems:'center',
                        backgroundColor:'#EDECFC',
                        marginHorizontal:hp('1%'),
                        marginTop:hp('0.5%'),
                        height:hp('7%'),
                        width:wp('40%'),
                        borderRadius:hp('1.2%'),
                    }}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.stateInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.cnameInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.state}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.state}
                onChangeText={(state) => this.setState({state})}  />
            </View>
            </View>
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.language}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <Picker
                mode="dropdown"
                style = {styles.iconInputField}
                selectedValue={this.state.langid}
                enabled={true}
                dropdownIconColor={'#4F45F0'}
                onValueChange={(category) => this.setState({langid: category})}
            >
                <Picker.Item label={'English'} value={'0'} key={0}/>
                <Picker.Item label={'हिंदी'} value={'1'} key={1}/>
                <Picker.Item label={'ગુજરાતી'} value={'2'} key={2}/>
            </Picker>
            </View>

            <View style={{height:hp('0.5%'),borderBottomWidth:1,marginTop:hp('2.5%'),borderColor:"#0000003a"}}></View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%'),justifyContent:'space-between',flexDirection:'row'}}>
                <Text style={{color:"#fff",alignSelf:'flex-start',backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%'),fontSize:hp('2%')}}>{this.state.renderLanguage.companydetails}</Text>
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.name}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.cnameInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.cdescInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.companyname}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.cname}
                onChangeText={(cname) => this.setState({cname})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.description}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.cdescInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.numberempInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.companydescription}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.cdesc}
                onChangeText={(cdesc) => this.setState({cdesc})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.companystrength}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.numberempInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.cwebsiteInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.numberofemployees}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                keyboardType="number-pad"
                value={this.state.number_of_emp}
                onChangeText={(number_of_emp) => this.setState({number_of_emp})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.website}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.cwebsiteInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.cemailInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.companywebsite}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.cwebsite}
                onChangeText={(cwebsite) => this.setState({cwebsite})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.email}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.cemailInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { Keyboard.dismiss(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.emailid}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.cemail}
                onChangeText={(cemail) => this.setState({cemail})}  />
            </View>
            {
                this.state.pan_status==2 && this.state.aadhar_status==2 ? null :
                <View>
                                    <View style={{height:hp('0.5%'),borderBottomWidth:hp('0.1%'),marginTop:hp('3.5%'),borderColor:"#0000003a"}}></View>

                                    <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%'),justifyContent:'space-between',flexDirection:'row'}}>
                                        <Text style={{color:"#fff",alignSelf:'flex-start',backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%'),fontSize:hp('2%')}}>{this.state.renderLanguage.knowyourcustomer}</Text>
                                    </View>

                                    <Text style={{color:"#0000005a",marginTop:hp('0.2%'),marginHorizontal:hp('2%'),backgroundColor:"#EDECFC",borderWidth:hp('0.1%'),borderStyle:'dashed',padding:hp('1%'),borderRadius:hp('1%'),fontSize:hp('1.4%')}}>{this.state.renderLanguage.kycministatement}</Text>


                                    {
                                        this.state.aadhar_status == 0 && (this.state.adharOBJ[0].uri == null || this.state.adharOBJ[0].uri === '' )?
                                        <TouchableOpacity onPress={this.onAadharCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",marginVertical:hp('2%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        {/* style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}> */}
                                        <Icon4 name="address-card" color={"#4F45F0"} size={hp('4%')} />
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        </View>
                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.aadhar_status == 0 && this.state.adharOBJ[0].uri != null && this.state.adharOBJ[0].uri !== '' ?
                                        <>
                                        <TouchableOpacity onPress={this.onAadharCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Image style={{
                                                    width: hp('7%'),
                                                    height: hp('5.5%'),
                                                }}
                                                source={{uri: `${this.state.adharOBJ[0].uri}`}}/>  
                                        </View>
                                        <View style={{marginHorizontal:hp('1%'),marginVertical:hp('2%'),backgroundColor:"#fff",width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Image style={{
                                                    width: hp('7%'),
                                                    height: hp('5.5%'),
                                                }}
                                                source={{uri: `${this.state.adharOBJ[1].uri}`}}/>  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('8%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        </View>
                                        </TouchableOpacity>
                                        </>
                                        :null
                                    }

                                    {
                                        this.state.aadhar_status == 1 ?
                                        <View style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon4 name="clock" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.approvalpending}</Text>
                                        </View>

                                        </View>
                                        :null
                                    }

                                    {
                                        this.state.aadhar_status == 2 ?
                                        <View style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon8 name="verified" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.approved}</Text>
                                        </View>

                                        </View>
                                        :null
                                    }

                                    {
                                        this.state.aadhar_status == 3 && (this.state.adharOBJ[0].uri == null || this.state.adharOBJ[0].uri === '' )?
                                        <TouchableOpacity onPress={this.onAadharCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon8 name="do-not-disturb" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.rejected}</Text>
                                        </View>
                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.aadhar_status == 3 && this.state.adharOBJ[0].uri != null ?
                                        <TouchableOpacity onPress={this.onAadharCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Image style={{
                                                    width: hp('7%'),
                                                    height: hp('5.5%'),
                                                }}
                                                source={{uri: `${this.state.adharOBJ[0].uri}`}}/>  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.rejected}</Text>
                                        </View>

                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 0 && (this.state.panOBJ.uri == null || this.state.panOBJ.uri === '' )?
                                        <TouchableOpacity onPress={this.onPanCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon4 name="address-card" color={"#4F45F0"} size={hp('4%')} />
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        </View>
                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 0 && this.state.panOBJ.uri != null && this.state.panOBJ.uri !== '' ?
                                        <TouchableOpacity onPress={this.onPanCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Image style={{
                                                    width: hp('7%'),
                                                    height: hp('5.5%'),
                                                }}
                                                source={{uri: `${this.state.panOBJ.uri}`}}/>  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        </View>

                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 1 ?
                                        <View style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon4 name="clock" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.approvalpending}</Text>
                                        </View>

                                        </View>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 2 ?
                                        <View style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon8 name="verified" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.approved}</Text>
                                        </View>

                                        </View>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 3 && (this.state.panOBJ.uri == null || this.state.panOBJ.uri == 'null' )?
                                        <TouchableOpacity onPress={this.onPanCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon8 name="do-not-disturb" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.rejected}</Text>
                                        </View>
                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 3 && this.state.panOBJ.uri != null ?
                                        <TouchableOpacity onPress={this.onPanCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Image style={{
                                                    width: hp('7%'),
                                                    height: hp('5.5%'),
                                                }}
                                                source={{uri: `${this.state.panOBJ.uri}`}}/>  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.rejected}</Text>
                                        </View>

                                        </TouchableOpacity>
                                        :null
                                    }


                </View>
            }
 


            <TouchableOpacity onPress={this.onSaveProfileClick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.saveprofile}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onLogoutCLick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.logout}</Text>
            </TouchableOpacity>

            </ScrollView>
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
        marginTop:hp('2%'),
        marginRight:'10%',
        alignSelf:'flex-end'
    },
    pagesubheader:{
        marginTop:8,
        fontSize:hp('2%')
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#EDECFC',
        marginHorizontal:hp('2%'),
        marginTop:hp('0.5%'),
        height:hp('7%'),
        width:wp('90%'),
        borderRadius:hp('1.2%'),
    },
    iconInputContainerModal:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#EDECFC',
        alignSelf:"center",
        marginTop:hp('1%'),
        height:hp('6%'),
        width:wp('80%'),
        borderRadius:hp('1.2%'),
    },
    iconInputField:{
        marginLeft:hp('1%'),
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
        alignSelf:'center',
        marginTop:hp('6%'),
        height:hp('7%'),
        width:hp('45%'),
        borderRadius:hp('1.2%'),
        justifyContent:'center',
        alignItems:'center',
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
        marginHorizontal:10,
        height:hp('7%'),
        width:Dimensions.get('window').width/2-60,
        borderRadius:hp('1%'),
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