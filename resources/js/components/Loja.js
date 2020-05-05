import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination';

export default class Loja extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            itemsCountPerPage: 1,
            totalItemsCount: 1,
            pageRangeDisplayed: 3,
            activePage: 1
        }
    }

    loadProducts() {
        axios.get('http://127.0.0.1:8000/api/produtosaprovados').then((response) => {
            if (this._isMounted) {
                this.setState({
                    products: response.data.data,
                    itemsCountPerPage: response.data.per_page,
                    totalItemsCount: response.data.total,
                    activePage: response.data.current_page
                });
            }
        });
    }

    handlePageChange(pageNumber) {
        axios.get('http://127.0.0.1:8000/api/produtosaprovados?page='+pageNumber).then((response) => {
            this.setState({
                products: response.data.data,
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total,
                activePage: response.data.current_page
            });
        });
    }

    componentWillMount() {
        this._isMounted = true;
        this.loadProducts();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        let products = this.state.products.map((product) => {
            return (
                <div className="py-4 col-12 col-md-3" key={ product.id }>
                    <div className="card">
                        <img src={`storage/products/${product.image}`} className="card-img-top" alt="" />
                        <div className="card-body">
                            <h5 className="card-title">{ product.name }</h5>
                            <p className="card-text"><span>R$ </span>{ product.price.toLocaleString('pt-BR') }</p>
                        </div>
                    </div>
                </div>
            );
        });


        return (
            <div className="container">
                <div className="row">
                    { products }
                </div>
                <div className="row py-4 d-flex justify-content-center">
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.itemsCountPerPage}
                        totalItemsCount={this.state.totalItemsCount}
                        pageRangeDisplayed={this.state.pageRangeDisplayed}
                        onChange={this.handlePageChange.bind(this)}
                        itemClass='page-item' 
                        linkClass='page-link'
                    />
                </div>
            </div>
        );
    }
}


if (document.getElementById('loja')) {
    ReactDOM.render(<Loja />, document.getElementById('loja'));
}