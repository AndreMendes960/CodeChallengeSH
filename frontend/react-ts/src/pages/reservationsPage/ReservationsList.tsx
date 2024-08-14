import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


import AuthContext from "../../middleware/authContext"
import MainLayout from "../../components/layouts/MainLayout"
import styles from "./ReservationsList.module.scss"
import Pagination, { PageInfo } from "../../components/pagination";
import CustomButton from "../../components/Button";

import config from "../../config"



const ReservationsList = () =>{

    const navigate = useNavigate()

    const {userData} = useContext(AuthContext)


    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        total: 0,
	    page: 0,
	    limit: config.records_per_page_admin,
	    totalPages: 0,
    });


    useEffect(() => {   
        const fetchReservations = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(config.api_url + '/api/reservations', { params: {
                    page: pageInfo.page,
                    limit : pageInfo.limit
                }, 
                    headers: {
                        "Authorization" : "Bearer " + userData?.token,
                    }
                });
                data.rows.map((row : any)=>{
                    row.actions = <CustomButton label="Delete" link eventHandler={() =>  deleteReservation(row.id)}/>

                })
                setReservations(data.rows);
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

        const deleteReservation = async (id : number) => {
            try {
                await axios.delete(config.api_url + '/api/reservations/' + id ,{
                    headers: {
                        "Authorization" : "Bearer " + userData?.token,
                    }
                }).then(() => {
                    setReservations((prev) => prev.filter((reservation : any) => reservation.id !== id))
                })
            } catch {
                console.log("Error while deleting reservation")
            }
        }

        fetchReservations();
    }, [pageInfo.page, pageInfo.limit, userData?.token, navigate]);


    return(
        <MainLayout>
            <div className={styles.pageDiv}>
                
                <p className={styles.pageTitle}>Reservations Management</p>
                    <div className="card">
                        <DataTable value={reservations} rows={pageInfo.limit} tableStyle={{ minWidth: '50rem' }} loading={loading}>
                            <Column field="id" header="Id" style={{ width: '10%' }}></Column>
                            <Column field="book.original_title" header="Title" style={{ width: '40%' }}></Column>
                            <Column field="user.username" header="Username" style={{ width: '25%' }}></Column>
                            <Column field="user.email" header="Email" style={{ width: '15%' }}></Column>
                            <Column field="actions" header="Actions" style={{ width: '10%' }}></Column>
                        </DataTable>
                        <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo}></Pagination>
                    </div> 
            </div>
        </MainLayout>
    )
}
export default ReservationsList