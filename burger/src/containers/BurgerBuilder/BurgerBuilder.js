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
import * as actionTypes from '../../store/actions';



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
        //alert('continue to purchase page insert here')
        

        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        queryParams.push('price=' + this.props.totalPrice)
        const queryString = queryParams.join('&')
        this.props.history.push({
            pathname: '/checkout',
            search: '&'+ queryString

        })
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

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount +1;
    //     const updatedIngredients = {...this.state.ingredients};
    //     updatedIngredients[type] = updatedCount
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     const newCount = this.state.counter + 1
    //     this.setState({totalPrice:newPrice, ingredients: updatedIngredients, counter: newCount});
    //     this.updatePrechaseState(updatedIngredients)
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount <= 0){
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {...this.state.ingredients};
    //     updatedIngredients[type] = updatedCount
    //     const priceReduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceReduction;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
    //     this.updatePrechaseState(updatedIngredients)
        
    // }

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
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT , ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT , ingredientName: ingName})

    }

}


export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(BurgerBuilder,axios))