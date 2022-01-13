import React, { useState, useEffect } from 'react';
import { Card, Pagination, Table } from 'react-bootstrap';
import Select from 'react-select'
import { Product } from '../../types/product.types';
import "./Products.scss";

export default function Products() {

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>('id');
    const [order, setOrder] = useState<string>('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then((data: Product[]) => {
                setAllProducts(data);
                const allCategories = data.map(prod => prod.category);
                const uniqueCategories = allCategories.filter((item, pos) => allCategories.indexOf(item) === pos);
                setCategories(uniqueCategories);
                setLoading(false);
            })
    }, []);

    const products = allProducts.sort((a, b) => {
        let result;
        switch (sortBy) {
            case "rating":
                result = a.rating.rate - b.rating.rate;
                break;
            case "price":
                result = a.price - b.price;
                break;

            default:
                result = a.id - b.id;
                break;
        }
        if (order === "asc") return result;
        return -1 * result;
    }).slice((currentPage - 1) * 5, currentPage * 5);

    const pages = []
    for (let number = 1; number <= allProducts.length / 5; number++) {
        pages.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    return <Card className='products-card'>
        <Card.Header>
            <h3>
                Fake products
            </h3>
            <div>
                <Select options={categories.map(cat => ({ value: cat, label: cat }))} />
            </div>
        </Card.Header>
        <Card.Body>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>
                            <a href='#'>
                                Price
                            </a>
                        </th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => <tr>
                        <td>{product.id}</td>
                        <td className='title'>
                            <div>
                                <img src={product.image} />
                                {product.title}
                            </div>
                        </td>
                        <td>{product.description}</td>
                        <td>{product.price}</td>
                        <td>{product.rating.rate}</td>
                    </tr>)}
                </tbody>
            </Table>
            <Pagination>
                <Pagination.First disabled={currentPage === 1} onClick={() => setCurrentPage(1)}/>
                <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(curr => curr - 1)}/>
                {pages}
                <Pagination.Next disabled={currentPage === allProducts.length / 5} onClick={() => setCurrentPage(curr => curr + 1)}/>
                <Pagination.Last disabled={currentPage === allProducts.length / 5} onClick={() => setCurrentPage(allProducts.length / 5)}/>
            </Pagination>
        </Card.Body>
    </Card>
}
