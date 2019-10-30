import React,{Component} from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from '../../store/actions/index';



class BurgerBuilder extends Component {
    state = {
        purchasing:  false,
        loading: false,
        error: false
    }

    componentDidMount(){
        axios.get('https://burger-1e0b5.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients:response.data})
            })
            .catch(error => {
                this.setState({error:true})
            })
    }

    purchaseHandler = () => {
        this.setState((prevState) => {
            return {purchasing: !prevState.purchasing}})
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout')
    }

    updatePrechaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum,el) => {
            return sum + el
        }, 0)
        return sum>0
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

        if(this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients = {this.props.ings}/>
                    <BuildControls 
                    counter = {this.state.counter}
                    ingredientAdded={this.props.onIngredientAdded} 
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled = {disabledInfo}
                    price = {this.props.totalPrice}
                    purchasable = {this.updatePrechaseState(this.props.ings)}
                    purchase = {this.purchaseHandler} 
                    />
                </Aux>
            )
            orderSummary = (
                <OrderSummary 
                price = {this.props.totalPrice}
                ingredients = {this.props.ings}
                cancel = {this.purchaseHandler}
                continue = {this.purchaseContinueHandler}/>
            )
        }
        if(this.state.loading){
            orderSummary = <Spinner />
        }

        return(
            <Aux>
                 <Modal 
                    show={this.state.purchasing}
                    purchasing = {this.purchaseHandler} >
                    {orderSummary}
                </Modal>
               {burger}
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        totalPrice: state.totalPrice
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName))

    }

}


export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(BurgerBuilder,axios))