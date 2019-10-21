import React,{Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';


const INGREDIENT_PRICES = {
    salad: 0.4,
    bacon: 0.9,
    cheese: 0.5,
    meat: 1.3
}

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice : 4,
        purchasable: false,
        purchasing:  false,
        loading: false,
    }

    purchaseHandler = () => {
        this.setState((prevState) => {
            return {purchasing: !prevState.purchasing}})
    }

    purchaseContinueHandler = () => {
        //alert('continue to purchase page insert here')
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Colin',
                address: {
                    street: 'TestStreet',
                    zipCode: '84059',
                    country: 'USA'
                },
                email: 'Colin@gmail.com',
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false, purchasing: false});
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false});

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
        this.setState({purchasable:sum>0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount +1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        const newCount = this.state.counter + 1
        this.setState({totalPrice:newPrice, ingredients: updatedIngredients, counter: newCount});
        this.updatePrechaseState(updatedIngredients)
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount
        const priceReduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceReduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePrechaseState(updatedIngredients)
        
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let burgerIngredients = this.state.ingredients;


        let orderSummary = (
            <OrderSummary 
            price = {this.state.totalPrice}
            ingredients = {this.state.ingredients}
            cancel = {this.purchaseHandler}
            continue = {this.purchaseContinueHandler}/>
        )
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
                <Burger ingredients = {burgerIngredients}/>
                <BuildControls 
                 counter = {this.state.counter}
                 ingredientAdded={this.addIngredientHandler} 
                 ingredientRemoved={this.removeIngredientHandler}
                 disabled = {disabledInfo}
                 price = {this.state.totalPrice}
                 purchasable = {this.state.purchasable}
                 purchase = {this.purchaseHandler} 
                 />
            </Aux>
        )
    }
}

export default BurgerBuilder