import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../middleware/authContext";
import axios, { AxiosResponse } from "axios";
import config from "../../config";
import MainLayout from "../../components/layouts/MainLayout";
import { ProgressSpinner } from "primereact/progressspinner";

import FloatingInput from "../../components/input/FloatingInput";

import styles from "./EditBookPage.module.scss"
import CustomButton from "../../components/Button";
import LoadingButton from "../../components/loadingButton/LoadingButton";

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
    best_book_id : number,
    title : string
}

const BookPage = () => {

    const { id } = useParams();
    const {userData} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [loadingButton, setLoadingButton] = useState(false)
    const navigate = useNavigate()

    const [goodreadsBookId, setGoodreadsBookId] = useState<number | null>(null);
    const [bestBookId, setBestBookId] = useState<number | null>(null);
    const [workId, setWorkId] = useState<number | null>(null);
    const [isbn, setIsbn] = useState<string>('');
    const [isbn13, setIsbn13] = useState<string>('');
    const [authors, setAuthors] = useState<string>('');
    const [originalPublicationYear, setOriginalPublicationYear] = useState<number | null>(null);
    const [originalTitle, setOriginalTitle] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [languageCode, setLanguageCode] = useState<string>('');
    const [averageRating, setAverageRating] = useState<number | null>(null);

    const [imageUrl, setImageUrl] = useState<string>('');
    const [imageUrlInput, setImageUrlInput] = useState<string>('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [message, setMessage] = useState("")

    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            try {
                await axios.get(config.api_url + '/api/books/' + id, {
                    headers: {
                        "Authorization" : "Bearer " + userData?.token,
                    }
                }).then((data : AxiosResponse)=>{
                    const bookData : Book = data.data

                    setGoodreadsBookId(bookData.goodreads_book_id);
                    setBestBookId(bookData.best_book_id);
                    setWorkId(bookData.work_id);
                    setIsbn(bookData.isbn);
                    setIsbn13(bookData.isbn13);
                    setAuthors(bookData.authors);
                    setOriginalPublicationYear(bookData.original_publication_year);
                    setOriginalTitle(bookData.original_title);
                    setTitle(bookData.title);
                    setLanguageCode(bookData.language_code);
                    setAverageRating(bookData.average_rating);
                    setImageUrl(bookData.image_url);
                    setImageUrlInput(bookData.image_url)
                })
            } catch (error) {
                console.error('Failed to fetch book', error);
                navigate('/404')
            }
            setLoading(false);
        };

        fetchBook();
    }, [id, userData?.token, navigate]);

    const submit = ( async (e: React.FormEvent)=>{
        e.preventDefault()
        setLoadingButton(true)
        try {

            if(!validateForm())
            {
                setLoadingButton(false)
                return
            }

            await axios.put( config.api_url + `/api/books/${id}`, {
                goodreads_book_id: goodreadsBookId,
                best_book_id: bestBookId,
                work_id: workId,
                isbn: isbn,
                isbn13: isbn13,
                authors: authors,
                original_publication_year: originalPublicationYear,
                original_title: originalTitle,
                title: title,
                language_code: languageCode,
                average_rating: averageRating,
                image_url: imageUrl,
            }, {
                headers: {
                    "Authorization": `Bearer ${userData?.token}`,
                }
            }).then(() => {
                setLoadingButton(false)
                setMessage('Book updated successfully')
            })
        } catch (error) {
            console.error('Error updating book', error);
            setMessage('Error updating book')
        }
    })

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!goodreadsBookId) newErrors.goodreadsBookId = 'Goodreads Book ID is required';
        if (!bestBookId) newErrors.bestBookId = 'Best Book ID is required';
        if (!workId) newErrors.workId = 'Work ID is required';
        if (!isbn) newErrors.isbn = 'ISBN is required';
        if (!isbn13) newErrors.isbn13 = 'ISBN-13 is required';
        if (!authors) newErrors.authors = 'Authors are required';
        if (!originalPublicationYear)
        {
            newErrors.originalPublicationYear = 'Original publication year is required'
        }else if (originalPublicationYear < 0 || originalPublicationYear > 2024)
        {
            newErrors.originalPublicationYear = 'Pick a valid year'
        }
        if (!originalTitle) newErrors.originalTitle = 'Original title is required';
        if (!title) newErrors.title = 'Title is required';
        if (!languageCode) newErrors.languageCode = 'Language code is required';
        if (!averageRating) 
        {
            newErrors.averageRating = 'Average rating is required'
        }else if (averageRating < 0 || averageRating > 5)
        {
            newErrors.averageRating = 'Invalid Average rating'
        }
        if (!imageUrl) newErrors.imageUrl = 'Image URL is required';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return (
        <div>
            <MainLayout>
                {loading ? <div className={styles.loadingDiv}><ProgressSpinner></ProgressSpinner></div> 
                    :
                    <form className={styles.layoutDiv} onSubmit={submit}>
                        <p className={styles.title}>Edit Book Details</p>
                        <div className={`${styles.layoutDiv} ${styles['grid']}`}>

                            <div className={styles.standardDiv}>
                                <div className={styles.wrapperInputDiv}>
                                    <FloatingInput invalid={errors.originalTitle !== undefined} field="original_title" 
                                    defaultValue={originalTitle} label="Original Title" onChangeFunction={setOriginalTitle}></FloatingInput>
                                    {errors.originalTitle !== undefined && <p className={styles.errorMessage}>{errors.originalTitle}</p>}
                                </div>

                                <div className={styles.wrapperInputDiv}>
                                    <FloatingInput invalid={errors.title !== undefined} field="title" 
                                    defaultValue={title} label="Title" onChangeFunction={setTitle}></FloatingInput>
                                    {errors.title !== undefined && <p className={styles.errorMessage}>{errors.title}</p>}
                                </div>

                                <div className={styles.wrapperInputDiv}>
                                    <FloatingInput invalid={errors.authors !== undefined} field="authors" 
                                    defaultValue={authors} label="Authors" onChangeFunction={setAuthors}></FloatingInput>
                                    {errors.authors !== undefined && <p className={styles.errorMessage}>{errors.authors}</p>}
                                </div>

                                <div className={styles.wrapperInputDiv}>
                                    <FloatingInput invalid={errors.originalPublicationYear !== undefined} field="original_publication_year" 
                                    defaultValue={originalPublicationYear} label="Year" onChangeFunction={setOriginalPublicationYear}></FloatingInput>
                                    {errors.originalPublicationYear !== undefined && <p className={styles.errorMessage}>{errors.originalPublicationYear}</p>}
                                </div>

                                <div className={styles.wrapperInputDiv}>
                                    <FloatingInput invalid={errors.isbn !== undefined} field="isbn" 
                                    defaultValue={isbn} label="ISBN" onChangeFunction={setIsbn}></FloatingInput>
                                    {errors.isbn !== undefined && <p className={styles.errorMessage}>{errors.isbn}</p>}
                                </div>

                                <div className={styles.wrapperInputDiv}>
                                    <FloatingInput invalid={errors.isbn13 !== undefined} field="isbn13" 
                                    defaultValue={isbn13} label="ISBN 13" onChangeFunction={setIsbn13}></FloatingInput>
                                    {errors.isbn13 !== undefined && <p className={styles.errorMessage}>{errors.isbn13}</p>}
                                </div>

                                <div className={styles.wrapperInputDiv}>
                                    <FloatingInput invalid={errors.goodreadsBookId !== undefined} field="goodreads_book_id" 
                                    defaultValue={goodreadsBookId} label="GoodReads ID" onChangeFunction={setGoodreadsBookId}></FloatingInput>
                                    {errors.goodreadsBookId !== undefined && <p className={styles.errorMessage}>{errors.goodreadsBookId}</p>}
                                </div>

                                <div className={styles.wrapperInputDiv}>
                                    <FloatingInput invalid={errors.bestBookId !== undefined} field="best_book_id" 
                                    defaultValue={bestBookId} label="GoodReads ID" onChangeFunction={setBestBookId}></FloatingInput>
                                    {errors.bestBookId !== undefined && <p className={styles.errorMessage}>{errors.bestBookId}</p>}
                                </div>

                                <div className={styles.wrapperInputDiv}>
                                    <FloatingInput invalid={errors.workId !== undefined} field="work_id" 
                                    defaultValue={workId} label="Work ID" onChangeFunction={setWorkId}></FloatingInput>
                                    {errors.workId !== undefined && <p className={styles.errorMessage}>{errors.work_id}</p>}
                                </div>

                                <div className={styles.wrapperInputDiv}>
                                    <FloatingInput invalid={errors.languageCode !== undefined} field="language_code" 
                                    defaultValue={languageCode} label="Language Code" onChangeFunction={setLanguageCode}></FloatingInput>
                                    {errors.languageCode !== undefined && <p className={styles.errorMessage}>{errors.languageCode}</p>}
                                </div>

                                <div className={styles.wrapperInputDiv}>
                                    <FloatingInput invalid={errors.averageRating !== undefined} field="average_rating" 
                                    defaultValue={averageRating} label="Average Rating" onChangeFunction={setAverageRating}></FloatingInput>
                                    {errors.averageRating !== undefined && <p className={styles.errorMessage}>{errors.averageRating}</p>}
                                </div>
                            </div>

                            <div className={styles.imageDiv}>
                                <img alt="Book Cover" className={styles.image} src={imageUrl}></img>
                                <div className={styles.wrapperInputDiv}>
                                    <div className={styles.imageInputDiv}>
                                        <FloatingInput invalid={errors.imageUrl !== undefined} field="image_url_input" 
                                        defaultValue={imageUrlInput} label="Image" onChangeFunction={setImageUrlInput}></FloatingInput>
                                        <CustomButton label="Change" eventHandler={()=>setImageUrl(imageUrlInput)}></CustomButton>
                                    </div>
                                    {errors.imageUrl !== undefined && <p className={styles.errorMessage}>{errors.imageUrl}</p>}
                                </div>
                                 
                            </div>

                        </div> 

                        <LoadingButton type="submit" label="Submit" loading={loadingButton}></LoadingButton>
                        {message !== "" && <p>{message}</p>}
                    </form>

                }
                
            </MainLayout>
        </div>
    );
    
}

export default BookPage;