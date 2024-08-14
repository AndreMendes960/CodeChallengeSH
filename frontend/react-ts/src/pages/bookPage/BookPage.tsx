import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../middleware/authContext";
import axios from "axios";
import config from "../../config";
import MainLayout from "../../components/layouts/MainLayout";
import { ProgressSpinner } from "primereact/progressspinner";

import styles from "./BookPage.module.scss"
import { Rating } from "primereact/rating";
import CustomButton from "../../components/Button";

type Book = {
    authors: string,
    average_rating : number,
    book_id : number,
    goodreads_book_id : number,
    image_url : string,
    isbn : string,
    isbn13 : string
    language_code : string
    original_publication_year : number
    original_title : string,
    work_id : number
}


const BookPage = () => {

    const { id } = useParams();
    const {userData} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [book, setBook] = useState<Book | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(config.api_url + '/api/books/' + id, {
                    headers: {
                        "Authorization" : "Bearer " + userData?.token,
                    }
                });
                setBook(data);
            } catch (error) {
                console.error('Failed to fetch book', error);
                navigate('/404')
            }
            setLoading(false);
        };

        fetchBook();
    }, [id, userData?.token, navigate]);


    return (
        <div>
            <MainLayout>
                {loading ? <div className={styles.loadingDiv}><ProgressSpinner></ProgressSpinner></div> 
                    :
                    book !== null ? <div className={styles.layoutDiv}>
                        <div className={styles.imageDiv}>
                            <img className={styles.image} src={book.image_url}></img>
                        </div>
                        <div className={styles.standardDiv}>
                            <p className={styles.title}>{book.original_title}</p>
                            <Rating value={book.average_rating} disabled cancel={false} />
                            <div className={styles.rowDiv}>
                                <p className={styles.propertyLabel}>Author : </p>
                                <p className={`${styles.propertyLabel} ${styles["value"]}`}>{book.authors}</p>

                                <p className={styles.propertyLabel}>Year : </p>
                                <p className={`${styles.propertyLabel} ${styles["value"]}`}>{book.original_publication_year}</p>

                                <p className={styles.propertyLabel}>ISBN : </p>
                                <p className={`${styles.propertyLabel} ${styles["value"]}`}>{book.isbn}</p>

                                <p className={styles.propertyLabel}>ISBN 13: </p>
                                <p className={`${styles.propertyLabel} ${styles["value"]}`}>{book.isbn13}</p>

                                <p className={styles.propertyLabel}>Language code: </p>
                                <p className={`${styles.propertyLabel} ${styles["value"]}`}>{book.language_code}</p>
                            </div>

                            <div className={styles.rowDiv}>
                                <CustomButton link label="Check #1 Edition" size="large" 
                                    eventHandler={()=> window.open("https://www.goodreads.com/book/show/" + book.goodreads_book_id, "_blank")}></CustomButton>
                                <CustomButton link label="Check all Editions" size="large"
                                    eventHandler={()=> window.open("https://www.goodreads.com/work/editions/" + book.work_id, "_blank")}></CustomButton>
                            </div>

                        </div>
                    </div> 
                    : 
                    <></>
                }
                
            </MainLayout>
        </div>
    );
    
}

export default BookPage;