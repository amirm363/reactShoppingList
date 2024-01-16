import React from 'react'
import styles from './ProductsList.module.scss'
// MUI
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

interface ProductListProps {

    addOrRemoveProduct?: (product: string, toAdd: boolean) => void
    header?: string;
    isSummary?: boolean;
}

const ProductsList = ({ addOrRemoveProduct, header, isSummary }: ProductListProps) => {
    const cartSummary = useSelector(
        (state: RootState) => state.chosenProducts.chosenProducts || {}
    );

    return (
        <div>
            <span>{header}</span>
            <div className={styles.subSumList}>
                <ul>
                    {cartSummary && Object.entries(cartSummary).map((product: any) =>
                        Object.entries(product[1]).map((prod: any) => {
                            return <li key={prod[0]}>
                                <span className={`${!isSummary ? styles.itemInfo : ""}`}>{prod[0]}</span>
                                <span className={`${!isSummary ? styles.itemInfo : ""}`}>X{prod[1]}</span>
                                {!isSummary && <section>
                                    <button onClick={() => addOrRemoveProduct!(prod[0], false)}><RemoveRoundedIcon /></button>
                                    <button onClick={() => addOrRemoveProduct!(prod[0], true)}><AddRoundedIcon /></button>
                                </section>}
                            </li>
                        })
                    )}
                </ul>
            </div>
        </div>
    )
}

export default ProductsList