import React from 'react'
import styles from './CategoryCard.module.scss'

interface CategoryCardProps {
    categoryName: string;
    products: any;
}
const CategoryCard = ({ categoryName, products }: CategoryCardProps) => {
    return (
        <div className={styles.categoryCarMainContainer}>
            <header>
                <p>{categoryName} - {Object.keys(products).length} מוצרים</p>
            </header>
            <div>
                {Object.entries(products).map((product: any) => {
                    return <p key={product[0]}><span>{product[0]}</span><span>{product[1]}</span></p>
                })}
            </div>
        </div>
    )
}

export default CategoryCard