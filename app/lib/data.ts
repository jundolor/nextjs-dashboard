//import { neon } from "@neondatabase/serverless";
/*
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';*/
//import { formatCurrency } from './utils';



//const sql = neon(process.env.DATABASE_URL!)

export async function fetchRevenue() {
    try{
        // Artificially delay a response for demo purposes.
        // Don't do this in production :)

        // console.log('Fetching revenue data...');
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        //const data = await sql`SELECT * FROM revenue`;

        // console.log('Data fetch completed after 3 seconds.');

        //return data as Revenue[];
        return 'test'
    }
    catch(error){
        console.error('Database error:',error)
        throw new Error('Failed to fetch Revenue data')
    }
}

export async function fetchLatestInvoices(){
    try{
        /*
        const data = await sql `
        SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
        FROM invoices
        JOIN customers ON invoices.customer_id = customers.id
        ORDER BY invoices.date DESC
        LIMIT 5` as LatestInvoiceRaw[]

        const latestInvoices = data.map((invoice) => ({
        ...invoice,
        amount: formatCurrency(invoice.amount),
        }));
        return latestInvoices;*/
        return 'test2'
    }
    catch(error) {
        console.error('Database error:',error)
        throw new Error('Failed to fetch Revenue data')
    }
}