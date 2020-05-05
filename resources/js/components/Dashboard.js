import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table,
        Button, 
        Modal,
        ModalHeader,
        ModalFooter,
        ModalBody,
        Input,
        FormGroup,
        Label, 
        Form
    } from 'reactstrap';
import axios from 'axios';
import Pagination from 'react-js-pagination';

export default class Dashboard extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            status: [],
            newProductModal: false,
            newProductData: {
                name: "",
                price: "",
                image: "",
                id_status: "",
                image_file: []
            },
            editProductModal: false,
            editProductData: {
                id: "",
                name: "",
                price: "",
                image: "",
                id_status: "",
                image_file: []
            },
            itemsCountPerPage: 1,
            totalItemsCount: 1,
            pageRangeDisplayed: 3,
            activePage: 1
        }
    }

    async loadProducts() {
        await axios.get('http://127.0.0.1:8000/api/produtos').then((response) => {
            if (this._isMounted) {
                this.setState({
                    products: response.data.data
                });
            }
        });
    }

    async loadStatus() {
        await axios.get('http://127.0.0.1:8000/api/status').then((response) => {
            if (this._isMounted) {
                this.setState({
                    status: response.data
                });
            }
        });
    }

    async addProducts() {
        this.state.newProductData.price = parseFloat(this.state.newProductData.price);
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

        await axios.post('http://127.0.0.1:8000/api/produto/upload', this.state.newProductData.image_file).then((response) => {
            if (!response) {
                this.setState({
                    products,
                    newProductModal: false,
                    newProductData: {
                        name: "",
                        price: "",
                        image: "",
                        id_status: "",
                        image_file: []
                    }
                });
                alert('Falha no upload da imagem!');
                return false;
            }
        });

        await axios.post('http://127.0.0.1:8000/api/produto', this.state.newProductData).then((response) => {
            let { products } = this.state;
            this.loadProducts();

            this.setState({
                products,
                newProductModal: false,
                newProductData: {
                    name: "",
                    price: "",
                    image: "",
                    id_state: "",
                    image_file: []
                }
            });
            
        }).catch((err) => console.log(err));
    }

    editProduct(id, name, price, image, id_status) {
        this.setState({
            editProductData: {
                id,
                name,
                price,
                image,
                id_status
            },
            editProductModal: !this.state.editProductModal
        });
    }

    async updateProduct() {
        let { id, name, price, image, id_status, image_file } = this.state.editProductData;
        price = parseFloat(price);
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

        await axios.post('http://127.0.0.1:8000/api/produto/upload', image_file).then((response) => {
            if (!response) {
                this.setState({
                    products,
                    newProductModal: false,
                    newProductData: {
                        name: "",
                        price: "",
                        image: "",
                        id_status: "",
                        image_file: []
                    }
                });
                alert('Falha no upload da imagem!');
                return false;
            }
        });
        
        await axios.put('http://127.0.0.1:8000/api/produto/'+id, {name, price, image, id_status}).then((response) => {
            this.loadProducts();

            this.setState({
                products,
                editProductModal: false,
                editProductData: {
                    id: "",
                    name: "",
                    price: "",
                    image: "",
                    id_status: "",
                    image_file: []
                }
            });
            
        });
    }

    deleteProduct(id) {

        axios.delete('http://127.0.0.1:8000/api/produto/'+id).then((response) => {
            this.loadProducts();
        });
    }

    toggleNewProductModal() {
        this.setState ({
            newProductModal: !this.state.newProductModal
        });
    }

    toggleEditProductModal() {
        this.setState ({
            editProductModal: !this.state.editProductModal
        });
    }

    handlePageChange(pageNumber) {
        axios.get('http://127.0.0.1:8000/api/produtos?page='+pageNumber).then((response) => {
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
        this.loadStatus();
        this.loadProducts();
        
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        let products = this.state.products.map((product) => {
            let status = this.state.status;
            return (
                <tr key={ product.id }>
                    <td>{ product.id }</td>
                    <td>{ product.name }</td>
                    <td>R$ { product.price.toLocaleString('pt-BR') }</td>
                    <td><img src={`storage/products/${product.image}`} /></td>
                    <td>{ status.map((st) => {
                        if (st.id == product.id_status) return st.description;
                    }) }</td>
                    <td>
                        <Button 
                            color="success" 
                            size="sm" 
                            className="btn btn-lg" 
                            onClick={this.editProduct.bind(this, product.id, product.name, product.price, product.image, product.id_status)}
                        >
                                <i className="fas fa-edit"></i>
                        </Button>
                        <Button 
                            color="danger" 
                            size="sm" 
                            className="btn btn-lg"
                            onClick={this.deleteProduct.bind(this, product.id)} 
                        >
                            <i className="fas fa-trash-alt"></i>
                        </Button>
                    </td>
                </tr>
            );
        });

        let status = this.state.status.map((st) => {
            return (
                <option key={ st.id } value={ st.id } >{ st.description }</option>
            );
        });

        return (
            <div className="container">

                <Button color="primary mt-4 mb-4 text-align-right" onClick={this.toggleNewProductModal.bind(this)}><i className="fas fa-plus-square"></i> Adicionar Novo Produto</Button>
                <Modal isOpen={this.state.newProductModal} fade={false} toggle={this.toggleNewProductModal.bind(this)} >
                    <Form>
                        <ModalHeader toggle={this.toggleNewProductModal.bind(this)}>Novo Produto</ModalHeader>
                            <ModalBody>
                                <FormGroup>
                                    <Label for="name">Nome</Label>
                                    <Input 
                                        type="text" 
                                        name="name" 
                                        id="name" 
                                        value={this.state.newProductData.name} 
                                        onChange={(e) => {
                                            let { newProductData } = this.state;
                                            newProductData.name = e.target.value;
                                            this.setState({ newProductData });
                                        }}
                                        required 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="price">Valor</Label>
                                    <Input 
                                        type="text"
                                        name="price" 
                                        id="price" 
                                        value={this.state.newProductData.price} 
                                        pattern="^\d,\d{2}$" 
                                        onChange={(e) => {
                                            let { newProductData } = this.state;
                                            newProductData.price = e.target.value;
                                            this.setState({ newProductData });
                                        }}
                                        required 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="image">Imagem</Label>
                                    <Input 
                                        type="file" 
                                        name="image" 
                                        id="image" 
                                        onChange={(e) => {
                                            let { newProductData } = this.state;
                                            newProductData.image = e.target.files[0]['name'];
                                            newProductData.image_file = e.target.files[0];
                                        }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="id_status">Status</Label>
                                    <Input 
                                        type="select" 
                                        name="id_status" 
                                        id="id_status" 
                                        required
                                        onChange={(e) => {
                                            let { newProductData } = this.state;
                                            newProductData.id_status = parseInt(e.target.value);
                                            this.setState({ newProductData });
                                        }} >
                                        <option value="" readOnly>---</option>
                                        { status }
                                    </Input>
                                </FormGroup>
                            </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.addProducts.bind(this)}><i className="fas fa-check-square"></i> Adicionar</Button>{' '}
                            <Button color="secondary" onClick={this.toggleNewProductModal.bind(this)}><i className="fas fa-window-close"></i> Cancelar</Button>
                        </ModalFooter>
                    </Form>
                </Modal>

                <Modal isOpen={this.state.editProductModal} fade={false} toggle={this.toggleEditProductModal.bind(this)} >
                    <Form encType="multipart/form-data">
                        
                        <ModalHeader toggle={this.toggleEditProductModal.bind(this)}>Editar Produto</ModalHeader>
                            <ModalBody>
                                <FormGroup>
                                    <Label for="name">Nome</Label>
                                    <Input 
                                        type="text" 
                                        name="name" 
                                        id="name" 
                                        value={this.state.editProductData.name} 
                                        onChange={(e) => {
                                            let { editProductData } = this.state;
                                            editProductData.name = e.target.value;
                                            this.setState({ editProductData });
                                        }}
                                        required 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="price">Valor</Label>
                                    <Input 
                                        type="text"
                                        name="price" 
                                        id="price" 
                                        value={this.state.editProductData.price} 
                                        pattern="^\d,\d{2}$" 
                                        onChange={(e) => {
                                            let { editProductData } = this.state;
                                            editProductData.price = e.target.value;
                                            this.setState({ editProductData });
                                        }}
                                        required 
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="image">Imagem</Label>
                                    <Input 
                                        type="file" 
                                        name="image" 
                                        id="image" 
                                        onChange={(e) => {
                                            let { editProductData } = this.state;
                                            editProductData.image = e.target.files[0]['name'];
                                            editProductData.image_file = e.target.files[0];
                                        }}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="id_status">Status</Label>
                                    <Input 
                                        type="select" 
                                        name="id_status" 
                                        id="id_status" 
                                        value={ this.state.editProductData.id_status }
                                        required
                                        onChange={(e) => {
                                            let { editProductData } = this.state;
                                            editProductData.id_status = parseInt(e.target.value);
                                            this.setState({ editProductData });
                                        }} >
                                        <option value="" readOnly>---</option>
                                        { status }
                                    </Input>
                                </FormGroup>
                            </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.updateProduct.bind(this)}><i className="fas fa-check-square"></i> Confirmar</Button>{' '}
                            <Button color="secondary" onClick={this.toggleEditProductModal.bind(this)}><i className="fas fa-window-close"></i> Cancelar</Button>
                        </ModalFooter>
                    </Form>
                </Modal>

                <Table className="table table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Valor</th>
                            <th>Imagem</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        { products }
                    </tbody>
                </Table>
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


if (document.getElementById('dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('dashboard'));
}