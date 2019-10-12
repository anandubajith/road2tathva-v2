import React, { Component } from 'react';
import { 
        StyleSheet,
        Text,
        TextInput,
        Button,
        TouchableOpacity,
        ImageBackground,
        View,
        Image,
        Alert,
        AsyncStorage
       } from 'react-native';
import ImageSlider from 'react-native-image-slider';
import * as Font from 'expo-font';
import CountDown from 'react-native-countdown-component';


import bgfirst from './assets/bgfirst.jpeg';
import passcode_bg from './assets/passcode_bg.jpeg';
import round2bg from './assets/round2bg.jpeg';
import omkv from './assets/omkv.jpeg';
import karma from './assets/karma.jpeg';
import contact_image from './assets/final_contact.png';
// ROUND 1
import question_image_albatross from './assets/question_image_albatross.jpg';
import albatross from './assets/posters/albatross.jpg'; 
import motoart from './assets/posters/motoart.jpg';
import qprespective from './assets/qprespective.jpeg';
import perspective from './assets/posters/perspective.jpg';
import qtux from './assets/qtux.jpeg';
import tuxofwar from './assets/posters/tuxofwar.jpg';
import srishti from './assets/posters/srishti.jpg';
import youngengineer from './assets/posters/youngengineer.jpeg';
// ROUND 2
import rajpath from './assets/posters/rajpath.jpg';
import bbcourt from './assets/posters/bbcourt.jpeg';
import oat from './assets/posters/oat.jpeg';
import abc from './assets/posters/abc.jpeg';
import audi from './assets/posters/audi.png';
import cc from './assets/posters/cc.jpeg';
import cz from './assets/posters/cz.jpeg';
import atmcircle from './assets/posters/atmcircle.jpg'
import pits from './assets/posters/pits.png';

// TODO: app size maybe

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input:'',
            correct: false,
            timer: 0,
            wrongAnswerCount: 0
        }
        this.answered = this.answered.bind(this);
        this.progress = this.progress.bind(this);
    }
    async componentDidMount() {
        // read timer and set it
        let storedTimer = await AsyncStorage.getItem("timer");
        // console.log("Has timer: ", storedTimer);
        let timer = storedTimer ? parseInt(storedTimer, 10) : 0;
        this.setState({
            timer
        })

    }
    async answered(answer) {
        if ( answer.toLowerCase() == this.props.answer ) {
            this.setState({correct:true,timer:0});
            await AsyncStorage.setItem("timer", '0');
        } else { 
            if ( this.state.wrongAnswerCount > 1 ) {
                this.setState({timer:90});
                await AsyncStorage.setItem("timer", '90');
            } else {
                Alert.alert("Wrong Answer");
                let wrongAnswerCount = this.state.wrongAnswerCount+1;
                this.setState({
                    wrongAnswerCount
                })
            }
        }   
    }
    progress() {
        this.setState({correct:false, input:''})
        this.props.progress(this.props.id, this.props.passcode);
    }
    async clearTimer() {
        this.setState({timer:0});
        await AsyncStorage.setItem("timer", '0');
    }
    render() {
        if ( !this.state.correct) {
            return (
                <View style = { styles.container } >
                    {
                        this.props.qimg && 
                        <Image source={this.props.qimg}
                               style={{ width: 400, height: 250 }}
                        />
                    }
                    <Text style={[styles.questionText, this.state.timer > 0 ? {marginBottom:20}: {} ]}>
                        { this.props.text }
                    </Text> 
                     {
                        this.state.timer > 0 && 
                        <CountDown
                             until={this.state.timer}
                             onFinish={() => this.clearTimer()}
                             timeToShow={['M', 'S']}
                             timeLabels={{m: 'MM', s: 'SS'}}
                             size={20}
                           />
                     }
                    <TextInput
                        style={styles.answerInput}
                        placeholder="Enter your answer"
                        editable={!(this.state.timer > 0)}
                        onChangeText={(input) => this.setState({input})}
                        value={this.state.input}
                    />
                    <Button
                      title="Submit"
                      disabled={this.state.timer > 0}
                      style={styles.submitButton}
                      onPress={() => this.answered(this.state.input)}
                    />
                </View>
            );
        } else {
            return (
                <View style= { styles.container }>
                    <Image source={this.props.image}
                           resizeMode={'contain'}
                           style={{ width: '100%', height: '80%' }}
                    />
                    <Button
                      title="Next Question"
                      style={styles.submitButton}
                      onPress={() => this.progress()}
                    />
                </View>
            );
        }
    }
}


