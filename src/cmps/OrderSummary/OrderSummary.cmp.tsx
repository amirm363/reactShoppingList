import React, { useEffect, useState } from 'react'
import styles from './OrderSummary.module.scss'
import ProductsList from '../ProductsList/ProductsList.cmp'
import axios from 'axios';
import { shallowEqual, useSelector } from 'react-redux';
// MUI
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
// Utils
import { UserDetails } from '../../utils/types';
import { RootState } from '../../state/store';
import { sendDataToDB } from '../../utils/service';


interface OrderSummaryProps {
    backToShopping: React.Dispatch<React.SetStateAction<boolean>>;
}
const OrderSummary = ({ backToShopping }: OrderSummaryProps) => {
    const [userDetails, setUserDetails] = useState<UserDetails>({ fullName: "", address: "", email: "" })
    const [errorFlags, setErrorFlags] = useState<{ [key: string]: boolean }>({ fullName: false, address: false, email: false })
    const [showMsg, setShowMsg] = useState<any>({ msg: "", error: false });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const totalProducts = useSelector(
        (state: RootState) => state.products.totalProducts,
        shallowEqual
    );
    const subSummary = useSelector(
        (state: RootState) => state.chosenProducts.chosenProducts || {},
        shallowEqual
    );

    // Function to gather user details
    const gatherUserDetails = (propertyName: string, value: string) => {
        if (showMsg) {
            setShowMsg({ msg: "", error: false });
        }
        if (errorFlags[propertyName]) {
            setErrorFlags((prevValue: { [key: string]: boolean }) => { return { ...prevValue, [propertyName]: false } })
        }
        // Updating the userDetails state with the new value for the given property
        setUserDetails((prevValue: UserDetails) => {
            return { ...prevValue, [propertyName]: value }
        })
    }

    // Function to validate user details
    const validateUserDetails = () => {
        // Creating a copy of the errorFlags object
        let errFlags: { [key: string]: boolean } = JSON.parse(JSON.stringify(errorFlags))
        let canSendData: boolean = true;
        // Checking if all fields in userDetails have data
        for (let key in userDetails) {
            if (userDetails[key as keyof UserDetails] === "") {
                // If a field is empty, set the corresponding error flag to true and set canSendData to false
                errFlags[key] = true;
                canSendData = false;
            } else if (errFlags[key]) {
                // If a field is not empty and the corresponding error flag is true, set the error flag to false
                errFlags[key] = false;
            }
        }

        // Validating the email using a regular expression
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(userDetails.email)) {
            // If the email is not valid, set the email error flag to true and set canSendData to false
            errFlags.email = true;
            canSendData = false;
        }
        // Updating the errorFlags and showMsg states
        setErrorFlags(errFlags)
        if (!canSendData) {
            setShowMsg({ msg: "חובה למלא את כל השדות על מנת לשלוח את הנתונים", error: true })
        }
        // Returning whether the data can be sent or not
        return canSendData;
    }

    // Function to send data to the server
    const sendDataToServer = async () => {
        try {
            setIsLoading(true);
            // Validating the user details before sending the data
            if (!validateUserDetails()) {
                // If the validation fails, stop the function execution
                return;
            }
            // Function that sends data to service that will later save it to MySQL DB
            const response = await sendDataToDB({ ...userDetails, orderDetails: JSON.stringify(subSummary) })
            if (response) {
                setShowMsg({ msg: "הזמנתך נשלחה בהצלחה!", error: false })
            }

        } catch (err) {
            console.log(err)
            setShowMsg({ msg: "חלה תקלה בשליחת הנתונים, אנא נסה שנית.", error: true })
        } finally {
            setIsLoading(false);
        }

    }


    // useEffect(() => { console.log(userDetails) }, [userDetails])
    return (
        <div className={styles.orderSummaryMainContainer}>
            <ArrowBackRoundedIcon className={styles.backArrow} onClick={() => { backToShopping(false) }} />
            <header>
                <h1>סיכום הזמנה</h1>
            </header>
            <section className={styles.inputsSection}>
                <input type="text" name='fullName' placeholder='שם מלא*' onChange={(e) => gatherUserDetails(e.target.name, e.target.value)} className={`${errorFlags.fullName ? styles.error : ""}`} />
                <input type="text" name='address' placeholder='כתובת מלאה*' onChange={(e) => gatherUserDetails(e.target.name, e.target.value)} className={`${errorFlags.address ? styles.error : ""}`} />
                <input type="email" name='email' placeholder='אימייל*' onChange={(e) => gatherUserDetails(e.target.name, e.target.value)} className={`${errorFlags.email ? styles.error : ""}`} />
            </section>
            <ProductsList header='פירוט הזמנה' isSummary />
            <section className={styles.totalProducts}>
                <span>סה"כ מוצרים</span>
                <span>{totalProducts}</span>
            </section>
            {isLoading ? <CircularProgress /> : <button onClick={sendDataToServer} className={styles.actionButtonStyles}>אשר הזמנה</button>}
            <p className={`${showMsg.error ? styles.errorMsg : ""}`}>{showMsg.msg}</p>
        </div>
    )
}

export default OrderSummary