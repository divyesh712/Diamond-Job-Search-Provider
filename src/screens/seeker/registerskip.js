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
    Keyboard
  } from 'react-native';

  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';

  import DropDownPicker from 'react-native-dropdown-picker';
  import {Picker} from '@react-native-picker/picker';
  import { launchImageLibrary} from 'react-native-image-picker';
  import { CheckBox } from 'react-native-elements';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import SeekerServices from '../../api/seekerservices';
  import NetworkCheck from '../../utils/networkcheck';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          userdata:{},
          apicategories:null,
          apicolorcut:null,
          apishapecolor:null,
          langid:0,
          category:'',
          colorcut:'',
          shapecolor:'',
          checkbox1value1:false,
          checkbox1value2:false,
          checkbox2value1:false,
          checkbox2value2:false,
          savechecked2:false,
          appLoading:false,
      };

      this.onSubmitClick = this.onSubmitClick.bind(this);
      this.onSkipClick = this.onSkipClick.bind(this);
      this.onChooseImageClick = this.onChooseImageClick.bind(this);
      this.onSaveCheckBoxToggle11 = this.onSaveCheckBoxToggle11.bind(this);
      this.onSaveCheckBoxToggle12 = this.onSaveCheckBoxToggle12.bind(this);
      this.onSaveCheckBoxToggle21 = this.onSaveCheckBoxToggle21.bind(this);
      this.onSaveCheckBoxToggle22 = this.onSaveCheckBoxToggle22.bind(this);

    }

    componentDidMount(){
        this.getUserData();  
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            this.getCategory();
            this.getColorCut();
            this.getShapeColor();
        })
    }

    async getCategory(){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
        let myFormData = new FormData();
        myFormData.append("langid",this.state.userdata.lang_id)

          try {
            const { data } = await SeekerServices.SeekerHomeCategory(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    apicategories:null,
                    appFetchingLoader:false,
                    appLoading:false
                })
            }

            if( data.status == 1 ){

                let myUsers = data.data.map((myValue,myIndex)=>{
                    return(
                    <Picker.Item label={myValue.name} value={myValue.id} key={myIndex}/>
                    )
                    });

                this.setState({
                    apicategories:myUsers,
                    appFetchingLoader:false,
                    appLoading:false
                })
            }

          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', " Server Error : 500 ");
          }
        }
    }

    async getColorCut(){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
        let myFormData = new FormData();
        myFormData.append("langid",this.state.userdata.lang_id)

          try {
            const { data } = await SeekerServices.SeekerCUT(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    apicolorcut:null,
                    appFetchingLoader:false,
                    appLoading:false
                })
            }

            if( data.status == 1 ){

                let myUsers = data.data.map((myValue,myIndex)=>{
                    return(
                    <Picker.Item label={myValue.name} value={myValue.id} key={myIndex}/>
                    )
                    });

                this.setState({
                    apicolorcut:myUsers,
                    appFetchingLoader:false,
                    appLoading:false
                })
            }

          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', " Server Error : 500 ");
          }
        }
    }

    async getShapeColor(){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
        let myFormData = new FormData();
        myFormData.append("langid",this.state.userdata.lang_id)

          try {
            const { data } = await SeekerServices.SeekerCOLOR(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    apishapecolor:null,
                    appFetchingLoader:false,
                    appLoading:false
                })
            }

            if( data.status == 1 ){

                let myUsers = data.data.map((myValue,myIndex)=>{
                    return(
                    <Picker.Item label={myValue.name} value={myValue.id} key={myIndex}/>
                    )
                    });

                this.setState({
                    apishapecolor:myUsers,
                    appFetchingLoader:false,
                    appLoading:false
                })
            }

          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', " Server Error : 500 ");
          }
        }
    }

    onSkipClick(){
        this.props.navigation.replace('MainTabSeeker');
    }

    async onSubmitClick(){

        const isConnected = await NetworkCheck.isNetworkAvailable();

        if (isConnected) {  

            if(this.state.checkbox1value1 == false && this.state.checkbox1value2 == false){
                this.dropDownAlertRef.alertWithType('error',"select 3X or VG-Good");
              return
            }

            if(this.state.checkbox2value1 == false && this.state.checkbox2value2 == false){
                this.dropDownAlertRef.alertWithType('error',"select GIA or Non-GIA");
              return
            }

            this.setState({appLoading:true})

            let myFormData = new FormData();
            myFormData.append("_id",this.state.userdata._id)
            myFormData.append("langid",this.state.langid)
            myFormData.append("category",this.state.category)
            if(this.state.checkbox1value1 == true){myFormData.append("color_cut_value",0)}
            if(this.state.checkbox1value2 == true){myFormData.append("color_cut_value",1)}
            myFormData.append("shape_color",this.state.shapecolor)
            if(this.state.checkbox2value1 == true){myFormData.append("shape_color_value",0)}
            if(this.state.checkbox2value2 == true){myFormData.append("shape_color_value",1)}
           
    
              try {
                const { data } = await SeekerServices.SeekerHomeCategory(myFormData)
                console.log(data);
    
                if( data.status == 0 ){
                    this.dropDownAlertRef.alertWithType('error', "Something went wrong try again...");
                    this.setState({appLoading:false})
                }
    
                if( data.status == 1 ){
                    this.setState({appLoading:false})
                    this.props.navigation.replace('MainTabSeeker');
                }
    
              }
              catch(error){
                console.log(error)
                this.setState({appLoading: false})
                console.log(error.data)
                this.dropDownAlertRef.alertWithType('error', " Server Error : 500 ");
            }
            }

    }

    onChooseImageClick = () => {

            let options = {
              storageOptions: {
                skipBackup: true,
                path: 'images',
              },
            };
        
            launchImageLibrary(options, (res) => {
              console.log('Response = ', res);
        
              if (res.didCancel) {
                console.log('User cancelled image picker');
                this.setState({
                    imageOBJ: null
                  });
              } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
              } else {
                console.log('response', JSON.stringify(res));
                this.setState({
                  imageOBJ: res
                });
              }
            });
    }

    onSaveCheckBoxToggle11(){
        if(this.state.checkbox1value1 == false){this.setState({checkbox1value1:true,checkbox1value2:false})}
        if(this.state.checkbox1value1 == true){this.setState({checkbox1value1:false,checkbox1value2:true})}
    }

    onSaveCheckBoxToggle12(){
        if(this.state.checkbox1value2 == false){this.setState({checkbox1value1:false,checkbox1value2:true})}
        if(this.state.checkbox1value2 == true){this.setState({checkbox1value1:true,checkbox1value2:false})}
    }

    onSaveCheckBoxToggle21(){
        if(this.state.checkbox2value1 == false){this.setState({checkbox2value1:true,checkbox2value2:false})}
        if(this.state.checkbox2value1 == true){this.setState({checkbox2value1:false,checkbox2value2:true})}
    }

    onSaveCheckBoxToggle22(){
        if(this.state.checkbox2value2 == false){this.setState({checkbox2value1:false,checkbox2value2:true})}
        if(this.state.checkbox2value2 == true){this.setState({checkbox2value1:true,checkbox2value2:false})}
    }

    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <View style={{backgroundColor : '#fff',height:hp('10%'),width:wp('100%'),}}>

        <View style={{flexDirection:'row',alignItems:"center",justifyContent:'space-between'}}>

        <View style={{marginTop:hp('4%'),marginLeft:hp('2.5%')}}>
            <Text style={{color:'#4F45F0',fontSize:hp('2.5%')}}>What are you looking for ?</Text>
        </View>

        <View style={{alignSelf:'flex-end',flexDirection:'row',marginHorizontal:hp('1.5%'),marginTop:hp('4%')}}>
            <TouchableOpacity  onPress={this.onSkipClick} style={{marginHorizontal:hp('1.5%'),backgroundColor:"#C3BCFC",paddingHorizontal:hp('2%'),paddingVertical:hp('1.2%'),borderRadius:hp('1%')}}>
            <Text style={{color:'#4F45F0',fontSize:hp('2%')}}>Skip</Text>
            </TouchableOpacity>
        </View>

        </View>

        </View>
        
        <View style={{height:hp('90%'),width:wp('100%'),backgroundColor:"#fff"}}>
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >

            <View style={{marginHorizontal:hp('2.5%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2.2%')}}>Category</Text> 
            </View>
            <View style={styles.iconInputContainer}>
            <Image source={require('../../assets/icon/hand.png')} style={{height:hp('4%'),width:hp('4%'),marginLeft:hp('2.5%')}} resizeMode='contain'></Image>
            <Picker
                mode="dropdown"
                style = {styles.iconInputField}
                selectedValue={this.state.category}
                enabled={true}
                dropdownIconColor={'#4F45F0'}
                onValueChange={(category) => this.setState({category: category})}
            >
                {this.state.apicategories}
            </Picker>
            </View>

            <View style={{marginHorizontal:hp('2.5%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2.2%')}}>Color & Modify Cut</Text> 
            </View>
            <View style={styles.iconInputContainer}>
            <Image source={require('../../assets/icon/diamond.png')} style={{height:hp('4%'),width:hp('4%'),marginLeft:hp('2.5%')}} resizeMode='contain'></Image>
            <Picker
                mode="dropdown"
                style = {styles.iconInputField}
                selectedValue={this.state.colorcut}
                enabled={true}
                dropdownIconColor={'#4F45F0'}
                onValueChange={(c) => this.setState({colorcut:c})}
            >
                {this.state.apicolorcut}
            </Picker>
            </View>

            <View style={{flexDirection:'row', justifyContent:"space-between",marginTop:hp('2%'),marginLeft:wp('4%'),marginRight:wp('7%')}}>
            <View style={{alignItems:"center",justifyContent:"center" , backgroundColor:"#EDECFC",borderRadius:hp('1%')}}>
            <CheckBox
            title='3X'
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            uncheckedColor={'#C3BCFC'}
            checkedColor={'#4F45F0'}
            textStyle={{color:"black",fontWeight:"300",fontStyle:'normal',fontSize:hp('1.7%')}}
            checked={this.state.checkbox1value1}
            containerStyle={{backgroundColor:"transparent",borderWidth:0,paddingHorizontal:hp('4.2%'),alignItems:"center"}}
            onPress={this.onSaveCheckBoxToggle11} 
            />
            </View>

            <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"#EDECFC",borderRadius:hp('1%')}}>
            <CheckBox
            title='VG-Good'
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            uncheckedColor={'#C3BCFC'}
            checkedColor={'#4F45F0'}
            textStyle={{color:"black",fontWeight:"300",fontStyle:'normal',fontSize:hp('1.7%')}}
            checked={this.state.checkbox1value2}
            containerStyle={{backgroundColor:"transparent",borderWidth:0,alignItems:"center"}}
            onPress={this.onSaveCheckBoxToggle12} 
            />
            </View>
            </View>

            <View style={{marginHorizontal:hp('2.5%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2.2%')}}>Shape & Color</Text> 
            </View>
            <View style={styles.iconInputContainer}>
            <Image source={require('../../assets/icon/diamond.png')} style={{height:hp('4%'),width:hp('4%'),marginLeft:hp('2.5%')}} resizeMode='contain'></Image>
            <Picker
                mode="dropdown"
                style = {styles.iconInputField}
                selectedValue={this.state.shapecolor}
                enabled={true}
                dropdownIconColor={'#4F45F0'}
                onValueChange={(c) => this.setState({shapecolor:c})}
            >
                {this.state.apishapecolor}
            </Picker>
            </View>

            <View style={{flexDirection:'row', justifyContent:"space-between",marginTop:hp('2%'),marginLeft:wp('4%'),marginRight:wp('7%')}}>
            <View style={{alignItems:"center",justifyContent:"center" , backgroundColor:"#EDECFC",borderRadius:hp('1%'),}}>
            <CheckBox
            title='GIA'
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            uncheckedColor={'#C3BCFC'}
            checkedColor={'#4F45F0'}
            textStyle={{color:"black",fontWeight:"300",textAlign:"center",fontStyle:'normal',fontSize:hp('1.7%')}}
            checked={this.state.checkbox2value1}
            containerStyle={{backgroundColor:"transparent",borderWidth:0,marginHorizontal:hp('2.3%'),paddingHorizontal:hp('4%'),alignItems:"center"}}
            onPress={this.onSaveCheckBoxToggle21} 
            />
            </View>

            <View style={{alignItems:"center",justifyContent:"center",backgroundColor:"#EDECFC",borderRadius:hp('1%')}}>
            <CheckBox
            title='Non-GIA'
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            uncheckedColor={'#C3BCFC'}
            checkedColor={'#4F45F0'}
            textStyle={{color:"black",fontWeight:"300",fontStyle:'normal',fontSize:hp('1.7%')}}
            checked={this.state.checkbox2value2}
            containerStyle={{backgroundColor:"transparent",borderWidth:0,marginHorizontal:hp('2.2%'),alignItems:"center"}}
            onPress={this.onSaveCheckBoxToggle22} 
            />
            </View>
            </View>

            <View style={{marginHorizontal:hp('2.5%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2.2%')}}>Language</Text> 
            </View>
            <View style={styles.iconInputContainer}>
            <Image source={require('../../assets/icon/diamond.png')} style={{height:hp('4%'),width:hp('4%'),marginLeft:hp('2.5%')}} resizeMode='contain'></Image>
            <Picker
                mode="dropdown"
                style = {styles.iconInputField}
                selectedValue={this.state.langid}
                enabled={true}
                dropdownIconColor={'#4F45F0'}
                onValueChange={(c) => this.setState({langid:c})}
            >
                <Picker.Item label={'English'} value={0} key={1}/>
                <Picker.Item label={'हिंदी'} value={1} key={2}/>
                <Picker.Item label={'ગુજરાતી'} value={2} key={3}/>
            </Picker>
            </View>

            <TouchableOpacity onPress={this.onSubmitClick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity>
            </ImageBackground> 
            </View>
            <DropdownAlert inactiveStatusBarStyle="light-content" inactiveStatusBarBackgroundColor="#4F45F0" ref={ref => this.dropDownAlertRef = ref} />
            <AppLoader isAppLoading={this.state.appLoading}/>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    maincontainer:{
        height:hp('100%'),
        width:wp('100%'),
        backgroundColor:"#fff" 
    },
    item: {
        backgroundColor: '#4F45F02a',
        borderRadius:15,
        padding:15,
        marginHorizontal:hp('1.5%')
      },
      title: {
        fontSize: 18,
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
        flex: 1,
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
        fontSize:hp('2.2%')
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#EDECFC',
        marginLeft:hp('2.5%'),
        marginRight:20,
        marginTop:5,
        height:45,
        width:Dimensions.get('window').width-40,
        borderRadius:7,
    },
    iconInputField:{
        marginLeft:5,
        flex:1,
        color:"#000",
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
        height:hp('6%'),
        width:hp('45%'),
        borderRadius:hp('1.2%'),
        justifyContent:'center',
        alignItems:'center',
    },
    loginButtonText:{
        color:'white',
        fontSize:hp('2.2%')
    },
    socialButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#EDECFC',
        marginTop:hp('2.3'),
        marginHorizontal:hp('1%'),
        height:hp('7%'),
        width:wp('41%'),
        borderRadius:hp('1.2%'),
    },
    socialButtonText:{
        marginHorizontal:hp('1%'),
        flex:1,
        color:"#4F45F0"
    },
    socialButtonImage:{
        height:hp('3%'),
        width:hp('3%'),
        margin:hp('2%')
    },



})