export default class App extends Component {
    constructor(props) {
        super(props);
        this.progress = this.progress.bind(this);
        this.checkPasscode = this.checkPasscode.bind(this);
        this.goToQ = this.goToQ.bind(this);
        this.checkProgressCode = this.checkProgressCode.bind(this);
        this.state = {
            questions: [
                {
                    text: "",
                    answer: "albatross",
                    passcode: '',
                    qimg: question_image_albatross,
                    image: albatross
                },
                {
                    text: "Moves when a moment is applied by torque",
                    answer: "motoart",
                    passcode:'',
                    image: motoart
                },
                {
                    text: "Blue marble",
                    answer: "srishti",
                    passcode: '',
                    image: srishti
                },
                {
                    text: "It's how you look",
                    qimg: qprespective,
                    answer: "perspective",
                    passcode: '',
                    image: perspective
                },
                {
                    text: "A cheap satin may kick you out of the race",
                    qimg:qtux,
                    answer: "tuxofwar",
                    passcode: '',
                    image: tuxofwar
                },
                {
                    text: "Age is not a barrier for ideas",
                    answer: "youngengineer",
                    passcode: '',
                    image: youngengineer
                },
                {
                    text: "Pic of any unnoticed writings on walls will be shown",
                    answer:"creativezone",
                    passcode: 'yes',
                    image: cz
                },
                {
                    text:'28.6x15.2',
                    answer:'basketballcourt',
                    passcode:'yes',
                    image: bbcourt
                },
                {
                    text: '1000001\n1000010\n1000011',
                    answer:'abc',
                    passcode:'yes',
                    image: abc
                },
                {
                    text:'Dungeons of NIT-C',
                    answer:'elhcpits',
                    passcode:'yes',
                    image: pits,
                },
                {
                    text: 'The olympians once went out in search of money. On the way they met four others.But they came back empty handed',
                    answer: 'centrecircle',
                    passcode:'yes',
                    image: cc
                },
                {
                    text:'####',
                    answer:'atmcircle',
                    passcode:'yes',
                    image:atmcircle
                },
                {
                    text:'Since 1910',
                    answer:'audi',
                    passcode:'yes',
                    image:audi
                },
                {
                    text:'My mom thinks eating this can reduce her cholestrol, But she dislike \'S\' and keeps it out of plate',
                    answer:'oat',
                    passcode: 'yes',
                    image: oat
                },
                {
                    text:'NRMGLMVGGV',
                    answer: 'rajpath',
                    passcode: 'yes',
                    image: rajpath
                }
            ],
            answered: [],
            progressCode:'',
            currentQuestion: -2,
        }   

    }
    async componentDidMount() {
        let storedValue = await AsyncStorage.getItem("answered");
        let storedCurrentQuestion = await AsyncStorage.getItem("currentQuestion");
        console.log("Fetched data: ",storedValue,  storedCurrentQuestion);
        let answered = storedValue ? JSON.parse(storedValue) : [];
        let currentQuestion = storedCurrentQuestion ? parseInt(storedCurrentQuestion, 10) : -2;
        this.setState({
          answered,
          currentQuestion
        });
        await Font.loadAsync({
          'headliner': require('./assets/fonts/headliner.ttf'),
        });
        this.setState({ fontLoaded: true });
      } 
    async progress(q_id, passcode){
        let answered = this.state.answered;
        answered.push(q_id);
        await AsyncStorage.setItem("answered",JSON.stringify(answered));
        if ( passcode === '' ) {
            this.setState({
                currentQuestion: -1,
                answered
            });
            await AsyncStorage.setItem("currentQuestion", '-1');
        } else {
            this.setState({
                currentQuestion: -3,
                answered
            });
            await AsyncStorage.setItem("currentQuestion", '-3');
        }
    }
    async checkPasscode(){
        if ( this.state.passcode === "powlitathva") {
            this.setState({currentQuestion:-1}); 
            await AsyncStorage.setItem("currentQuestion", '-1');   
        }
    }
    async goToQ(q){
        if ( this.state.answered.includes(q) )
            return;
        this.setState({currentQuestion:q});
        await AsyncStorage.setItem("currentQuestion", q.toString());
    }
    async checkProgressCode() {
        let code = '';
        code += this.state.answered.length;
        code += this.state.answered.length-1;
        code += (this.state.answered.length%2)? '0': '1';
        if ( this.state.progressCode == code ) {
            this.setState({currentQuestion:-1,progressCode:''}); 
            await AsyncStorage.setItem("currentQuestion", '-1');   
        }
    }
    render() {
        if ( this.state.answered.length >= 14) {
            return (
                <View style= { styles.welcome }>
                    <ImageSlider images={[
                        karma,
                        contact_image,
                      ]}/>
                </View>
            );
        }

        let buttons = [],start, end;
        if ( this.state.answered.length >= 5) {
            start = 6;
            end = this.state.questions.length
        } else {
            start = 0;
            end = 6;
        }
        for (let i = start; i < end; i++) {
            let j  = i;
            buttons.push(
                <TouchableOpacity  onPress={() => this.goToQ(i) } key={j} underlayColor="white">
                  <View style={[styles.button, this.state.answered.includes(i) ? styles.buttonDisabled : styles.buttonActive]}>
                    <Text style={styles.buttonText}>{(j+1).toString()}</Text>
                  </View>
                  </TouchableOpacity>
            );
        }
       
        if ( this.state.currentQuestion == -3) {
            return (
                <ImageBackground source={passcode_bg} style={styles.welcomeBG}>
                    <TextInput
                        style={styles.passCodeInput}
                        secureTextEntry={true}
                        placeholder={"Passcode "+this.state.answered.length}
                        keyboardType="numeric"
                        onChangeText={(progressCode) => this.setState({progressCode})}
                        value={this.state.progressCode}
                    />
                    <Button
                      title="Submit"
                      onPress={() => this.checkProgressCode()}
                    />
                </ImageBackground>
            );
        } else if ( this.state.currentQuestion == -2) {
            return (
                <View style={styles.welcome}>
                    { 
                    this.state.fontLoaded ?
                        (
                            <Text style = {styles.introHeader}>
                                Adventure Club NITC 
                            </Text>
                        ) : null
                    }
                    
                    <TextInput
                        style={styles.introPassCodeInput}
                        secureTextEntry={true}
                        placeholder="ROAD TO TATHVA"
                        onChangeText={(passcode) => this.setState({passcode})}
                        value={this.state.passcode}
                    />
                   
                    <Button
                      title="Begin"
                      onPress={() => this.checkPasscode()}
                    />
                </View>
            );
        } else if ( this.state.currentQuestion == -1 ){
            let round_no = 1;
            if (this.state.answered.length >= 5)
                round_no = 2;
            let round_header;
            if ( this.state.answered.length >= 5) {
                round_header = (
                    <Image source={omkv} resizeMode="contain" style={{width:400, height:300}}/>
                );
            } else {
                round_header = (
                    <Text style={ styles.questionText}>
                        Round 1
                    </Text>
                );
            }
             return (
                <View style={styles.welcome} >
                    { round_header }
                    <View style={styles.grid}>
                    { buttons }
                    </View>
                </View>
            );
        } else  {
            let current = this.state.questions[this.state.currentQuestion];
            return ( 
                <ImageBackground source={this.state.answered.length < 5 ? bgfirst: round2bg} style={{width: '100%', height: '100%'}}>
                <Question
                    text={current.text}
                    qimg={current.qimg}
                    id={this.state.currentQuestion}
                    answer={current.answer}
                    passcode={current.passcode}
                    image={current.image}
                    progress={this.progress}
                />
                </ImageBackground>
            );
        } 
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcome: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeBG: {
        width: '100%',
        height: '100%',
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionText: {
        textAlign: 'center',
        fontSize: 35,
        color:'#fff',
        backgroundColor: '#000'
    },
    intro: {
        padding: 20,
        backgroundColor:'blue',
        fontWeight:'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    introHeader: {
        textAlign:'center',
        fontFamily: "headliner",
        fontSize: 50,
        marginBottom: 20,
        color: 'yellow',
        textShadowColor: 'orange',
        textShadowOffset: {width: -2, height: 2},
        textShadowRadius: 10
    },
    danger: {
        fontSize: 30,
        color: 'red'
    },
    answerInput: {
        height: 50,
        fontSize: 20,
        marginTop:20,
        marginBottom: 20,
        borderRadius:4,
        backgroundColor: '#fff',
        padding:10
    },
    submitButton: {
        padding:20,
    },
    grid: {
        width:320,
        flexWrap: 'wrap',
        justifyContent:'space-around',
        alignItems: 'center',
        flexDirection:'row'
    },
    passCodeInput: {
        fontSize: 40,
        width:225,
        marginBottom: 20,
    },
    introPassCodeInput: {
        fontSize: 40,
        width: 325,
        marginBottom: 20,
    },
    button: {
      marginTop: 30,
      width: 100,
      height: 100,
      alignItems: 'center',
      justifyContent:'center',
      borderColor: '#ffee00',
      borderStyle:'solid',
      borderWidth: 2,
    },
    buttonDisabled: {
      backgroundColor: '#eee',
      borderColor: '#ddd',
    },
    buttonActive: {
      backgroundColor: 'yellow',
    },
    buttonText: {
      textAlign: 'center',
      fontSize: 20,
      padding: 20,
      fontWeight:'bold',
      color: '#000'
    }
});