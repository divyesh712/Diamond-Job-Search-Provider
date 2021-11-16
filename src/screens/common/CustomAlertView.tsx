import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
    Dimensions,
  } from 'react-native';

const CustomAlertView = ({title , showAlert, onChange,onCancel} : {title : string, showAlert :boolean ,onChange: (response :any) => void,onCancel: () => void}) => {
    const [alertVisible, setAlertVisible] = useState(false);
    const colorList = ['white', 'green', 'purple','blue'];
    const fontList = [16,18,20,24];
    const fontFamilyList = ["Foundation","AntDesign","Entypo","FiraSansCondensed-Bold"];
    const [background, setBackground] = useState('white');
    const [checkboxTrueTint ,setCheckboxTrueTint] = useState('white');
    const [checkboxFalseTint, setCheckboxFalseTint] = useState('white');
    const [textColor, setTextColor] = useState('white');
    const [fontSize, setFontSize] = useState(16);
    const [fontFamily, setFontFamily] = useState('Foundation');

    const { width } = Dimensions.get('window');
    const itemWidth = ((width* 0.8) - 34) / 4;
    const { height } = Dimensions.get('window');
    const itemHeight = (height / 21) - 1;

    const onOkPressed = () => {
        setAlertVisible(false)
        var response = {
            checkboxBackgroud : background,
            checkboxTrueTint : checkboxTrueTint,
            checkboxFalseTint : checkboxFalseTint,
            textColor : textColor,
            fontFamily : fontFamily,
            fontSize : fontSize
        }
        onChange(response)
    }

    useEffect(() =>{
        setAlertVisible(showAlert)
    },[showAlert])

    return(
        <View style = {styles.centeredView}>
            <Modal animationType="slide"
            transparent={true}
            visible={alertVisible}>
                <View style = {styles.centeredView}>
                    <View style = {styles.modalView}>
                        <Text style = {styles.modalText}> {title}</Text>
                        <View>
                        <Text style = {styles.listHeaderText}>Checkbox background</Text>
                        <View style={[styles.listBorder,{height: itemHeight,}]}>
                            <FlatList
                            horizontal={true}
                            data={colorList}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(index) => index}
                            renderItem={({ item }) => (
                                <TouchableWithoutFeedback
                                onPress={() => setBackground(item)}
                                >
                                <View
                                    style={{
                                    flex: 1,
                                    minWidth: itemWidth,
                                    maxWidth: itemWidth,
                                    }}
                                >
                                    {item === background && (
                                    <View style={styles.selectedView}>
                                        <Text style={styles.selectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                    {item != background && (
                                    <View style={styles.unselectedView}>
                                        <Text style={styles.unSelectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                </View>
                                </TouchableWithoutFeedback>
                            )}
                            />
                            
                        </View>
                        <Text style = {styles.listHeaderText}>Checkbox checked Color</Text>
                        <View style={[styles.listBorder,{height: itemHeight,}]}>
                            <FlatList
                            horizontal={true}
                            data={colorList}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(index) => index}
                            renderItem={({ item }) => (
                                <TouchableWithoutFeedback
                                onPress={() => setCheckboxTrueTint(item)}
                                >
                                <View
                                    style={{
                                    flex: 1,
                                    minWidth: itemWidth,
                                    maxWidth: itemWidth,
                                    }}
                                >
                                    {item === checkboxTrueTint && (
                                    <View style={styles.selectedView}>
                                        <Text style={styles.selectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                    {item != checkboxTrueTint && (
                                    <View style={styles.unselectedView}>
                                        <Text style={styles.unSelectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                </View>
                                </TouchableWithoutFeedback>
                            )}
                            />
                            
                        </View>
                        <Text style = {styles.listHeaderText}>Checkbox unchecked color</Text>
                        <View style={[styles.listBorder,{height: itemHeight,}]}>
                            <FlatList
                            horizontal={true}
                            data={colorList}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(index) => index}
                            renderItem={({ item }) => (
                                <TouchableWithoutFeedback
                                onPress={() => setCheckboxFalseTint(item)}
                                >
                                <View
                                    style={{
                                    flex: 1,
                                    minWidth: itemWidth,
                                    maxWidth: itemWidth,
                                    }}
                                >
                                    {item === checkboxFalseTint && (
                                    <View style={styles.selectedView}>
                                        <Text style={styles.selectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                    {item != checkboxFalseTint && (
                                    <View style={styles.unselectedView}>
                                        <Text style={styles.unSelectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                </View>
                                </TouchableWithoutFeedback>
                            )}
                            />
                            
                        </View>
                        <Text style = {styles.listHeaderText}>Text Color</Text>
                        <View style={[styles.listBorder,{height: itemHeight,}]}>
                            <FlatList
                            horizontal={true}
                            data={colorList}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(index) => index}
                            renderItem={({ item }) => (
                                <TouchableWithoutFeedback
                                onPress={() => setTextColor(item)}
                                >
                                <View
                                    style={{
                                    flex: 1,
                                    minWidth: itemWidth,
                                    maxWidth: itemWidth,
                                    }}
                                >
                                    {item === textColor && (
                                    <View style={styles.selectedView}>
                                        <Text style={styles.selectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                    {item != textColor && (
                                    <View style={styles.unselectedView}>
                                        <Text style={styles.unSelectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                </View>
                                </TouchableWithoutFeedback>
                            )}
                            />
                            
                        </View>
                        <Text style = {styles.listHeaderText}>Font Size</Text>
                        <View style={[styles.listBorder,{height: itemHeight,}]}>
                            <FlatList
                            horizontal={true}
                            data={fontList}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(key,index) => key + " " + index}
                            renderItem={({ item }) => (
                                <TouchableWithoutFeedback
                                onPress={() => setFontSize(item)}
                                >
                                <View
                                    style={{
                                    flex: 1,
                                    minWidth: itemWidth,
                                    maxWidth: itemWidth,
                                    }}
                                >
                                    {item === fontSize && (
                                    <View style={styles.selectedView}>
                                        <Text style={styles.selectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                    {item != fontSize && (
                                    <View style={styles.unselectedView}>
                                        <Text style={styles.unSelectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                </View>
                                </TouchableWithoutFeedback>
                            )}
                            />
                            
                        </View>
                        <Text style = {styles.listHeaderText}>Font Family</Text>
                        <View style={[styles.listBorder,{height: itemHeight*4}]}>
                            <FlatList
                            horizontal={false}
                            data={fontFamilyList}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(index) => index}
                            renderItem={({ item }) => (
                                <TouchableWithoutFeedback
                                onPress={() => setFontFamily(item)}
                                >
                                <View
                                    style={{
                                    flex: 1
                                    }}
                                >
                                    {item === fontFamily && (
                                    <View style={styles.selectedView}>
                                        <Text style={styles.selectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                    {item != fontFamily && (
                                    <View style={styles.unselectedView}>
                                        <Text style={styles.unSelectedHeaderText}>
                                        {item}
                                        </Text>
                                    </View>
                                    )}
                                </View>
                                </TouchableWithoutFeedback>
                            )}
                            />
                            
                        </View>
                        </View>
                        <View style={{ flexDirection: "row"}}>
                        <Text style={{fontWeight:'bold', padding : 8}}
                            onPress={() => {setAlertVisible(false); onCancel(); }}> Cancel </Text>
                        <Text style={{fontWeight:'bold', padding : 8}}
                            onPress={() => onOkPressed() }> OK </Text>
                         </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView : {
        justifyContent : 'center',
        alignItems : 'center',
        alignContent : 'center',
        backgroundColor : 'rgba(0, 0, 0, 0.6)',
        flex: 1
    },
    modalView : {
        width: '80%',
        margin: 8,
        backgroundColor: 'white',
        borderRadius : 8,
        padding : 8,
        alignItems: 'center',
        shadowColor : 'black',
        shadowOffset: {
            width: 0,
            height : 2
        },
        shadowOpacity : 0.25,
        shadowRadius : 3.85,
        elevation : 5
    },
    modalText : {
        textAlign :  'center',
        fontWeight : 'bold',
        fontSize : 24,
        shadowOffset: {
            width: 0,
            height : 2
        },
        shadowOpacity : 0.3,
        shadowRadius : 3.85,
        elevation : 5
    },
    listHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop:16,
        marginStart: 8
      },
      selectedView: {
        backgroundColor: 'lightskyblue',
        borderColor: 'white',
      },
      selectedHeaderText: {
        fontWeight: 'bold',
        color: 'white',
        padding: 8,
        alignSelf: 'center',
      },
      unSelectedHeaderText: {
          
        fontWeight: 'bold',
        color: 'black',
        padding: 8,
        alignSelf: 'center',
      },
      unselectedView: {
        backgroundColor: 'white',
      },
      listBorder:{
       borderColor: 'lightskyblue',
       borderWidth: 1,
       marginStart: 8,
       marginEnd: 8,
       }
})

export default CustomAlertView;