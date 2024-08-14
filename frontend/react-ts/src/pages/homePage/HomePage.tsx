import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from 'primereact/button';


import axios from "axios"

import AuthContext from "../../middleware/authContext"
import MainLayout from "../../components/layouts/MainLayout"
import Input from "../../components/input/Input"
import NumberInput from "../../components/input/NumberInput";
import BigSearch from "../../components/bigSearch/bigSearch";

import config from "../../config"

import styles from "./HomePage.module.scss"
import CustomButton from "../../components/Button";
import BookCard from "../../components/bookCard/BookCard";
import Pagination from "../../components/pagination";



const HomePage = () =>{

    const navigate = useNavigate()

    const {userData} = useContext(AuthContext)

    const [books, setBooks] = useState([]);

    const [loading, setLoading] = useState(false);

    const [pageInfo, setPageInfo] = useState({
        total: 0,
	    page: 0,
	    limit: config.records_per_page_home,
	    totalPages: 0,
    });

    const[yearFilter, setYearFilter] = useState("")
    const[titleFilter, setTitleFilter] = useState("")
    const[authorFilter, setAuthorFilter] = useState("")

    const[yearField, setYearField] = useState("")
    const[titleField, setTitleField] = useState("")
    const[authorField, setAuthorField] = useState("")

    

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(config.api_url + '/api/books', { params: {
                    title: titleFilter,
                    authors: authorFilter,
                    year: yearFilter,
                    page: pageInfo.page,
                    limit : pageInfo.limit
                }, 
                    headers: {
                        "Authorization" : "Bearer " + userData?.token,
                    }
                });
                setBooks(data.rows);
                setPageInfo({
                    total: data.total,
                    page: data.page,
                    limit: data.limit,
                    totalPages: data.totalPages,
                });
            } catch (error) {
                console.error('Failed to fetch books', error);
            }
            setLoading(false);
        };

        fetchBooks();
    }, [yearFilter, titleFilter, authorFilter, pageInfo.page, pageInfo.limit, userData?.token]);

    const handleBigSearchSearch = () => {
        setYearFilter(yearField)
        setAuthorFilter(authorField)
        setTitleFilter(titleField)
    }

    return(
        <MainLayout>
            <div className={styles.pageDiv}>
                
                <p className={styles.pageTitle}>Book Records Management</p>

                <div className={styles.filterDiv}>
                    <BigSearch searchArray={[
                        {label : 'Author', value : authorField, setState : setAuthorField},
                        {label : 'Title', value : titleField, setState : setTitleField},
                        {label : 'Year', value : yearField, setState : setYearField}]}
                        button={<CustomButton label="Search" eventHandler={()=>handleBigSearchSearch()}></CustomButton>}></BigSearch>
                    
                </div>

                <div className={styles.cardDiv}>
                    {books.map((book : any) => {
                        return (<BookCard author={book.authors} title={book.original_title} 
                            year={book.original_publication_year} image={book.image_url}></BookCard>)
                    })}
                </div> 

                <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo}></Pagination>
                
            </div>
        </MainLayout>
    )
}
export default HomePage