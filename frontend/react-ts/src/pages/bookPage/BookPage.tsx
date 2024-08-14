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
    work_id : number,
    reservations : {id : number, userId : number} | null
}


const BookPage = () => {

    const { id } = useParams();
    const {userData} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [book, setBook] = useState<Book | null>(null)
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState("")

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



    const makeReservation = async () => {
        setErrorMessage("")
        try {
            await axios.post(config.api_url + '/api/reservations' ,{
                bookId : id
            },{
                headers: {
                    "Authorization" : "Bearer " + userData?.token,
                }
            }).then((data) => {
                setBook({...book!, reservations : data.data.res})
            })
        } catch {
            setErrorMessage("Error while making reservation")
        }
    }

    const deleteReservation = async () => {
        setErrorMessage("")
        try {
            await axios.delete(config.api_url + '/api/reservations/' + book!.reservations!.id ,{
                headers: {
                    "Authorization" : "Bearer " + userData?.token,
                }
            }).then(() => {
                setBook({...book!, reservations : null})
            })
        } catch {
            setErrorMessage("Error while deleting reservation")
        }
    }


    let reservationField = <div><a href="/login">Login</a> or<a href="/register">Register</a> to make a reservation</div>
    
    if(book !== null)
    {   
        if(userData !== null && book.reservations === null)
        {
            reservationField = <div className={styles.standardDiv}> 
                <CustomButton label="Make Reservation" eventHandler={()=>(makeReservation())} ></CustomButton>
                {errorMessage !== "" && <p className={styles.errorMessage}>{errorMessage}</p>}
            </div>
        
        }
        else if(userData !== null && book.reservations!.userId !== userData.id)
        {
            reservationField = <div>Someone else made a reservation on this book!</div>
        }
        else if(userData !== null && book.reservations!.userId === userData.id)
        {
            reservationField = <div className={styles.standardDiv}> 
                You have a reservation!
                <CustomButton label="Remove Reservation" eventHandler={()=>deleteReservation()} ></CustomButton>
                {errorMessage !== "" && <p className={styles.errorMessage}>{errorMessage}</p>}
            </div>  
        }
    }

    return (
        <div>
            <MainLayout>
                {loading ? <div className={styles.loadingDiv}><ProgressSpinner></ProgressSpinner></div> 
                    :
                    book !== null ? <div className={styles.layoutDiv}>
                        <div className={styles.imageDiv}>
                            <img className={styles.image} src={book.image_url}></img>

                            {reservationField}
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