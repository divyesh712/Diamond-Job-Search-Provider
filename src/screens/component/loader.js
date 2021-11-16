import React from 'react';
import LottieView from 'lottie-react-native';

export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
      };
    }

    componentDidMount(){}
 
    render () {
        const {isAppLoading} = this.props;
        if(isAppLoading){
            return (
                <LottieView source={require('../../assets/animation/diamond_loader.json')} autoPlay loop  style={{backgroundColor:"#0000006a"}}/>
            );
        }
        else{
            return null;
        }
    }
}
