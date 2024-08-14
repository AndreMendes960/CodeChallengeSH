
import styles from "./BookCard.module.scss"

type Props = {
    image : string,
    title : string,
    author : string,
    year : number
}

const BookCard = ({image, title, author, year} : Props) => {

    return (
        <a href="https://google.com" className={styles.cardDiv}>
            <div className={styles.imgDiv}>
                <img src={image} className={styles.img}></img>
            </div>
            <div className={styles.detailsDiv}>
                <p className={styles.titleLabel}>{title}</p>
                <p className={styles.authorLabel}>{author}</p>
                <p className={styles.yearLabel}>{year}</p>
            </div>
        </a>
    );
    
}

export default BookCard;