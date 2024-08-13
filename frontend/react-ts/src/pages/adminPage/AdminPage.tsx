import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Paginator, PaginatorPageChangeEvent  } from 'primereact/paginator';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";


import axios from "axios"

import LoadingButton from "../../components/loadingButton/LoadingButton"
import AuthContext from "../../middleware/authContext"
import MainLayout from "../../components/layouts/MainLayout"
import DragDrop from "../../components/dragDrop/dragDrop"
import Backdrop from "../../components/modal/Backdrop"
import Modal from "../../components/modal/Modal"
import Input from "../../components/inputText/Input"

import config from "../../config"

import styles from "./AdminPage.module.scss"

import "primereact/resources/themes/vela-green/theme.css";

const AdminPage = () =>{

    const navigate = useNavigate()

    const {userData} = useContext(AuthContext)

    const [files, setFiles] = useState<File | null>(null);

    const [message, setMessage] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false)



    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!files) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', files);

        try {
            const response = await axios.post(config.api_url + '/api/books/create/bulk', formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('File uploaded successfully!');
            console.log(response.data);
        } catch (error) {
            setMessage('Failed to upload file.');
            console.error(error);
        }
    };

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState({
        total: 0,
	    page: 0,
	    limit: 25,
	    totalPages: 0,
    });
    const [filters, setFilters] = useState({
        title: '',
        authors: '',
        year: '',
        rating: '',
    });

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(config.api_url + '/api/books', { params: {
                    title: filters.title,
                    authors: filters.authors,
                    year: filters.year,
                    rating: filters.rating, 
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
    }, [filters, pageInfo.page, pageInfo.limit]);



    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    return(
        <MainLayout>
            <div className={styles.pageDiv}>
                
                <p className={styles.pageTitle}>Book Records Management</p>
                <div>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search"> </InputIcon>
                        <InputText v-model="value1" placeholder="Search" />
                    </IconField>
                </div>
                {loading ? <ProgressSpinner />
                    :
                    <div className="card">
                        <DataTable value={books} rows={pageInfo.limit} tableStyle={{ minWidth: '50rem' }}>
                            <Column field="book_id" header="Id" style={{ width: '10%' }}></Column>
                            <Column field="original_title" header="Title" style={{ width: '40%' }}></Column>
                            <Column field="authors" header="Authors" style={{ width: '35%' }}></Column>
                            <Column field="original_publication_year" header="Publication Year" style={{ width: '15%' }}></Column>
                        </DataTable>
                        <div className="card">
                            < Paginator first={pageInfo.page * pageInfo.limit} rows={pageInfo.limit} totalRecords={pageInfo.total} onPageChange={(event: PaginatorPageChangeEvent) => setPageInfo({...pageInfo, page: event.page})} />
                        </div>
                    </div>}

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
                {isModalOpen && <Backdrop onClick={()=>{setIsModalOpen(false)}}></Backdrop>}
            </div>
        </MainLayout>
    )
}
export default AdminPage