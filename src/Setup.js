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
    },
});
export default class Setup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: undefined,
            data: []
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
                        <Text>What will you do ?</Text>
                    </ListItem>
                    <InputGroup iconRight>
                        <Input returnKeyType="done" placeholder="Todo.." value={this.state.text}
                               onChangeText={(text) => this.setState({text})}/>
                        <Button success onPress={this.__onCreate}><Icon name="md-add"/></Button>
                    </InputGroup>
                </Content>
            </Container>
        );
    }

    __onCreate = () => {

        let body = {};
        body.todoName = this.state.text;
        fetch("http://127.0.0.1:8080/todo", {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json()).then((response) => {
            this.__readData();
            this.setState({text: undefined});
            Alert.alert("Başarı ile kaydedildi.");
        }).catch((error) => {
            console.log(error)
        });
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
            Alert.alert("Başarı ile silindi.");
        }).catch((error) => {
            console.log(error)
        });
    }

    __renderListItem = () => {
        let arr = [];
        let data = this.state.data;
        for (let i = 0; i < data.length; i++) {
            arr.push(
                <ListItem key={i+1}>
                    <Icon style={{flex:2,color:"green"}} name="md-checkmark-circle-outline"/>
                    <Text style={{flex:11}}>{data[i].todoName}</Text>
                    <Icon style={{flex:1,color:"red"}} name="md-trash"
                          onPress={this.__onDelete.bind(undefined,data[i])}/>
                </ListItem>
            );
        }

        return arr;
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
