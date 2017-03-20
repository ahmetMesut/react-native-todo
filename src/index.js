import React, {Component} from "react";
import {TextInput, Dimensions, StyleSheet, Alert} from "react-native";
import {
    Container,
    Text,
    List,
    ListItem,
    Input,
    InputGroup,
    Content,
    Header,
    Title,
    Button,
    Icon,
    Body
} from "native-base";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


const styles = StyleSheet.create({
    col: {
        paddingTop: height / 6,
        paddingRight: width / 6,
        paddingBottom: height / 6,
        paddingLeft: width / 6
    }
});
export default class Setup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: undefined,
            data: [],
            selectedData: undefined
        }
    }

    render() {
        return (
            <Container>
                <Header><Body><Title>Header</Title></Body></Header>
                <Content keyboardShouldPersistTaps="always">
                    <List>
                        {this.__renderListItem()}
                    </List>

                    <ListItem style={{backgroundColor:"gray"}} itemDivider>
                        <Text style={{flex:11}}>What will you do ?</Text>
                        <Icon name="md-refresh" onPress={this.__onClear} style={{color:"orange",flex:1}}/>
                    </ListItem>
                    <ListItem>
                        <Input style={{flex:12}} returnKeyType="done" placeholder="Todo.."value={this.state.text} onChangeText={(text) => this.setState({text})}/>
                        <Icon name="md-add" style={{color:"green",flex:1}} onPress={this.__onCreate}/>

                    </ListItem>
                </Content>
            </Container>
        );
    }

    __onClear = () => {
        this.setState({text: undefined, selectedData: undefined});
    };

    __onCreate = () => {
        let httpMethodType = "POST";
        if (!this.state.text && !this.state.selectedData) {
            Alert.alert("This input can not be empty.")
        } else {
            let body = {};
            if (this.state.selectedData) {
                httpMethodType = "PUT";
                body.id = this.state.selectedData.id;
                body.todoName = this.state.text;
            } else {
                body.todoName = this.state.text;
            }
            fetch("http://127.0.0.1:8080/todo", {
                method: httpMethodType,
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((res) => res.json()).then((response) => {
                this.__readData();
                this.setState({text: undefined, selectedData: undefined});
                httpMethodType == "POST" ? Alert.alert("Saved success.") : Alert.alert("Updated success.");
            }).catch((error) => {
                console.log(error)
            });
        }
    };

    __onDelete = (row) => {
        fetch("http://127.0.0.1:8080/todo", {
            method: 'DELETE',
            body: JSON.stringify(row),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json()).then((response) => {
            this.__readData();
            Alert.alert("Deleted success.");
        }).catch((error) => {
            console.log(error)
        });
    };

    __renderListItem = () => {
        let arr = [];
        let data = this.state.data;
        for (let i = 0; i < data.length; i++) {
            let color = "white";
            if (this.state.selectedData) {
                if (data[i].id == this.state.selectedData.id) {
                    color = "#d0caca";
                }
            }
            arr.push(
                <ListItem style={{marginLeft:0,backgroundColor:color}} key={i+1}
                          onPress={this.__onClickListItem.bind(undefined,data[i])}>
                    <Icon style={{marginLeft:10,flex:2,color:"green"}} name="md-checkmark-circle-outline"/>
                    <Text style={{flex:11}}>{data[i].todoName}</Text>
                    <Icon style={{flex:1,color:"red"}} name="md-trash"
                          onPress={this.__onDelete.bind(undefined,data[i])}/>
                </ListItem>
            );
        }

        return arr;
    };

    __onClickListItem = (row) => {
        this.setState({selectedData: row, text: row.todoName});
    };

    __readData() {
        fetch("http://127.0.0.1:8080/todo", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json()).then((response) => {
            console.log(response);
            this.setState({data: response});
        }).catch((error) => {
            console.log(error)
        });
    }

    componentDidMount() {
        this.__readData();
    }
}
