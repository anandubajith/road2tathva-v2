import React, {Component} from 'react';
import { StyleSheet, Text, TextInput, Button,ImageBackground,View,Image,Alert } from 'react-native';
import ImageSlider from 'react-native-image-slider';

import bgfirst from './assets/bgfirst.jpeg';
import openbg from './assets/openbg.jpeg'
import round2bg from './assets/round2bg.jpeg';
import { AsyncStorage } from 'react-native';
import CountDown from 'react-native-countdown-component';
import question_image_albatross from './assets/question_image_albatross.jpg';
import qprespective from './assets/qprespective.jpeg';
import contact_image from './assets/final_contact.png';
import qtux from './assets/qtux.jpeg';
import omkv from './assets/omkv.jpeg';
import passcode_bg from './assets/passcode_bg.jpeg';
import karma from './assets/karma.jpeg';
// ROUND 1
import albatross from './assets/posters/albatross.jpg'; 
import motoart from './assets/posters/motoart.jpg';
import perspective from './assets/posters/perspective.jpg';
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
// Last question fix progressCode
// TODO: style enhancements
// TODO: shuffle questions

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
        console.log("Has timer: ", storedTimer);
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
                // shake the input box
                // turn red
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
                    <Text style={styles.questionText}>
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
                    text: '2 times 22/7 Ris only information you need, Remember you won\'t get any 💰 here',
                    answer: 'centrecircle',
                    passcode:'yes',
                    image: cc
                },
                {
                    text:'When out of BUCKS it SUCKS',
                    answer:'atmcircle',
                    passcode:'yes',
                    image:atmcircle
                },
                {
                    text:'If your dad is rich you can afford it...With one ring change more you can be at the olympics',
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
                    text:'Did you get your placements?',
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
                <Button title={(j+1).toString()} 
                        disabled={this.state.answered.includes(i)}
                        onPress={() => this.goToQ(i) }key={j}>
                </Button>
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
                // <View style={styles.welcome}>
                <ImageBackground source={openbg} style={styles.welcomeBG}>
                    <Text style = {styles.questionText}>
                    Adventure Club NIT-C 
                    </Text>
                    <TextInput
                        style={styles.passCodeInput}
                        secureTextEntry={true}
                        placeholder="road2tathva"
                        onChangeText={(passcode) => this.setState({passcode})}
                        value={this.state.passcode}
                    />
                    <Button
                      title="Begin"
                      onPress={() => this.checkPasscode()}
                    />
                </ImageBackground>
                // </View>
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
                    { buttons }
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
        backgroundColor: '#333',
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
        // marginTop: 40,
        padding:20,
    },
    passCodeInput: {
        fontSize: 40,
        width:225,
        marginBottom: 20,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
});