import axios from 'axios';
import { SummaryPayload } from './types';

// Function that allow to dynamically fetch data from the server 
export const fetchDataFromDB = async (dataType: string) => {
    try {
        const response = await axios.get(`http://localhost:4000/${dataType}`)
        return response;
    } catch (err: any) {
        throw err;
    }
}

// Function that sends data to server
export const sendDataToDB = async (payLoad: SummaryPayload) => {
    console.log("🚀 ~ sendDataToDB ~ payLoad:", payLoad)
    try {
        const { data } = await axios.post('https://localhost:7111/ShoppingSummary', payLoad)
        return data;
    } catch (err: any) {
        throw err;
    }
}