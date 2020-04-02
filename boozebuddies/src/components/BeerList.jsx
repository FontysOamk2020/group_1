import React, { Component } from "react";
import axios from "axios";

import { Button, ListGroup } from "react-bootstrap";
//import "./FriendList.css";



//Beer
//it might be better to have separate Beer.jsx file or maybe some common utility file to contain this kind of small classes
class Beer {
  constructor(id, name, brand, alcoholPercentage) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.alcoholPercentage = alcoholPercentage;
  }
}



class BeerList extends Component {


  constructor(props)
  {
    super(props);

    //Button function binds
    this.sortByBrandClicked = this.sortByBrandClicked.bind(this);
    this.sortByNameClicked = this.sortByNameClicked.bind(this);
    this.sortByAlcoholPClicked = this.sortByAlcoholPClicked.bind(this);


    let beer333 =  new Beer(333, "AKalja", "Merkki", 7.7); //testbeer for debug

    this.state = {

        getBeersCalled: false,
        filterArrayCalled: false,
        beerListUpdated: false,

        beerArray:[beer333],
        beerArrayFiltered:[beer333],

        listOrder: "brand",
        listFilter:"",

        barId: props.barId
        //addBeerState: false
      };
  }


//Fuctions
  componentDidMount()
  {
    //if(!this.state.getBeersCalled)
    this.getBeers();
    this.sortListBy(this.state.listOrder);
  }

componentDidUpdate(prevProps, prevState, snapshot) //this makes component re-render when a proberty in state is changed
{
  if(prevState.listOrder != this.state.listOrder)
  {
    this.sortListBy(this.state.listOrder);
  }


}





  async getBeers()
  {

    let newBeersArray = this.state.beerArray; //creating new array for beer, so setState can be used instead of push


    await axios
      //.get("http://217.101.44.31:8081/api/public/user/getAllUsers") //this will be changed when beerAPI is online
      .get("http://217.101.44.31:8083/api/public/beer/getAllBeers")
      .then(res => {
        console.log(res);

        res.data.beers.forEach((item, i) => {
          const beer = new Beer(item.id, item.name, item.brand, item.alcoholPercentage);

        //  this.setState({beerArray: [this.beerArray, beer]})
          newBeersArray.push(beer);
        });


        //this.sortListBy(this.state.listOrder);
        //this.state.beerArrayFiltered = this.filterListByNamePart(this.state.listFilter); //beerArray can be filtered

        this.setState({ beerArray: newBeersArray });
        //this.setState({ beerListUpdated: true, getBeersCalled: true });
      })
    }


   sortListBy(type) //possible parameters: name/brand/id (string), later ABV
    {
        let newOrderBeerArray = this.state.beerArray;

          if(type == "id" || type == "alcoholPercentage"){
            newOrderBeerArray.sort((a, b) => (a[type] > b[type]) ? 1 : -1);
          }
          else {
            newOrderBeerArray.sort((a, b) => a[type].localeCompare(b[type], undefined, {sensitivity: 'base'})) //ignores case
          }

          this.setState({beerArray: newOrderBeerArray})
    }


    filterListByNamePart(text) //returns beerArray with only beers which name contains given parameter(string)
    {
      if(!null && text !="")
      {
        let filteredArray = this.state.beerArray.filter(beer => beer.name.includes(text))
        return filteredArray
      }
      else
      {
        return this.state.beerArray
      }
    }


    sortByNameClicked(event)
    {
      event.preventDefault()
      //alert(this.props)
      this.setState({listOrder: "name", beerListUpdated: false})

    }

    sortByBrandClicked(event)
    {
      event.preventDefault()
      //alert(this.props)
      this.setState({listOrder: "brand", beerListUpdated: false})

    }

    sortByAlcoholPClicked(event)
    {
      event.preventDefault()
      //alert(this.props)
      this.setState({listOrder: "alcoholPercentage", beerListUpdated: false})

    }







//Render
  render(){

    const {beerArrayFiltered} = this.state
    const {beerListUpdated} = this.state

    return(

      <React.Fragment>

        <h4>Beerlist</h4>

        <Button
          type="submit"
          onClick={this.sortByBrandClicked}
        >
          brand
        </Button>


        <Button
          type="submit"
          onClick={this.sortByNameClicked}
        >
          name
        </Button>

        <Button
          type="submit"
          onClick={this.sortByAlcoholPClicked}
        >
          ABV %
        </Button>



        {this.state.beerArray.map(beer => (
        <ul key={beer.id}>
          {beer.id}: <a href="">{beer.brand} {beer.name}</a>, {beer.alcoholPercentage}%
        </ul>
        ))}

        {this.state.beerListUpdated && <ul>beerlist updated true, bar id: {this.state.barId}</ul> }
      </React.Fragment>
    )



    {//don't know if this is good way to implement this
      this.setState({beerListUpdated:false})
    }
  }



}

export default BeerList;