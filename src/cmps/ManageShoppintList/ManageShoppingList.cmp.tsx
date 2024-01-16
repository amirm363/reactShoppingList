import React, { useEffect, useState } from 'react'
import styles from './ManageShoppingList.module.scss'
import axios from 'axios'
import { Product } from '../../utils/types'
// MUI
import CircularProgress from '@mui/material/CircularProgress';
// Redux
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { addToCart, sumProducts } from '../../state/totalProducts/productsSlice';
import CategoryCard from '../CategoryCard/CategoryCard.cmp';
import ProductsList from '../ProductsList/ProductsList.cmp';
import { gatherProducts, updateProductCount } from '../../state/orderSummary/orderSummarySlice';
import { fetchDataFromDB } from '../../utils/service';

interface ManageShoppingListProps {
    moveToSummary: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManageShoppingList = ({ moveToSummary }: ManageShoppingListProps) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<any[]>([])
    const [productsByCategory, setProductsByCategory] = useState<{ [key: number]: Product[] }>({})
    const [chosenCategory, setChosenCategory] = useState<any>(null)
    // const [chosenProducts, setChosenProducts] = useState<any>(null)
    const [filteredProducts, setFilteredProduct] = useState<Product[]>([])

    const totalProducts = useSelector(
        (state: RootState) => state.products.totalProducts,
        shallowEqual
    );
    const inCartProducts = useSelector(
        (state: RootState) => state.products.inCartProducts,
        shallowEqual
    );

    const subSummary = useSelector(
        (state: RootState) => state.chosenProducts.chosenProducts || {},
        shallowEqual
    );

    // Function to fetch data from the server
    const fetchData = async () => {
        try {
            // Fetching categories from the server
            const { data: categories } = await fetchDataFromDB('categories')
            // Fetching items from the server
            const { data: items } = await fetchDataFromDB('items')
            // Grouping items by category
            const itemsByCategory = categories.reduce((acc: any, category: any) => {
                acc[category.id] = items.filter((item: Product) => item.category_id === category.id);
                return acc;
            }, {});

            // Updating state with fetched data
            setProductsByCategory(itemsByCategory)
            setCategories(categories)
            setChosenCategory(categories[0])
            setIsLoading(false)
            // console.log("🚀 ~ itemsByCategory ~ itemsByCategory:", itemsByCategory)
        } catch (err) {
            console.log(err)
        }
    }

    // Function to select a category
    const chooseCategory = (id: string) => {
        const selectedId = parseInt(id);
        const selectedCategory = categories.find(category => category.id === selectedId);
        setChosenCategory(selectedCategory)
    }

    // Function to add a product to the sub-summary
    const addProductToSubSum = (product: Product) => {
        let tempSubSum: any = JSON.parse(JSON.stringify(subSummary)) || {};
        const tempChosenCategoryName = chosenCategory.name;
        if (!tempSubSum[tempChosenCategoryName]) {
            tempSubSum[tempChosenCategoryName] = {};
        }
        if (tempSubSum[tempChosenCategoryName][product.name]) {
            tempSubSum[tempChosenCategoryName][product.name] += 1;
        } else {
            tempSubSum[tempChosenCategoryName][product.name] = 1;
        }
        // setChosenProducts((prevValue: any) => { return { ...prevValue, ...tempSubSum } })
        dispatch(gatherProducts(tempSubSum))
    }

    // Function to add or remove a product
    const addOrRemoveProduct = (product: string, toAdd: boolean) => {
        // Find the category of the product
        const categoryName = Object.entries(subSummary).find((category: any) => {
            if (Object.keys(category[1]).includes(product)) {
                return category[0]
            }
        })
        // Update the product count in the the sub summary
        if (categoryName && subSummary[categoryName[0]]) {
            dispatch(updateProductCount({
                categoryName: categoryName[0],
                product,
                count: toAdd ? subSummary[categoryName[0]][product] + 1 : subSummary[categoryName[0]][product] - 1,
            }));
        } else if (chosenCategory && subSummary[chosenCategory.name] && subSummary[chosenCategory.name][product]) {
            dispatch(updateProductCount({
                categoryName: chosenCategory.name,
                product,
                count: toAdd ? subSummary[chosenCategory.name][product] + 1 : subSummary[chosenCategory.name][product] - 1,
            }));
        }

    };

    // Function to search for a product
    const searchProduct = (searchValue: string) => {
        const tempFilteredProducts: Product[] = productsByCategory[chosenCategory.id].filter((product: Product) => {
            if (product.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) {
                return product
            }
        })

        setFilteredProduct(tempFilteredProducts)
    }
    // Function to add products to the cart
    const addProductsToCart = () => {
        if (subSummary) {
            dispatch(sumProducts(subSummary));
            dispatch(addToCart(subSummary));
        }
    }

    // useEffect hook to update the filtered products when the chosen category changes
    useEffect(() => {
        if (chosenCategory) {
            setFilteredProduct(productsByCategory[chosenCategory.id])
        }
    }, [chosenCategory])

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className={styles.manageShoppingListMainContainer}>

            <section className={styles.headerAndCategories}>
                <header>
                    <h1>
                        רשימת קניות
                    </h1>
                </header>

                <p>סה"כ: {totalProducts} מוצרים</p>
                <section className={styles.productsAndCategories}>
                    <input type="text" placeholder='מוצר' onChange={(e) => searchProduct(e.target.value)} />
                    <select name="categories" id="categories" onChange={(e) => chooseCategory(e.target.value)} >
                        {categories.map((category: any) => <option key={category.name} value={category.id}>{category.name}</option>)}
                    </select>
                    <button className={styles.actionButtonStyles} onClick={addProductsToCart}>הוסף לעגלה</button>
                </section>
                <section className={styles.productsAndSubSum}>
                    {isLoading ? <div className={styles.loaderContainer}>
                        <CircularProgress />
                        <p>טוען נתונים</p>
                    </div>
                        :
                        <>
                            <div>
                                <span>מוצרים:</span>
                                <div className={styles.productsContainer}>{chosenCategory && filteredProducts.map((product: Product) => <button key={product.name} onClick={() => addProductToSubSum(product)}>{product.name}</button>)}</div>
                            </div>
                            <ProductsList addOrRemoveProduct={addOrRemoveProduct} header={"תצוגת ביניים:"} />

                        </>
                    }
                </section>


            </section>
            {!!Object.entries(inCartProducts).length && <section className={styles.productsList}>
                <h3>יש לאסוף מוצרים אלו במחלקות המתאימות</h3>
                <div>
                    {Object.entries(inCartProducts).map((category) => {
                        if (!!Object.keys(category[1]).length) {
                            return <CategoryCard key={category[0]} categoryName={category[0]} products={category[1]} />
                        }
                    })}
                </div>
                <button className={styles.actionButtonStyles} onClick={() => moveToSummary(true)}>סיים הזמנה</button>
            </section>}
        </div>
    )
}

export default React.memo(ManageShoppingList);

