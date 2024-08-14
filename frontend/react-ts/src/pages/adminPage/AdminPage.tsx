import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


import axios from "axios"

import LoadingButton from "../../components/loadingButton/LoadingButton"
import AuthContext from "../../middleware/authContext"
import MainLayout from "../../components/layouts/MainLayout"
import DragDrop from "../../components/dragDrop/dragDrop"
import Backdrop from "../../components/modal/Backdrop"
import Modal from "../../components/modal/Modal"

import config from "../../config"

import styles from "./AdminPage.module.scss"
import Pagination, { PageInfo } from "../../components/pagination";
import CustomButton from "../../components/Button";
import FloatingInput from "../../components/input/FloatingInput";



const AdminPage = () =>{

    const navigate = useNavigate()

    const {userData} = useContext(AuthContext)

    const [files, setFiles] = useState<File | null>(null);

    const [message, setMessage] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false)


    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        total: 0,
	    page: 0,
	    limit: config.records_per_page_admin,
	    totalPages: 0,
    });
    const [filters, setFilters] = useState<{title:string, authors:string, year:string}>({
        title: '',
        authors: '',
        year: ''});


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!files) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', files);

        try {
            await axios.post(config.api_url + '/api/books/create/bulk', formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : 'Bearer ' + userData?.token
                },
            });
            setMessage('File uploaded successfully!');
            setFilters({
                title: '',
                authors: '',
                year: ''})
        } catch (error) {
            setMessage('Failed to upload file.');
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(config.api_url + '/api/books', { params: {
                    title: filters.title,
                    authors: filters.authors,
                    year: filters.year,
                    page: pageInfo.page,
                    limit : pageInfo.limit
                }, 
                    headers: {
                        "Authorization" : "Bearer " + userData?.token,
                    }
                });
                data.rows.map((row : any)=>{
                    row.actions = <div>
                        <CustomButton label="Edit" link eventHandler={() =>  navigate('/book/'+row.book_id + '/edit')}/>
                        <CustomButton label="Delete" link eventHandler={() =>  deleteBook(row.book_id)}/>
                    </div>
                })
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

        const deleteBook = async (id:number) => {
            try {
                await axios.delete(config.api_url + '/api/books/' + id, {
                    headers: {
                    'Authorization' : 'Bearer ' + userData?.token
                    },
                });
                setMessage('Book deleted!');
                setBooks((books : any) => books.filter((book : any) => book.book_id !== id))
            } catch (error) {
                setMessage('Failed to delete.');
                console.error(error);
            }
        };

        fetchBooks();
    }, [filters, pageInfo.page, pageInfo.limit, userData?.token, navigate]);


    return(
        <MainLayout>
            <div className={styles.pageDiv}>
                
                <p className={styles.pageTitle}>Book Records Management</p>
                <div className={styles.filterDiv}>
                    <div className={styles.inputDiv}>
                        <FloatingInput field="title" label="Title" defaultValue={filters.title} onChangeFunction={(newValue : string) => setFilters({...filters, title:newValue})}/>
                    </div>
                    <div className={styles.inputDiv}>
                        <FloatingInput field="year" label="Year" defaultValue={filters.year} onChangeFunction={(newValue : string) => setFilters({...filters, year:newValue})}/>
                    </div>
                    <div className={styles.inputDiv}>
                        <FloatingInput field="author" label="Author" defaultValue={filters.authors} onChangeFunction={(newValue : string) => setFilters({...filters, authors:newValue})}/>
                    </div>
                    <div className={styles.createRecordsDiv}>
                        <CustomButton label="Create Records" eventHandler={() => setIsModalOpen(true)}></CustomButton>
                    </div>
                </div>
                    
                    <div className="card">
                        <DataTable value={books} rows={pageInfo.limit} tableStyle={{ minWidth: '50rem' }} loading={loading}>
                            <Column field="book_id" header="Id" style={{ width: '10%' }}></Column>
                            <Column field="original_title" header="Title" style={{ width: '40%' }}></Column>
                            <Column field="authors" header="Authors" style={{ width: '25%' }}></Column>
                            <Column field="original_publication_year" header="Publication Year" style={{ width: '15%' }}></Column>
                            <Column field="actions" header="Actions" style={{ width: '10%' }}></Column>
                        </DataTable>
                        <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo}></Pagination>
                    </div>

                {isModalOpen && 
                    <Modal>
                        <div className={styles.modalDiv}>
                            <h2>Upload Excel File</h2>
                            <form onSubmit={handleSubmit}>
                                <DragDrop setFiles={setFiles} fileTypes={["CSV"]}></DragDrop>
                                <LoadingButton type="submit" label={"Submit"} loading={loading}></LoadingButton> 
                            </form>
                            {message && <p>{message}</p>}
                        </div>
                    </Modal>}
                {isModalOpen && <Backdrop onClick={()=>{setIsModalOpen(false); setMessage(""); setFiles(null)}}></Backdrop>}
            </div>
        </MainLayout>
    )
}
export default AdminPage