import React,{Component} from 'react';
import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';


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
        purchasing:  false
    }

    purchaseHandler = () => {
        this.setState({purchasing: !this.state.purchasing})
    }

    purchaseContinueHandler = () => {
        alert('continue to purchase page insert here')
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
        this.setState({totalPrice:newPrice, ingredients: updatedIngredients})
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

        return(
            <Aux>
                <Modal 
                    show={this.state.purchasing}
                    purchasing = {this.purchaseHandler} >
                    <OrderSummary 
                        ingredients = {this.state.ingredients}
                        cancel = {this.purchaseHandler}
                        continue = {this.purchaseContinueHandler}/>
                </Modal>
                <Burger ingredients = {burgerIngredients}/>
                <BuildControls 
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