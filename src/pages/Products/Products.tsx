import React, { useState, useEffect } from 'react';
import { Card, Pagination, Spinner, Table } from 'react-bootstrap';
import Select from 'react-select'
import { Product } from '../../types/product.types';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import "./Products.scss";

export default function Products() {

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>();
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

    const filteredProducts = allProducts.filter(product => !selectedCategory || product.category === selectedCategory);

    const products = filteredProducts.sort((a, b) => {
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
    for (let number = 1; number <= filteredProducts.length / 5; number++) {
        pages.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    const switchOrder = () => setOrder(ord => ord === "asc" ? "desc" : "asc");

    const changeSort = (newSort: string) => {
        if (newSort === sortBy) return switchOrder();

        setSortBy(newSort);
        setOrder("asc");
        setCurrentPage(1);
    }

    const renderArrow = (type: string) => type === "desc" ? <BsChevronUp /> : <BsChevronDown />;

    const disablePagination = filteredProducts.length / 5 <= 1;

    return <Card className='products-card'>
        <Card.Header>
            <h3>
                Fake products
            </h3>
            <div>
                <Select onChange={(newValue) => setSelectedCategory(newValue?.value)} 
                        placeholder="Filter by category" 
                        options={categories.map(cat => ({ value: cat, label: cat }))} 
                        className="select" 
                        isClearable />
            </div>
        </Card.Header>
        {loading ? <Card.Body style={{display: 'flex', justifyContent: 'center', margin: '150px 0'}}>
            <Spinner animation="border" />
        </Card.Body> : <Card.Body>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            <div className='sort' onClick={() => changeSort('id')}>
                                ID
                                {sortBy === "id" && renderArrow(order)}
                            </div>
                        </th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>
                            <div className='sort'  onClick={() => changeSort('price')}>
                                Price
                                {sortBy === "price" && renderArrow(order)}
                            </div>
                        </th>
                        <th>
                            <div className='sort' onClick={() => changeSort('rating')}>
                                Rating
                                {sortBy === "rating" && renderArrow(order)}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => <tr>
                        <td>{product.id}</td>
                        <td className='title'>
                            <div>
                                <img src={product.image} alt='Product'/>
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
                <Pagination.First disabled={disablePagination || currentPage === 1} onClick={() => setCurrentPage(1)} />
                <Pagination.Prev disabled={disablePagination || currentPage === 1} onClick={() => setCurrentPage(curr => curr - 1)} />
                {pages}
                <Pagination.Next disabled={disablePagination || currentPage === filteredProducts.length / 5} onClick={() => setCurrentPage(curr => curr + 1)} />
                <Pagination.Last disabled={disablePagination || currentPage === filteredProducts.length / 5} onClick={() => setCurrentPage(filteredProducts.length / 5)} />
            </Pagination>
        </Card.Body>}
    </Card>
}
