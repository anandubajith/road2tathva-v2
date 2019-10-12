import React, {Component} from 'react';
import { StyleSheet, Text, TextInput, Button,ImageBackground,View,Image,Alert } from 'react-native';
import bg1 from './assets/bg1.jpeg';
import bg2 from './assets/bg2.jpeg';
import CountDown from 'react-native-countdown-component';
import { AsyncStorage } from 'react-native';

// TODO: shuffle questions
// TODO: admin code for round2 questions
// TODO: fix endscreen bug
// TODO: make all images local

class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input:'',
            correct: false,
            timer: 0
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
            // shake the input box
            // turn red
            // start timer
            this.setState({timer:90});
            await AsyncStorage.setItem("timer", '90');
        }   
    }
    progress() {
        this.setState({correct:false, input:''})
        this.props.progress(this.props.id);
    }
    async clearTimer() {
        this.setState({timer:0});
        await AsyncStorage.setItem("timer", '0');
    }
    render() {
        if ( !this.state.correct) {
            return (
                <View style = { styles.container } >
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
                    <Image source={{uri: this.props.image}}
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
        this.state = {
            questions: [
                {
                    text: "Showcase your skills in capturing delicious sunshine, refreshing rain or bracing winds",
                    answer: "banana",
                    image: "https://firebasestorage.googleapis.com/v0/b/tathva-campus-ambassador.appspot.com/o/events%2F1568722665044-IMG-20190916-WA0142.jpg?alt=media&token=99d3b613-9db7-40db-990f-88bb66789344",
                },
                {
                    text: "Monitie money money hoe chinka chinka chingka-flow",
                    answer: "albatross",
                    image: "https://firebasestorage.googleapis.com/v0/b/tathva-campus-ambassador.appspot.com/o/events%2F1569661795747-IMG-20190928-WA0032.jpg?alt=media&token=245ef914-abc6-49f2-bbef-5f3b9e4b9b56",
                },
                {
                    text: "Question 3",
                    answer: "answer",
                    image: "https://firebasestorage.googleapis.com/v0/b/tathva-campus-ambassador.appspot.com/o/events%2F1569661795747-IMG-20190928-WA0032.jpg?alt=media&token=245ef914-abc6-49f2-bbef-5f3b9e4b9b56",
                },
                {
                    text: "Question 4",
                    answer: "answer",
                    passcode:'iii',
                    image: "https://firebasestorage.googleapis.com/v0/b/tathva-campus-ambassador.appspot.com/o/events%2F1569661795747-IMG-20190928-WA0032.jpg?alt=media&token=245ef914-abc6-49f2-bbef-5f3b9e4b9b56",
                },
                {
                    text:'🔥Question5',
                    answer:'answer',
                    passcode:'idk',
                    image:'https://avatars1.githubusercontent.com/u/3852827?s=400&u=2b00ddc814e649ad25ac46f4d7f19db77ffd665d&v=4'
                }
            ],
            answered: [],
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
    async progress(q_id){
        let answered = this.state.answered;
        answered.push(q_id);
        this.setState({
            currentQuestion: -1,
            passcode:'',
            answered
        });
        await AsyncStorage.setItem("answered",JSON.stringify(answered));
        await AsyncStorage.setItem("currentQuestion", '-1');
        // set currentQuestion as -3 to get passcode,
        // then go to -1
    }
    async checkPasscode(){
        if ( this.state.passcode === "Powlitathva") {
            this.setState({currentQuestion:-1}); 
            await AsyncStorage.setItem("currentQuestion", '-1');   
        }
    }
    async goToQ(q){
        this.setState({currentQuestion:q});
        await AsyncStorage.setItem("currentQuestion", q.toString());
    }
    render() {
        // this should decide which round2
        // based on answered.length , if greater than 5, use set2   
        // FIx get to endscreen bug
        let buttons = [],start, end;
        if ( this.state.answered.length > 2 ) {
            start = 3;
            end = this.state.questions.length
        } else {
            start = 0;
            end = 2;
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
                <View stage={styles.welcome}>
                    <Text style={styles.questions}>
                    Ask passcode
                    </Text>
                </View>
            );
        } else if ( this.state.currentQuestion == -2) {
            return (
                <View style={styles.welcome}>
             {/*   <Video  
                    source={Intro}                          
                    style={styles.backgroundVideo}
                />*/}
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
                </View>
            );
        } else if ( this.state.currentQuestion == -1 ){
             return (
                <View style={styles.welcome} >
                    <Text style={ styles.questionText}>
                    Round 1
                    </Text>
                    { buttons }

                </View>
            );
        } else  if ( this.state.answered.length < 4) {
            let current = this.state.questions[this.state.currentQuestion];
            return ( 
                <ImageBackground source={this.state.currentQuestion % 2? bg1:bg2} style={{width: '100%', height: '100%'}}>
                <Question
                    text={current.text}
                    id={this.state.currentQuestion}
                    answer={current.answer}
                    image={current.image}
                    progress={this.progress}
                />
                </ImageBackground>
            );
        } else {
            return (
                <View style= { styles.container }>
                    <Text style={styles.questionText}>
                        Questions over
                    </Text> 
                     <Text style={styles.questionText}>
                        Display PHone numbers here
                    </Text> 
                </View>
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
    questionText: {
        textAlign: 'center',
        fontSize: 35,
        color:'#fff'
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