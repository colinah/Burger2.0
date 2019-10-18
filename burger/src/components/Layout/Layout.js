import React, { Component } from 'react';
import Aux from '../../hoc/Aux'
import classes from './Layout.module.css'
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state= {
        showSideDrawer: true
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false})
    }
    showSideDrawerHandler = () => {
        this.setState({showSideDrawer:true})
        console.log('clicked')
    }
    render(){

        return (
            <Aux>
                <Toolbar clicked = {this.showSideDrawerHandler}/>
                <SideDrawer 
                    show = {this.state.showSideDrawer}
                    close = {this.sideDrawerClosedHandler} />
                <main className={classes.Content}> 
                    {this.props.children}
                </main>
             </Aux>
        )
    }
}


export default Layout