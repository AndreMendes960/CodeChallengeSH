import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';

export type PageInfo = {
    page : number,
    limit : number,
    total : number,
    totalPages : number
}

type Props = {
    pageInfo : PageInfo
    setPageInfo : React.Dispatch<React.SetStateAction<PageInfo>>
}

const Pagination = ({pageInfo, setPageInfo} : Props) => {
    return (
        <div>
            <div className="card">
                <Paginator first={pageInfo.page * pageInfo.limit} rows={pageInfo.limit} totalRecords={pageInfo.total} onPageChange={(event: PaginatorPageChangeEvent) => setPageInfo({...pageInfo, page: event.page})} />
            </div>
        </div>
    );
}

export default Pagination;